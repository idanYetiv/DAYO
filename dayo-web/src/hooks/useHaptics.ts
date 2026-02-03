import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { isNativePlatform } from '../lib/platform'

export function useHaptics() {
  const isNative = isNativePlatform()

  async function impact(style: 'light' | 'medium' | 'heavy') {
    if (!isNative) return
    const styleMap = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    }
    await Haptics.impact({ style: styleMap[style] })
  }

  async function notification(type: 'success' | 'warning' | 'error') {
    if (!isNative) return
    const typeMap = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    }
    await Haptics.notification({ type: typeMap[type] })
  }

  return { impact, notification }
}
