import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']
type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

/**
 * Fetch all tasks for the current user
 * Optionally filter by date (YYYY-MM-DD format)
 */
export function useTasks(date?: string) {
  return useQuery({
    queryKey: ['tasks', date],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (date) {
        query = query.eq('date', date)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Task[]
    },
    enabled: true,
  })
}

/**
 * Create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskData: Omit<TaskInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onSuccess: (newTask) => {
      // Optimistically update the cache for the task's date
      queryClient.setQueryData<Task[]>(
        ['tasks', newTask.date],
        (old) => old ? [...old, newTask] : [newTask]
      )
      // Also update the general tasks query
      queryClient.setQueryData<Task[]>(
        ['tasks', undefined],
        (old) => old ? [...old, newTask] : [newTask]
      )
      // Invalidate to refetch and ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Update an existing task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Task
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      // Snapshot previous values
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      // Optimistically update
      queryClient.setQueriesData<Task[]>(
        { queryKey: ['tasks'] },
        (old) => old ? old.map(task =>
          task.id === id ? { ...task, ...updates } : task
        ) : []
      )

      return { previousTasks }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      // Snapshot previous values
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

      // Optimistically remove from cache
      queryClient.setQueriesData<Task[]>(
        { queryKey: ['tasks'] },
        (old) => old ? old.filter(task => task.id !== id) : []
      )

      return { previousTasks }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks)
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Toggle task completion status
 */
export function useToggleTask() {
  const updateTask = useUpdateTask()

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return updateTask.mutateAsync({ id, updates: { completed } })
    },
  })
}
