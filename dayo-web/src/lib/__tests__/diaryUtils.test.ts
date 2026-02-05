import { describe, it, expect } from 'vitest'
import {
  countWords,
  computeMoodDistribution,
  computeMoodStreak,
  computeWritingStreak,
  computeInsights,
} from '../diaryUtils'

const makeEntry = (overrides: Record<string, unknown> = {}) => ({
  id: 'test-id',
  user_id: 'user-1',
  date: '2026-01-15',
  mood: 'happy' as string | null,
  diary_text: 'This is a test entry' as string | null,
  photos: [] as string[],
  gratitude: [] as string[],
  highlights: [] as Array<{ emoji: string; text: string }>,
  tags: [] as string[],
  bookmarked: false,
  template_id: null as string | null,
  sketch_url: null as string | null,
  created_at: '2026-01-15T00:00:00Z',
  updated_at: '2026-01-15T00:00:00Z',
  ...overrides,
})

describe('diaryUtils', () => {
  describe('countWords', () => {
    it('should return 0 for null', () => {
      expect(countWords(null)).toBe(0)
    })

    it('should return 0 for empty string', () => {
      expect(countWords('')).toBe(0)
    })

    it('should return 0 for whitespace only', () => {
      expect(countWords('   ')).toBe(0)
    })

    it('should count words correctly', () => {
      expect(countWords('Hello world')).toBe(2)
    })

    it('should handle multiple spaces', () => {
      expect(countWords('Hello   world   test')).toBe(3)
    })
  })

  describe('computeMoodDistribution', () => {
    it('should return empty object for no entries', () => {
      expect(computeMoodDistribution([])).toEqual({})
    })

    it('should count mood occurrences', () => {
      const entries = [
        makeEntry({ mood: 'happy' }),
        makeEntry({ mood: 'happy' }),
        makeEntry({ mood: 'sad' }),
      ]
      expect(computeMoodDistribution(entries)).toEqual({ happy: 2, sad: 1 })
    })

    it('should skip entries without mood', () => {
      const entries = [
        makeEntry({ mood: 'happy' }),
        makeEntry({ mood: null }),
      ]
      expect(computeMoodDistribution(entries)).toEqual({ happy: 1 })
    })
  })

  describe('computeMoodStreak', () => {
    it('should return 0 for no entries', () => {
      expect(computeMoodStreak([])).toEqual({ count: 0, mood: null })
    })

    it('should return 1 for single entry', () => {
      const entries = [makeEntry({ date: '2026-01-15', mood: 'happy' })]
      expect(computeMoodStreak(entries)).toEqual({ count: 1, mood: 'happy' })
    })

    it('should count consecutive same mood', () => {
      const entries = [
        makeEntry({ date: '2026-01-15', mood: 'happy' }),
        makeEntry({ date: '2026-01-14', mood: 'happy' }),
        makeEntry({ date: '2026-01-13', mood: 'happy' }),
        makeEntry({ date: '2026-01-12', mood: 'sad' }),
      ]
      expect(computeMoodStreak(entries)).toEqual({ count: 3, mood: 'happy' })
    })

    it('should skip entries without mood', () => {
      const entries = [
        makeEntry({ date: '2026-01-15', mood: null }),
      ]
      expect(computeMoodStreak(entries)).toEqual({ count: 0, mood: null })
    })
  })

  describe('computeWritingStreak', () => {
    it('should return 0 for no entries', () => {
      expect(computeWritingStreak([])).toBe(0)
    })

    it('should return 0 for entries without text', () => {
      const entries = [makeEntry({ diary_text: null })]
      expect(computeWritingStreak(entries)).toBe(0)
    })

    it('should return 0 for entries with empty text', () => {
      const entries = [makeEntry({ diary_text: '   ' })]
      expect(computeWritingStreak(entries)).toBe(0)
    })
  })

  describe('computeInsights', () => {
    it('should return zero values for empty entries', () => {
      const insights = computeInsights([])
      expect(insights.totalEntries).toBe(0)
      expect(insights.totalWords).toBe(0)
      expect(insights.averageWords).toBe(0)
      expect(insights.longestEntry).toBe(0)
      expect(insights.mostCommonMood).toBeNull()
    })

    it('should compute correct stats for entries', () => {
      const entries = [
        makeEntry({
          date: '2026-01-15',
          mood: 'happy',
          diary_text: 'Today was great',
          photos: ['photo1.jpg'],
          gratitude: ['grateful for sun'],
        }),
        makeEntry({
          date: '2026-01-14',
          mood: 'happy',
          diary_text: 'Another good day with more words',
        }),
        makeEntry({
          date: '2026-01-13',
          mood: 'sad',
          diary_text: 'Not so great',
          highlights: [{ emoji: '🎯', text: 'something' }],
        }),
      ]

      const insights = computeInsights(entries)
      expect(insights.totalEntries).toBe(3)
      expect(insights.entriesWithMood).toBe(3)
      expect(insights.entriesWithPhotos).toBe(1)
      expect(insights.entriesWithGratitude).toBe(1)
      expect(insights.entriesWithHighlights).toBe(1)
      expect(insights.totalWords).toBe(12)
      expect(insights.mostCommonMood).toBe('happy')
      expect(insights.moodStreak.mood).toBe('happy')
      expect(insights.moodStreak.count).toBe(2)
    })
  })
})
