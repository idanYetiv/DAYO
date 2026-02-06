import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Use vi.hoisted to create mock functions
const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}))

// Mock Supabase module
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}))

import { useDiaryMilestones, DIARY_MILESTONES } from '../../../hooks/useDiaryMilestones'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useDiaryMilestones Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('countWords', () => {
    it('should count words in plain text', () => {
      const { result } = renderHook(
        () => useDiaryMilestones({ userId: 'user-123' }),
        { wrapper: createWrapper() }
      )

      expect(result.current.countWords('hello world')).toBe(2)
      expect(result.current.countWords('one two three four five')).toBe(5)
    })

    it('should strip HTML tags before counting', () => {
      const { result } = renderHook(
        () => useDiaryMilestones({ userId: 'user-123' }),
        { wrapper: createWrapper() }
      )

      expect(result.current.countWords('<p>hello world</p>')).toBe(2)
      expect(result.current.countWords('<div><strong>one</strong> two</div>')).toBe(2)
    })

    it('should return 0 for empty text', () => {
      const { result } = renderHook(
        () => useDiaryMilestones({ userId: 'user-123' }),
        { wrapper: createWrapper() }
      )

      expect(result.current.countWords('')).toBe(0)
      expect(result.current.countWords('   ')).toBe(0)
    })
  })

  describe('getMilestoneMessage', () => {
    it('should return adult messages when not in kids mode', () => {
      const { result } = renderHook(
        () => useDiaryMilestones({ userId: 'user-123', isKidsMode: false }),
        { wrapper: createWrapper() }
      )

      const message = result.current.getMilestoneMessage(DIARY_MILESTONES.first_entry)
      expect(message).toContain('first step')
    })

    it('should return kids messages when in kids mode', () => {
      const { result } = renderHook(
        () => useDiaryMilestones({ userId: 'user-123', isKidsMode: true }),
        { wrapper: createWrapper() }
      )

      const message = result.current.getMilestoneMessage(DIARY_MILESTONES.first_entry)
      expect(message).toContain('Woohoo')
    })
  })

  describe('checkMilestones', () => {
    it('should detect first_entry milestone', async () => {
      // Mock no existing stats
      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockReturnThis()
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })
      const mockInsert = vi.fn().mockResolvedValue({ error: null })

      mockFrom.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
        insert: mockInsert,
      })

      const { result } = renderHook(
        () => useDiaryMilestones({ userId: 'user-123' }),
        { wrapper: createWrapper() }
      )

      const milestoneResult = await result.current.checkMilestones('This is my first diary entry with many words', true)

      expect(milestoneResult?.newMilestone?.id).toBe('first_entry')
      expect(milestoneResult?.totalEntries).toBe(1)
    })

    it('should detect words_100 milestone', async () => {
      // Mock existing stats with 90 words
      const mockUpdate = vi.fn().mockReturnThis()
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })

      mockFrom.mockImplementation((table: string) => {
        if (table === 'user_stats') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    total_diary_entries: 5,
                    total_word_count: 90,
                    milestones_achieved: ['first_entry'],
                  },
                  error: null,
                }),
              }),
            }),
            update: mockUpdate.mockReturnValue({
              eq: mockUpdateEq,
            }),
          }
        }
        return {}
      })

      const { result } = renderHook(
        () => useDiaryMilestones({ userId: 'user-123' }),
        { wrapper: createWrapper() }
      )

      // Add 15 more words to reach 105 total
      const milestoneResult = await result.current.checkMilestones(
        'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen',
        false
      )

      expect(milestoneResult?.newMilestone?.id).toBe('words_100')
      expect(milestoneResult?.totalWords).toBe(105)
    })

    it('should not trigger already achieved milestones', async () => {
      // Mock stats with first_entry already achieved
      const mockUpdate = vi.fn().mockReturnThis()
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })

      mockFrom.mockImplementation((table: string) => {
        if (table === 'user_stats') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    total_diary_entries: 1,
                    total_word_count: 50,
                    milestones_achieved: ['first_entry'],
                  },
                  error: null,
                }),
              }),
            }),
            update: mockUpdate.mockReturnValue({
              eq: mockUpdateEq,
            }),
          }
        }
        return {}
      })

      const { result } = renderHook(
        () => useDiaryMilestones({ userId: 'user-123' }),
        { wrapper: createWrapper() }
      )

      const milestoneResult = await result.current.checkMilestones('hello world', true)

      // Should not trigger first_entry again, and words_100 not reached
      expect(milestoneResult?.newMilestone).toBe(null)
    })
  })

  describe('DIARY_MILESTONES', () => {
    it('should have correct milestone definitions', () => {
      expect(DIARY_MILESTONES.first_entry.id).toBe('first_entry')
      expect(DIARY_MILESTONES.first_entry.threshold.entries).toBe(1)

      expect(DIARY_MILESTONES.words_100.id).toBe('words_100')
      expect(DIARY_MILESTONES.words_100.threshold.words).toBe(100)

      expect(DIARY_MILESTONES.words_1000.id).toBe('words_1000')
      expect(DIARY_MILESTONES.words_1000.threshold.words).toBe(1000)

      expect(DIARY_MILESTONES.words_10000.id).toBe('words_10000')
      expect(DIARY_MILESTONES.words_10000.threshold.words).toBe(10000)
    })
  })
})
