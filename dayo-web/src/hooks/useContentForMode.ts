import { useMemo } from 'react'
import { useProfileMode } from './useProfileMode'
import {
  adultMoods,
  kidsMoods,
  adultMoodEmojis,
  kidsMoodEmojis,
  type MoodOption,
} from '../data/moods'
import {
  adultPrompts,
  kidsPrompts,
  adultGratitudePrompts,
  kidsGratitudePrompts,
  adultHighlightEmojis,
  kidsHighlightEmojis,
  type DiaryPrompt,
} from '../data/prompts'
import {
  adultEncouragements,
  kidsEncouragements,
  adultStreakCelebrations,
  kidsStreakCelebrations,
} from '../data/encouragements'

export interface ModeContent {
  moods: MoodOption[]
  moodEmojis: Record<string, string>
  diaryPrompts: DiaryPrompt
  gratitudePrompts: string[]
  highlightEmojis: string[]
  encouragements: typeof adultEncouragements
  streakCelebrations: Record<number, string>
}

export function useContentForMode(): ModeContent {
  const { isKidsMode } = useProfileMode()

  return useMemo(() => {
    if (isKidsMode) {
      return {
        moods: kidsMoods,
        moodEmojis: kidsMoodEmojis,
        diaryPrompts: kidsPrompts,
        gratitudePrompts: kidsGratitudePrompts,
        highlightEmojis: kidsHighlightEmojis,
        encouragements: kidsEncouragements,
        streakCelebrations: kidsStreakCelebrations,
      }
    }

    return {
      moods: adultMoods,
      moodEmojis: adultMoodEmojis,
      diaryPrompts: adultPrompts,
      gratitudePrompts: adultGratitudePrompts,
      highlightEmojis: adultHighlightEmojis,
      encouragements: adultEncouragements,
      streakCelebrations: adultStreakCelebrations,
    }
  }, [isKidsMode])
}

// Helper function to get mood emoji for display
export function useMoodEmoji(moodId: string | null | undefined): string | null {
  const { moodEmojis } = useContentForMode()

  if (!moodId) return null
  return moodEmojis[moodId] || moodId
}

// Helper function to get greeting based on time of day
export function useGreeting(): string {
  const { encouragements } = useContentForMode()
  const hour = new Date().getHours()

  if (hour < 12) return encouragements.morningGreeting
  if (hour < 18) return encouragements.afternoonGreeting
  return encouragements.eveningGreeting
}

// Helper to get streak celebration message
export function useStreakCelebration(streakDays: number): string | null {
  const { streakCelebrations } = useContentForMode()

  // Find the highest milestone that's been reached
  const milestones = Object.keys(streakCelebrations)
    .map(Number)
    .sort((a, b) => b - a)

  for (const milestone of milestones) {
    if (streakDays >= milestone) {
      return streakCelebrations[milestone]
    }
  }

  return null
}
