import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type DayEntry = Database['public']['Tables']['days']['Row']

export function useUpdateTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ date, tags }: { date: string; tags: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: existing } = await supabase
        .from('days')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle()

      if (existing) {
        const { data, error } = await supabase
          .from('days')
          .update({ tags })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        return data as DayEntry
      } else {
        const { data, error } = await supabase
          .from('days')
          .insert({ user_id: user.id, date, tags })
          .select()
          .single()
        if (error) throw error
        return data as DayEntry
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['dayEntry', data.date], data)
      queryClient.invalidateQueries({ queryKey: ['dayEntry', data.date] })
    },
  })
}

export function useToggleBookmark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ date, bookmarked }: { date: string; bookmarked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: existing } = await supabase
        .from('days')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle()

      if (existing) {
        const { data, error } = await supabase
          .from('days')
          .update({ bookmarked })
          .eq('id', existing.id)
          .select()
          .single()
        if (error) throw error
        return data as DayEntry
      } else {
        const { data, error } = await supabase
          .from('days')
          .insert({ user_id: user.id, date, bookmarked })
          .select()
          .single()
        if (error) throw error
        return data as DayEntry
      }
    },
    onMutate: async ({ date, bookmarked }) => {
      await queryClient.cancelQueries({ queryKey: ['dayEntry', date] })
      const previous = queryClient.getQueryData<DayEntry>(['dayEntry', date])
      queryClient.setQueryData<DayEntry | null>(
        ['dayEntry', date],
        (old) => old ? { ...old, bookmarked } : null
      )
      return { previous }
    },
    onError: (_err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['dayEntry', variables.date], context.previous)
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['dayEntry', data.date], data)
    },
  })
}
