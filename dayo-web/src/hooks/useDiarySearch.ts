import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type DayEntry = Database['public']['Tables']['days']['Row']

export interface DiarySearchFilters {
  query: string
  mood: string | null
  dateFrom: string | null
  dateTo: string | null
  hasPhotos: boolean
  hasGratitude: boolean
  hasHighlights: boolean
  tags: string[]
  bookmarked: boolean
}

export const defaultFilters: DiarySearchFilters = {
  query: '',
  mood: null,
  dateFrom: null,
  dateTo: null,
  hasPhotos: false,
  hasGratitude: false,
  hasHighlights: false,
  tags: [],
  bookmarked: false,
}

export function hasActiveFilters(filters: DiarySearchFilters): boolean {
  return (
    filters.query.trim() !== '' ||
    filters.mood !== null ||
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.hasPhotos ||
    filters.hasGratitude ||
    filters.hasHighlights ||
    filters.tags.length > 0 ||
    filters.bookmarked
  )
}

export function useDiarySearch(filters: DiarySearchFilters, enabled: boolean) {
  return useQuery({
    queryKey: ['diarySearch', filters],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (filters.query.trim()) {
        query = query.ilike('diary_text', `%${filters.query.trim()}%`)
      }

      if (filters.mood) {
        query = query.eq('mood', filters.mood)
      }

      if (filters.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }

      if (filters.dateTo) {
        query = query.lte('date', filters.dateTo)
      }

      if (filters.bookmarked) {
        query = query.eq('bookmarked', true)
      }

      const { data, error } = await query

      if (error) throw error

      let results = data as DayEntry[]

      // Client-side filters for array/JSON columns
      if (filters.hasPhotos) {
        results = results.filter(e => e.photos && e.photos.length > 0)
      }

      if (filters.hasGratitude) {
        results = results.filter(e => e.gratitude && e.gratitude.length > 0)
      }

      if (filters.hasHighlights) {
        results = results.filter(e => e.highlights && e.highlights.length > 0)
      }

      if (filters.tags.length > 0) {
        results = results.filter(e =>
          e.tags && filters.tags.some(tag => e.tags.includes(tag))
        )
      }

      return results
    },
    enabled: enabled && hasActiveFilters(filters),
  })
}
