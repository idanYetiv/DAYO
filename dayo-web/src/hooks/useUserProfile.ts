import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

/**
 * Fetch the current user's profile
 * Creates a profile if one doesn't exist
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Try to get existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({ user_id: user.id })
          .select()
          .single()

        if (createError) throw createError
        return newProfile as UserProfile
      }

      if (error) throw error
      return data as UserProfile
    },
    enabled: true,
  })
}

/**
 * Update the current user's profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Omit<UserProfileUpdate, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as UserProfile
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] })

      const previousProfile = queryClient.getQueryData<UserProfile>(['userProfile'])

      // Optimistically update
      queryClient.setQueryData<UserProfile>(
        ['userProfile'],
        (old) => old ? { ...old, ...updates } : old
      )

      return { previousProfile }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile'], context.previousProfile)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
  })
}

/**
 * Export all user data as JSON
 */
export function useExportUserData() {
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Fetch all user data in parallel
      const [
        { data: profile },
        { data: days },
        { data: tasks },
        { data: goals },
        { data: milestones },
        { data: habits },
        { data: habitCompletions },
        { data: userStats },
      ] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('days').select('*').eq('user_id', user.id),
        supabase.from('tasks').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('milestones').select('*').eq('user_id', user.id),
        supabase.from('habits').select('*').eq('user_id', user.id),
        supabase.from('habit_completions').select('*').eq('user_id', user.id),
        supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
      ])

      const exportData = {
        exportedAt: new Date().toISOString(),
        user: {
          email: user.email,
          id: user.id,
        },
        profile,
        stats: userStats,
        days,
        tasks,
        goals,
        milestones,
        habits,
        habitCompletions,
      }

      return exportData
    },
  })
}

/**
 * Delete user account and all data
 */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Delete all user data (RLS will ensure only user's data is deleted)
      // Tables with ON DELETE CASCADE will handle related data
      await Promise.all([
        supabase.from('user_profiles').delete().eq('user_id', user.id),
        supabase.from('days').delete().eq('user_id', user.id),
        supabase.from('tasks').delete().eq('user_id', user.id),
        supabase.from('goals').delete().eq('user_id', user.id),
        supabase.from('habits').delete().eq('user_id', user.id),
        supabase.from('user_stats').delete().eq('user_id', user.id),
      ])

      // Sign out the user
      await supabase.auth.signOut()

      return true
    },
  })
}

/**
 * Change user password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      return true
    },
  })
}
