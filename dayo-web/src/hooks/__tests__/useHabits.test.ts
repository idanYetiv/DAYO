import { describe, it, expect, vi } from 'vitest'
import { format, subDays } from 'date-fns'
import {
  isHabitCompletedForDate,
  getWeekDates,
  getWeekCompletionsCount,
  getWeekCompletionRate,
  type HabitWithCompletions,
} from '../useHabits'

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}))

const createMockHabit = (overrides: Partial<HabitWithCompletions> = {}): HabitWithCompletions => ({
  id: 'habit-1',
  user_id: 'user-1',
  title: 'Test Habit',
  icon: '✅',
  color: '#8B5CF6',
  frequency: 'daily',
  target_per_week: 7,
  time_of_day: 'anytime',
  archived: false,
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
  completions: [],
  streak: 0,
  bestStreak: 0,
  ...overrides,
})

describe('isHabitCompletedForDate', () => {
  it('returns false when habit has no completions', () => {
    const habit = createMockHabit()
    expect(isHabitCompletedForDate(habit, '2026-01-20')).toBe(false)
  })

  it('returns true when habit is completed for the date', () => {
    const habit = createMockHabit({
      completions: [
        { id: 'c1', habit_id: 'habit-1', user_id: 'user-1', date: '2026-01-20', created_at: '2026-01-20' },
      ],
    })
    expect(isHabitCompletedForDate(habit, '2026-01-20')).toBe(true)
  })

  it('returns false when habit is completed for different date', () => {
    const habit = createMockHabit({
      completions: [
        { id: 'c1', habit_id: 'habit-1', user_id: 'user-1', date: '2026-01-19', created_at: '2026-01-19' },
      ],
    })
    expect(isHabitCompletedForDate(habit, '2026-01-20')).toBe(false)
  })
})

describe('getWeekDates', () => {
  it('returns 7 dates starting from Monday', () => {
    const dates = getWeekDates(new Date('2026-01-20')) // Monday
    expect(dates).toHaveLength(7)
  })

  it('first date is Monday', () => {
    const dates = getWeekDates(new Date('2026-01-22')) // Wednesday
    const monday = dates[0]
    expect(format(monday, 'EEEE')).toBe('Monday')
  })

  it('last date is Sunday', () => {
    const dates = getWeekDates(new Date('2026-01-22')) // Wednesday
    const sunday = dates[6]
    expect(format(sunday, 'EEEE')).toBe('Sunday')
  })
})

describe('getWeekCompletionsCount', () => {
  it('returns 0 for habit with no completions', () => {
    const habit = createMockHabit()
    const weekDates = getWeekDates(new Date('2026-01-20'))
    expect(getWeekCompletionsCount(habit, weekDates)).toBe(0)
  })

  it('returns correct count for completions in week', () => {
    const habit = createMockHabit({
      completions: [
        { id: 'c1', habit_id: 'habit-1', user_id: 'user-1', date: '2026-01-20', created_at: '2026-01-20' },
        { id: 'c2', habit_id: 'habit-1', user_id: 'user-1', date: '2026-01-21', created_at: '2026-01-21' },
        { id: 'c3', habit_id: 'habit-1', user_id: 'user-1', date: '2026-01-22', created_at: '2026-01-22' },
      ],
    })
    const weekDates = getWeekDates(new Date('2026-01-20'))
    expect(getWeekCompletionsCount(habit, weekDates)).toBe(3)
  })

  it('ignores completions outside the week', () => {
    const habit = createMockHabit({
      completions: [
        { id: 'c1', habit_id: 'habit-1', user_id: 'user-1', date: '2026-01-10', created_at: '2026-01-10' }, // Previous week
        { id: 'c2', habit_id: 'habit-1', user_id: 'user-1', date: '2026-01-20', created_at: '2026-01-20' }, // This week
      ],
    })
    const weekDates = getWeekDates(new Date('2026-01-20'))
    expect(getWeekCompletionsCount(habit, weekDates)).toBe(1)
  })
})

describe('getWeekCompletionRate', () => {
  it('returns 0 for empty habits array', () => {
    const weekDates = getWeekDates(new Date('2026-01-20'))
    expect(getWeekCompletionRate([], weekDates)).toBe(0)
  })

  it('returns 0 for habits with no completions', () => {
    const habits = [createMockHabit(), createMockHabit({ id: 'habit-2' })]
    const weekDates = getWeekDates(new Date('2026-01-20'))
    expect(getWeekCompletionRate(habits, weekDates)).toBe(0)
  })

  it('calculates correct completion rate', () => {
    const habits = [
      createMockHabit({
        completions: [
          { id: 'c1', habit_id: 'habit-1', user_id: 'user-1', date: '2026-01-20', created_at: '2026-01-20' },
        ],
      }),
    ]
    const weekDates = getWeekDates(new Date('2026-01-20'))
    // 1 completion out of 7 possible = 14.28... rounds to 14
    expect(getWeekCompletionRate(habits, weekDates)).toBe(14)
  })

  it('returns 100 for fully completed week', () => {
    const weekDates = getWeekDates(new Date('2026-01-20'))
    const completions = weekDates.map((date, i) => ({
      id: `c${i}`,
      habit_id: 'habit-1',
      user_id: 'user-1',
      date: format(date, 'yyyy-MM-dd'),
      created_at: format(date, 'yyyy-MM-dd'),
    }))

    const habits = [createMockHabit({ completions })]
    expect(getWeekCompletionRate(habits, weekDates)).toBe(100)
  })
})
