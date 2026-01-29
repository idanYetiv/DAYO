import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  adultMoods,
  kidsMoods,
  adultMoodEmojis,
  kidsMoodEmojis,
} from '../../data/moods'
import {
  adultPrompts,
  kidsPrompts,
  adultGratitudePrompts,
  kidsGratitudePrompts,
  adultHighlightEmojis,
  kidsHighlightEmojis,
} from '../../data/prompts'
import {
  adultEncouragements,
  kidsEncouragements,
  adultStreakCelebrations,
  kidsStreakCelebrations,
} from '../../data/encouragements'

// Use vi.hoisted to create mock that can be modified between tests
const { mockIsKidsMode } = vi.hoisted(() => ({
  mockIsKidsMode: { value: false },
}))

// Mock the useProfileMode hook
vi.mock('../useProfileMode', () => ({
  useProfileMode: () => ({
    profileType: mockIsKidsMode.value ? 'kid' : 'adult',
    setProfileType: vi.fn(),
    isKidsMode: mockIsKidsMode.value,
    isLoading: false,
    onboardingCompleted: true,
  }),
}))

// Import after mocking
import { useContentForMode } from '../useContentForMode'

describe('useContentForMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsKidsMode.value = false
  })

  describe('adult mode', () => {
    it('should return adult moods', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.moods).toEqual(adultMoods)
    })

    it('should return adult mood emojis', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.moodEmojis).toEqual(adultMoodEmojis)
    })

    it('should return adult diary prompts', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.diaryPrompts).toEqual(adultPrompts)
    })

    it('should return adult gratitude prompts', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.gratitudePrompts).toEqual(adultGratitudePrompts)
    })

    it('should return adult highlight emojis', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.highlightEmojis).toEqual(adultHighlightEmojis)
    })

    it('should return adult encouragements', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.encouragements).toEqual(adultEncouragements)
    })

    it('should return adult streak celebrations', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.streakCelebrations).toEqual(adultStreakCelebrations)
    })
  })

  describe('kids mode', () => {
    beforeEach(() => {
      mockIsKidsMode.value = true
    })

    it('should return kids moods', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.moods).toEqual(kidsMoods)
    })

    it('should return kids mood emojis', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.moodEmojis).toEqual(kidsMoodEmojis)
    })

    it('should return kids diary prompts', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.diaryPrompts).toEqual(kidsPrompts)
    })

    it('should return kids gratitude prompts', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.gratitudePrompts).toEqual(kidsGratitudePrompts)
    })

    it('should return kids highlight emojis', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.highlightEmojis).toEqual(kidsHighlightEmojis)
    })

    it('should return kids encouragements', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.encouragements).toEqual(kidsEncouragements)
    })

    it('should return kids streak celebrations', () => {
      const { result } = renderHook(() => useContentForMode())
      expect(result.current.streakCelebrations).toEqual(kidsStreakCelebrations)
    })
  })
})
