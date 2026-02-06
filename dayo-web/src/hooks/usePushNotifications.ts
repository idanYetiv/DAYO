import { useEffect, useCallback, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PushNotifications, type Token, type ActionPerformed } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

type PushPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unknown'

interface UsePushNotificationsReturn {
  /** Request push notification permission and register token */
  requestPermission: () => Promise<boolean>
  /** Current permission status */
  permissionStatus: PushPermissionStatus
  /** Whether push is supported on this platform */
  isSupported: boolean
  /** Whether we're currently registering */
  isRegistering: boolean
  /** Error message if registration failed */
  error: string | null
}

/**
 * Hook to manage push notifications on iOS/Android
 * - Requests permission
 * - Registers device token with backend
 * - Handles token refresh
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [permissionStatus, setPermissionStatus] = useState<PushPermissionStatus>('unknown')
  const [error, setError] = useState<string | null>(null)

  const isNative = Capacitor.isNativePlatform()
  const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web'

  // Mutation to save device token
  const saveToken = useMutation({
    mutationFn: async (token: string) => {
      if (!user?.id) throw new Error('Not authenticated')

      // Upsert token (update if exists, insert if not)
      const { error: upsertError } = await supabase
        .from('device_tokens')
        .upsert(
          {
            user_id: user.id,
            token,
            platform,
            device_name: getDeviceName(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'token',
          }
        )

      if (upsertError) throw upsertError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device_tokens', user?.id] })
    },
    onError: (err) => {
      console.error('Failed to save push token:', err)
      setError('Failed to register for notifications')
    },
  })

  // Get a friendly device name
  const getDeviceName = (): string => {
    if (platform === 'ios') return 'iPhone'
    if (platform === 'android') return 'Android'
    return 'Web'
  }

  // Check current permission status
  const checkPermissionStatus = useCallback(async () => {
    if (!isNative) {
      setPermissionStatus('unknown')
      return
    }

    try {
      const result = await PushNotifications.checkPermissions()
      if (result.receive === 'granted') {
        setPermissionStatus('granted')
      } else if (result.receive === 'denied') {
        setPermissionStatus('denied')
      } else {
        setPermissionStatus('prompt')
      }
    } catch (err) {
      console.error('Error checking push permissions:', err)
      setPermissionStatus('unknown')
    }
  }, [isNative])

  // Request permission and register
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isNative) {
      console.log('Push notifications not supported on web')
      return false
    }

    if (!user?.id) {
      setError('Must be logged in to enable notifications')
      return false
    }

    try {
      setError(null)

      // Request permission
      const permResult = await PushNotifications.requestPermissions()

      if (permResult.receive === 'granted') {
        setPermissionStatus('granted')

        // Register with APNs/FCM to get token
        await PushNotifications.register()
        return true
      } else {
        setPermissionStatus('denied')
        return false
      }
    } catch (err) {
      console.error('Error requesting push permission:', err)
      setError('Failed to request notification permission')
      return false
    }
  }, [isNative, user?.id])

  // Set up listeners for token and notifications
  useEffect(() => {
    if (!isNative) return

    // Check initial permission status
    checkPermissionStatus()

    // Listen for successful registration (token received)
    const registrationListener = PushNotifications.addListener(
      'registration',
      (token: Token) => {
        console.log('Push registration success, token:', token.value.substring(0, 20) + '...')
        saveToken.mutate(token.value)
      }
    )

    // Listen for registration errors
    const errorListener = PushNotifications.addListener(
      'registrationError',
      (error) => {
        console.error('Push registration error:', error)
        setError('Failed to register for push notifications')
      }
    )

    // Listen for notification received while app is open
    const receivedListener = PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received:', notification)
        // Could show an in-app toast here
      }
    )

    // Listen for notification tapped
    const actionListener = PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push notification action:', notification)
        // Could navigate to specific screen based on notification data
      }
    )

    // Cleanup listeners on unmount
    return () => {
      registrationListener.then(l => l.remove())
      errorListener.then(l => l.remove())
      receivedListener.then(l => l.remove())
      actionListener.then(l => l.remove())
    }
  }, [isNative, checkPermissionStatus, saveToken])

  return {
    requestPermission,
    permissionStatus,
    isSupported: isNative,
    isRegistering: saveToken.isPending,
    error,
  }
}

/**
 * Hook to remove device token (for logout or disabling notifications)
 */
export function useRemoveDeviceToken() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (token?: string) => {
      if (!user?.id) return

      if (token) {
        // Remove specific token
        await supabase
          .from('device_tokens')
          .delete()
          .eq('token', token)
      } else {
        // Remove all tokens for this user (e.g., on logout)
        await supabase
          .from('device_tokens')
          .delete()
          .eq('user_id', user.id)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device_tokens', user?.id] })
    },
  })
}
