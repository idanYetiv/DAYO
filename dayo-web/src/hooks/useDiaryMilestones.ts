import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type DiaryMilestoneId } from '../lib/supabase'

// Milestone definitions
export const DIARY_MILESTONES = {
  first_entry: {
    id: 'first_entry' as DiaryMilestoneId,
    title: 'First Steps',
    description: 'Wrote your first diary entry',
    emoji: '🌱',
    threshold: { entries: 1 },
  },
  words_100: {
    id: 'words_100' as DiaryMilestoneId,
    title: 'Finding Your Voice',
    description: 'Wrote 100 words total',
    emoji: '✍️',
    threshold: { words: 100 },
  },
  words_1000: {
    id: 'words_1000' as DiaryMilestoneId,
    title: 'Storyteller',
    description: 'Wrote 1,000 words total',
    emoji: '📖',
    threshold: { words: 1000 },
  },
  words_10000: {
    id: 'words_10000' as DiaryMilestoneId,
    title: 'Master Writer',
    description: 'Wrote 10,000 words total',
    emoji: '🏆',
    threshold: { words: 10000 },
  },
} as const

export type MilestoneInfo = typeof DIARY_MILESTONES[keyof typeof DIARY_MILESTONES]

interface UseDiaryMilestonesOptions {
  userId: string
  isKidsMode?: boolean
}

interface MilestoneCheckResult {
  newMilestone: MilestoneInfo | null
  totalEntries: number
  totalWords: number
}

export function useDiaryMilestones({ userId, isKidsMode = false }: UseDiaryMilestonesOptions) {
  const queryClient = useQueryClient()
  const [pendingMilestone, setPendingMilestone] = useState<MilestoneInfo | null>(null)

  // Count words in text (simple implementation)
  const countWords = useCallback((text: string): number => {
    if (!text) return 0
    // Strip HTML tags if present
    const plainText = text.replace(/<[^>]*>/g, ' ')
    // Split on whitespace and filter empty strings
    return plainText.split(/\s+/).filter(word => word.length > 0).length
  }, [])

  // Update milestone stats mutation
  const updateMilestoneStats = useMutation({
    mutationFn: async ({
      entryWordCount,
      isNewEntry,
    }: {
      entryWordCount: number
      isNewEntry: boolean
    }): Promise<MilestoneCheckResult> => {
      // Fetch current stats
      const { data: currentStats, error: fetchError } = await supabase
        .from('user_stats')
        .select('total_diary_entries, total_word_count, milestones_achieved')
        .eq('user_id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      // Calculate new totals
      const previousEntries = currentStats?.total_diary_entries ?? 0
      const previousWords = currentStats?.total_word_count ?? 0
      const achievedMilestones: DiaryMilestoneId[] = currentStats?.milestones_achieved ?? []

      const newTotalEntries = isNewEntry ? previousEntries + 1 : previousEntries
      const newTotalWords = previousWords + entryWordCount

      // Check for new milestones
      let newMilestone: MilestoneInfo | null = null

      // Check first_entry milestone
      if (
        !achievedMilestones.includes('first_entry') &&
        newTotalEntries >= DIARY_MILESTONES.first_entry.threshold.entries
      ) {
        newMilestone = DIARY_MILESTONES.first_entry
      }
      // Check word milestones (in order of achievement)
      else if (
        !achievedMilestones.includes('words_100') &&
        newTotalWords >= DIARY_MILESTONES.words_100.threshold.words
      ) {
        newMilestone = DIARY_MILESTONES.words_100
      } else if (
        !achievedMilestones.includes('words_1000') &&
        newTotalWords >= DIARY_MILESTONES.words_1000.threshold.words
      ) {
        newMilestone = DIARY_MILESTONES.words_1000
      } else if (
        !achievedMilestones.includes('words_10000') &&
        newTotalWords >= DIARY_MILESTONES.words_10000.threshold.words
      ) {
        newMilestone = DIARY_MILESTONES.words_10000
      }

      // Update stats in database
      const updatedMilestones = newMilestone
        ? [...achievedMilestones, newMilestone.id]
        : achievedMilestones

      if (currentStats) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({
            total_diary_entries: newTotalEntries,
            total_word_count: newTotalWords,
            milestones_achieved: updatedMilestones,
          })
          .eq('user_id', userId)

        if (updateError) throw updateError
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: userId,
            total_diary_entries: newTotalEntries,
            total_word_count: newTotalWords,
            milestones_achieved: updatedMilestones,
            current_streak: 0,
            longest_streak: 0,
          })

        if (insertError) throw insertError
      }

      return {
        newMilestone,
        totalEntries: newTotalEntries,
        totalWords: newTotalWords,
      }
    },
    onSuccess: (result) => {
      // Invalidate user stats cache
      queryClient.invalidateQueries({ queryKey: ['user_stats', userId] })

      // Set pending milestone for celebration display
      if (result.newMilestone) {
        setPendingMilestone(result.newMilestone)
      }
    },
  })

  // Check and update milestones after diary save
  const checkMilestones = useCallback(
    async (diaryText: string, isNewEntry: boolean = false) => {
      if (!userId) return null

      const wordCount = countWords(diaryText)
      const result = await updateMilestoneStats.mutateAsync({
        entryWordCount: wordCount,
        isNewEntry,
      })

      return result
    },
    [userId, countWords, updateMilestoneStats]
  )

  // Clear pending milestone (after celebration is shown)
  const clearPendingMilestone = useCallback(() => {
    setPendingMilestone(null)
  }, [])

  // Get milestone celebration message
  const getMilestoneMessage = useCallback(
    (milestone: MilestoneInfo): string => {
      if (isKidsMode) {
        switch (milestone.id) {
          case 'first_entry':
            return "Woohoo! You wrote your very first diary entry! You're amazing! 🎉"
          case 'words_100':
            return "100 words! You're becoming a super writer! Keep it up! ⭐"
          case 'words_1000':
            return "WOW! 1,000 words! You're a real storyteller now! 📚"
          case 'words_10000':
            return "INCREDIBLE! 10,000 words! You're a writing champion! 🏆"
        }
      } else {
        switch (milestone.id) {
          case 'first_entry':
            return "You've taken the first step on your journaling journey. Every great story starts with a single page."
          case 'words_100':
            return "100 words written. You're finding your voice and building a meaningful practice."
          case 'words_1000':
            return "1,000 words! Your thoughts and reflections are becoming a rich tapestry of memories."
          case 'words_10000':
            return "10,000 words. You've created something truly special - a detailed record of your journey."
        }
      }
      return ''
    },
    [isKidsMode]
  )

  return {
    checkMilestones,
    pendingMilestone,
    clearPendingMilestone,
    getMilestoneMessage,
    isCheckingMilestones: updateMilestoneStats.isPending,
    countWords,
    milestones: DIARY_MILESTONES,
  }
}
