import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'
import { format, startOfWeek, addDays, subDays, differenceInDays } from 'date-fns'

type Habit = Database['public']['Tables']['habits']['Row']
type HabitInsert = Database['public']['Tables']['habits']['Insert']
type HabitUpdate = Database['public']['Tables']['habits']['Update']
type HabitCompletion = Database['public']['Tables']['habit_completions']['Row']

export type HabitWithCompletions = Habit & {
  completions: HabitCompletion[]
  streak: number
  bestStreak: number
}

/**
 * Calculate current streak for a habit based on completions
 */
function calculateStreak(completions: HabitCompletion[]): number {
  if (completions.length === 0) return 0

  const sortedDates = completions
    .map(c => c.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  // Check if today or yesterday is in the list to start counting
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0
  }

  let streak = 1
  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i - 1])
    const prevDate = new Date(sortedDates[i])
    const diff = differenceInDays(currentDate, prevDate)

    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

/**
 * Calculate best streak for a habit (simplified - tracks in DB later)
 */
function calculateBestStreak(completions: HabitCompletion[]): number {
  if (completions.length === 0) return 0

  const sortedDates = completions
    .map(c => c.date)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  let maxStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currentDate = new Date(sortedDates[i])
    const diff = differenceInDays(currentDate, prevDate)

    if (diff === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else if (diff > 1) {
      currentStreak = 1
    }
  }

  return maxStreak
}

/**
 * Fetch all habits for the current user with their completions
 */
export function useHabits(includeArchived = false) {
  return useQuery({
    queryKey: ['habits', includeArchived],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('habits')
        .select(`
          *,
          completions:habit_completions (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (!includeArchived) {
        query = query.eq('archived', false)
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate streaks for each habit
      return (data as (Habit & { completions: HabitCompletion[] })[]).map(habit => ({
        ...habit,
        streak: calculateStreak(habit.completions),
        bestStreak: calculateBestStreak(habit.completions),
      })) as HabitWithCompletions[]
    },
    enabled: true,
  })
}

/**
 * Create a new habit
 */
export function useCreateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (habitData: Omit<HabitInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('habits')
        .insert({
          ...habitData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return { ...data, completions: [], streak: 0, bestStreak: 0 } as HabitWithCompletions
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

/**
 * Update an existing habit
 */
export function useUpdateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: HabitUpdate }) => {
      const { data, error } = await supabase
        .from('habits')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Habit
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

/**
 * Delete a habit
 */
export function useDeleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] })
      const previousHabits = queryClient.getQueryData<HabitWithCompletions[]>(['habits'])

      queryClient.setQueriesData<HabitWithCompletions[]>(
        { queryKey: ['habits'] },
        (old) => old ? old.filter(habit => habit.id !== id) : []
      )

      return { previousHabits }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits'], context.previousHabits)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

/**
 * Archive a habit (soft delete)
 */
export function useArchiveHabit() {
  const updateHabit = useUpdateHabit()

  return useMutation({
    mutationFn: async (id: string) => {
      return updateHabit.mutateAsync({ id, updates: { archived: true } })
    },
  })
}

/**
 * Toggle habit completion for a specific date
 */
export function useToggleHabitCompletion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ habitId, date }: { habitId: string; date: string }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Check if completion exists
      const { data: existing } = await supabase
        .from('habit_completions')
        .select('id')
        .eq('habit_id', habitId)
        .eq('date', date)
        .single()

      if (existing) {
        // Remove completion
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('id', existing.id)

        if (error) throw error
        return { action: 'removed' as const, habitId, date }
      } else {
        // Add completion
        const { error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habitId,
            user_id: user.id,
            date,
          })

        if (error) throw error
        return { action: 'added' as const, habitId, date }
      }
    },
    onMutate: async ({ habitId, date }) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] })

      const previousHabits = queryClient.getQueryData<HabitWithCompletions[]>(['habits'])

      // Optimistically update
      queryClient.setQueriesData<HabitWithCompletions[]>(
        { queryKey: ['habits'] },
        (old) => old ? old.map(habit => {
          if (habit.id !== habitId) return habit

          const hasCompletion = habit.completions.some(c => c.date === date)
          const newCompletions = hasCompletion
            ? habit.completions.filter(c => c.date !== date)
            : [...habit.completions, { id: 'temp', habit_id: habitId, user_id: '', date, created_at: '' }]

          return {
            ...habit,
            completions: newCompletions,
            streak: calculateStreak(newCompletions),
          }
        }) : []
      )

      return { previousHabits }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits'], context.previousHabits)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
}

/**
 * Check if a habit is completed for a specific date
 */
export function isHabitCompletedForDate(habit: HabitWithCompletions, date: string): boolean {
  return habit.completions.some(c => c.date === date)
}

/**
 * Get week dates (Monday to Sunday)
 */
export function getWeekDates(date: Date = new Date()): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

/**
 * Get completions count for a habit in the current week
 */
export function getWeekCompletionsCount(habit: HabitWithCompletions, weekDates: Date[]): number {
  return weekDates.filter(date =>
    habit.completions.some(c => c.date === format(date, 'yyyy-MM-dd'))
  ).length
}

/**
 * Calculate overall completion rate for a week
 */
export function getWeekCompletionRate(habits: HabitWithCompletions[], weekDates: Date[]): number {
  if (habits.length === 0) return 0

  const totalPossible = habits.length * weekDates.length
  const totalCompleted = habits.reduce((sum, habit) =>
    sum + getWeekCompletionsCount(habit, weekDates), 0
  )

  return Math.round((totalCompleted / totalPossible) * 100)
}
