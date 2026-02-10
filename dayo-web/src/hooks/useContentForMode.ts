import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useProfileMode } from './useProfileMode'
import {
  getAdultMoods,
  getKidsMoods,
  adultMoodEmojis,
  kidsMoodEmojis,
  type MoodOption,
} from '../data/moods'
import {
  getAdultPrompts,
  getKidsPrompts,
  getAdultGratitudePrompts,
  getKidsGratitudePrompts,
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
import {
  adultTemplates,
  kidsTemplates,
  type DiaryTemplate,
} from '../data/templates'
import {
  getTranslatedAdultTags,
  getTranslatedKidsTags,
  type TagOption,
} from '../data/tags'

export interface ModeContent {
  moods: MoodOption[]
  moodEmojis: Record<string, string>
  diaryPrompts: DiaryPrompt
  gratitudePrompts: string[]
  highlightEmojis: string[]
  encouragements: typeof adultEncouragements
  streakCelebrations: Record<number, string>
  templates: DiaryTemplate[]
  tags: TagOption[]
}

export function useContentForMode(): ModeContent {
  const { isKidsMode } = useProfileMode()
  const { i18n } = useTranslation()

  // Include language in dependencies to refresh content when language changes
  return useMemo(() => {
    if (isKidsMode) {
      return {
        moods: getKidsMoods(),
        moodEmojis: kidsMoodEmojis,
        diaryPrompts: getKidsPrompts(),
        gratitudePrompts: getKidsGratitudePrompts(),
        highlightEmojis: kidsHighlightEmojis,
        encouragements: kidsEncouragements,
        streakCelebrations: kidsStreakCelebrations,
        templates: kidsTemplates,
        tags: getTranslatedKidsTags(),
      }
    }

    return {
      moods: getAdultMoods(),
      moodEmojis: adultMoodEmojis,
      diaryPrompts: getAdultPrompts(),
      gratitudePrompts: getAdultGratitudePrompts(),
      highlightEmojis: adultHighlightEmojis,
      encouragements: adultEncouragements,
      streakCelebrations: adultStreakCelebrations,
      templates: adultTemplates,
      tags: getTranslatedAdultTags(),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKidsMode, i18n.language])
}

// Helper function to get mood emoji for display
export function useMoodEmoji(moodId: string | null | undefined): string | null {
  const { moodEmojis } = useContentForMode()

  if (!moodId) return null
  return moodEmojis[moodId] || moodId
}

// Helper function to get greeting based on time of day
export function useGreeting(): string {
  const { t } = useTranslation()
  const { isKidsMode } = useProfileMode()
  const hour = new Date().getHours()

  const mode = isKidsMode ? 'kids' : 'adult'
  if (hour < 12) return t(`greetings.${mode}.morning`)
  if (hour < 18) return t(`greetings.${mode}.afternoon`)
  return t(`greetings.${mode}.evening`)
}

// Helper to get streak celebration message
export function useStreakCelebration(streakDays: number): string | null {
  const { t } = useTranslation()
  const { isKidsMode } = useProfileMode()

  const mode = isKidsMode ? 'kids' : 'adult'
  const milestones = [100, 50, 30, 14, 7, 3]

  for (const milestone of milestones) {
    if (streakDays >= milestone) {
      return t(`streakCelebrations.${mode}.${milestone}`)
    }
  }

  return null
}
