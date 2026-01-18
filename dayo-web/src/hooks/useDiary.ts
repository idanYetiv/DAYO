import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type DayEntry = Database['public']['Tables']['days']['Row']
type DayEntryUpdate = Database['public']['Tables']['days']['Update']

/**
 * Fetch day entry for a specific date
 * @param date - Date string in YYYY-MM-DD format
 */
export function useDayEntry(date: string) {
  return useQuery({
    queryKey: ['dayEntry', date],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle()

      if (error) throw error
      return data as DayEntry | null
    },
    enabled: !!date,
  })
}

/**
 * Create or update a day entry (upsert)
 * This hook handles both creating new entries and updating existing ones
 */
export function useUpsertDayEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      date,
      diaryText,
      mood
    }: {
      date: string
      diaryText?: string | null
      mood?: string | null
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // First, check if entry exists
      const { data: existing } = await supabase
        .from('days')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle()

      if (existing) {
        // Update existing entry
        const updates: DayEntryUpdate = {}
        if (diaryText !== undefined) updates.diary_text = diaryText
        if (mood !== undefined) updates.mood = mood

        const { data, error } = await supabase
          .from('days')
          .update(updates)
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data as DayEntry
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('days')
          .insert({
            user_id: user.id,
            date,
            diary_text: diaryText,
            mood,
          })
          .select()
          .single()

        if (error) throw error
        return data as DayEntry
      }
    },
    onSuccess: (data) => {
      // Update the cache with the new/updated entry
      queryClient.setQueryData(['dayEntry', data.date], data)
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['dayEntry', data.date] })
    },
  })
}

/**
 * Debounced upsert hook for auto-saving diary text
 * Use this for text inputs to avoid too many database calls
 * @param delay - Debounce delay in milliseconds (default: 1000ms)
 */
export function useDebouncedUpsertDayEntry(delay: number = 1000) {
  const upsertMutation = useUpsertDayEntry()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedUpsert = useCallback(
    (params: { date: string; diaryText?: string | null; mood?: string | null }) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        upsertMutation.mutate(params)
      }, delay)
    },
    [upsertMutation, delay]
  )

  // Cleanup timeout on unmount
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    debouncedUpsert,
    cleanup,
    isLoading: upsertMutation.isPending,
    error: upsertMutation.error,
  }
}

/**
 * Update only the mood for a specific date
 * This is instant (not debounced) for better UX
 */
export function useUpdateMood() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      date,
      mood
    }: {
      date: string
      mood: string | null
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Check if entry exists
      const { data: existing } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle()

      if (existing) {
        // Update existing entry's mood
        const { data, error } = await supabase
          .from('days')
          .update({ mood })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return data as DayEntry
      } else {
        // Create new entry with just the mood
        const { data, error } = await supabase
          .from('days')
          .insert({
            user_id: user.id,
            date,
            mood,
          })
          .select()
          .single()

        if (error) throw error
        return data as DayEntry
      }
    },
    onMutate: async ({ date, mood }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['dayEntry', date] })

      // Snapshot previous value
      const previousEntry = queryClient.getQueryData<DayEntry>(['dayEntry', date])

      // Optimistically update
      queryClient.setQueryData<DayEntry | null>(
        ['dayEntry', date],
        (old) => old ? { ...old, mood } : null
      )

      return { previousEntry }
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousEntry) {
        queryClient.setQueryData(['dayEntry', variables.date], context.previousEntry)
      }
    },
    onSuccess: (data) => {
      // Update cache with server response
      queryClient.setQueryData(['dayEntry', data.date], data)
    },
  })
}
