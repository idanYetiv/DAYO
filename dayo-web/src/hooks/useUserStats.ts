import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type UserStats = Database['public']['Tables']['user_stats']['Row']
type UserStatsInsert = Database['public']['Tables']['user_stats']['Insert']
type UserStatsUpdate = Database['public']['Tables']['user_stats']['Update']

/**
 * Fetch user statistics (streaks, activity tracking)
 */
export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ['user_stats', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        // If user stats don't exist, return default values
        if (error.code === 'PGRST116') {
          return null
        }
        throw error
      }

      return data as UserStats
    },
    enabled: !!userId,
  })
}

/**
 * Initialize user stats (creates a new stats record)
 */
export function useInitializeUserStats() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const statsData: UserStatsInsert = {
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null,
      }

      const { data, error } = await supabase
        .from('user_stats')
        .insert(statsData)
        .select()
        .single()

      if (error) throw error
      return data as UserStats
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user_stats', data.user_id], data)
      queryClient.invalidateQueries({ queryKey: ['user_stats', data.user_id] })
    },
  })
}

/**
 * Update user streak based on activity
 * Automatically calculates streak continuation or reset
 */
export function useUpdateStreak() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      // Get current user stats
      const { data: currentStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      const today = new Date().toISOString().split('T')[0]

      let newStreak = 1
      let newLongestStreak = 1

      if (currentStats) {
        const lastActiveDate = currentStats.last_active_date

        // If already active today, don't update
        if (lastActiveDate === today) {
          return currentStats as UserStats
        }

        // Check if streak continues (activity yesterday)
        if (lastActiveDate) {
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]

          if (lastActiveDate === yesterdayStr) {
            // Continue streak
            newStreak = currentStats.current_streak + 1
            newLongestStreak = Math.max(newStreak, currentStats.longest_streak)
          } else {
            // Reset streak
            newStreak = 1
            newLongestStreak = currentStats.longest_streak
          }
        }

        // Update existing stats
        const updates: UserStatsUpdate = {
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_active_date: today,
        }

        const { data, error } = await supabase
          .from('user_stats')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single()

        if (error) throw error
        return data as UserStats
      } else {
        // Create new stats record
        const statsData: UserStatsInsert = {
          user_id: userId,
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          last_active_date: today,
        }

        const { data, error } = await supabase
          .from('user_stats')
          .insert(statsData)
          .select()
          .single()

        if (error) throw error
        return data as UserStats
      }
    },
    onSuccess: (data) => {
      // Update cache with new stats
      queryClient.setQueryData(['user_stats', data.user_id], data)
      queryClient.invalidateQueries({ queryKey: ['user_stats', data.user_id] })
    },
  })
}

/**
 * Manually update user stats
 */
export function useUpdateUserStats() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: UserStatsUpdate }) => {
      const { data, error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return data as UserStats
    },
    onMutate: async ({ userId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user_stats', userId] })

      // Snapshot previous value
      const previousStats = queryClient.getQueryData<UserStats>(['user_stats', userId])

      // Optimistically update
      if (previousStats) {
        queryClient.setQueryData(['user_stats', userId], {
          ...previousStats,
          ...updates,
        })
      }

      return { previousStats }
    },
    onError: (_err, { userId }, context) => {
      // Rollback on error
      if (context?.previousStats) {
        queryClient.setQueryData(['user_stats', userId], context.previousStats)
      }
    },
    onSettled: (_data, _error, { userId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['user_stats', userId] })
    },
  })
}

/**
 * Get aggregated statistics (tasks completed, diary entries, etc.)
 * This is a computed query that fetches data from multiple tables
 */
export function useAggregatedStats(userId: string) {
  return useQuery({
    queryKey: ['aggregated_stats', userId],
    queryFn: async () => {
      // Fetch total tasks completed
      const { count: tasksCompleted, error: tasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true)

      if (tasksError) throw tasksError

      // Fetch diary entries this month
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0]

      const { count: diaryEntriesThisMonth, error: diaryError } = await supabase
        .from('days')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('date', firstDayOfMonth)
        .not('diary_text', 'is', null)

      if (diaryError) throw diaryError

      // Fetch tasks completed this week
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      startOfWeek.setHours(0, 0, 0, 0)
      const weekStart = startOfWeek.toISOString()

      const { count: tasksCompletedThisWeek, error: weekTasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('updated_at', weekStart)

      if (weekTasksError) throw weekTasksError

      return {
        totalTasksCompleted: tasksCompleted || 0,
        tasksCompletedThisWeek: tasksCompletedThisWeek || 0,
        diaryEntriesThisMonth: diaryEntriesThisMonth || 0,
      }
    },
    enabled: !!userId,
  })
}
