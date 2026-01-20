import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Goal = Database['public']['Tables']['goals']['Row']
type GoalInsert = Database['public']['Tables']['goals']['Insert']
type GoalUpdate = Database['public']['Tables']['goals']['Update']
type Milestone = Database['public']['Tables']['milestones']['Row']
type MilestoneInsert = Database['public']['Tables']['milestones']['Insert']
type MilestoneUpdate = Database['public']['Tables']['milestones']['Update']

export type GoalWithMilestones = Goal & { milestones: Milestone[] }

/**
 * Fetch all goals for the current user with their milestones
 * Optionally filter by category
 */
export function useGoals(category?: 'yearly' | 'monthly' | 'weekly') {
  return useQuery({
    queryKey: ['goals', category],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('goals')
        .select(`
          *,
          milestones (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      return data as GoalWithMilestones[]
    },
    enabled: true,
  })
}

/**
 * Calculate goal progress based on completed milestones
 */
export function calculateGoalProgress(goal: GoalWithMilestones): number {
  if (!goal.milestones || goal.milestones.length === 0) return 0
  const completed = goal.milestones.filter(m => m.completed).length
  return Math.round((completed / goal.milestones.length) * 100)
}

/**
 * Create a new goal
 */
export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goalData: Omit<GoalInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goalData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return { ...data, milestones: [] } as GoalWithMilestones
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

/**
 * Update an existing goal
 */
export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: GoalUpdate }) => {
      const { data, error } = await supabase
        .from('goals')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

/**
 * Delete a goal (cascades to milestones)
 */
export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['goals'] })
      const previousGoals = queryClient.getQueryData<GoalWithMilestones[]>(['goals'])

      queryClient.setQueriesData<GoalWithMilestones[]>(
        { queryKey: ['goals'] },
        (old) => old ? old.filter(goal => goal.id !== id) : []
      )

      return { previousGoals }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(['goals'], context.previousGoals)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

/**
 * Create a new milestone for a goal
 */
export function useCreateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (milestoneData: Omit<MilestoneInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('milestones')
        .insert({
          ...milestoneData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as Milestone
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

/**
 * Update a milestone
 */
export function useUpdateMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: MilestoneUpdate }) => {
      const { data, error } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Milestone
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

/**
 * Delete a milestone
 */
export function useDeleteMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

/**
 * Toggle milestone completion status
 */
export function useToggleMilestone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { data, error } = await supabase
        .from('milestones')
        .update({ completed })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Milestone
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ['goals'] })

      const previousGoals = queryClient.getQueryData<GoalWithMilestones[]>(['goals'])

      // Optimistically update
      queryClient.setQueriesData<GoalWithMilestones[]>(
        { queryKey: ['goals'] },
        (old) => old ? old.map(goal => ({
          ...goal,
          milestones: goal.milestones.map(m =>
            m.id === id ? { ...m, completed } : m
          )
        })) : []
      )

      return { previousGoals }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(['goals'], context.previousGoals)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}

/**
 * Get goal statistics
 */
export function useGoalStats() {
  const { data: goals } = useGoals()

  if (!goals) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
    }
  }

  return {
    total: goals.length,
    completed: goals.filter(g => calculateGoalProgress(g) === 100).length,
    inProgress: goals.filter(g => {
      const progress = calculateGoalProgress(g)
      return progress > 0 && progress < 100
    }).length,
  }
}
