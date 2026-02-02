import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { computeInsights, type DiaryInsights } from '../lib/diaryUtils'
import type { Database } from '../lib/supabase'

type DayEntry = Database['public']['Tables']['days']['Row']

export function useDiaryInsights(period: '7d' | '30d' | 'all') {
  return useQuery({
    queryKey: ['diaryInsights', period],
    queryFn: async (): Promise<DiaryInsights> => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (period !== 'all') {
        const days = period === '7d' ? 7 : 30
        const fromDate = new Date()
        fromDate.setDate(fromDate.getDate() - days)
        const fromStr = fromDate.toISOString().split('T')[0]
        query = query.gte('date', fromStr)
      }

      const { data, error } = await query
      if (error) throw error

      return computeInsights((data || []) as DayEntry[])
    },
  })
}
