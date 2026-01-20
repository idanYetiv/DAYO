import { describe, it, expect, vi, beforeEach } from 'vitest'
import { calculateGoalProgress, type GoalWithMilestones } from '../useGoals'

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

describe('calculateGoalProgress', () => {
  it('returns 0 for goal with no milestones', () => {
    const goal: GoalWithMilestones = {
      id: '1',
      user_id: 'user-1',
      title: 'Test Goal',
      description: null,
      category: 'monthly',
      color: '#8B5CF6',
      icon: '🎯',
      due_date: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      milestones: [],
    }

    expect(calculateGoalProgress(goal)).toBe(0)
  })

  it('returns 0 for goal with no completed milestones', () => {
    const goal: GoalWithMilestones = {
      id: '1',
      user_id: 'user-1',
      title: 'Test Goal',
      description: null,
      category: 'monthly',
      color: '#8B5CF6',
      icon: '🎯',
      due_date: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      milestones: [
        { id: 'm1', goal_id: '1', user_id: 'user-1', title: 'Milestone 1', completed: false, created_at: '2026-01-01' },
        { id: 'm2', goal_id: '1', user_id: 'user-1', title: 'Milestone 2', completed: false, created_at: '2026-01-01' },
      ],
    }

    expect(calculateGoalProgress(goal)).toBe(0)
  })

  it('returns 50 for goal with half completed milestones', () => {
    const goal: GoalWithMilestones = {
      id: '1',
      user_id: 'user-1',
      title: 'Test Goal',
      description: null,
      category: 'monthly',
      color: '#8B5CF6',
      icon: '🎯',
      due_date: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      milestones: [
        { id: 'm1', goal_id: '1', user_id: 'user-1', title: 'Milestone 1', completed: true, created_at: '2026-01-01' },
        { id: 'm2', goal_id: '1', user_id: 'user-1', title: 'Milestone 2', completed: false, created_at: '2026-01-01' },
      ],
    }

    expect(calculateGoalProgress(goal)).toBe(50)
  })

  it('returns 100 for goal with all milestones completed', () => {
    const goal: GoalWithMilestones = {
      id: '1',
      user_id: 'user-1',
      title: 'Test Goal',
      description: null,
      category: 'monthly',
      color: '#8B5CF6',
      icon: '🎯',
      due_date: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      milestones: [
        { id: 'm1', goal_id: '1', user_id: 'user-1', title: 'Milestone 1', completed: true, created_at: '2026-01-01' },
        { id: 'm2', goal_id: '1', user_id: 'user-1', title: 'Milestone 2', completed: true, created_at: '2026-01-01' },
      ],
    }

    expect(calculateGoalProgress(goal)).toBe(100)
  })

  it('rounds progress to nearest integer', () => {
    const goal: GoalWithMilestones = {
      id: '1',
      user_id: 'user-1',
      title: 'Test Goal',
      description: null,
      category: 'monthly',
      color: '#8B5CF6',
      icon: '🎯',
      due_date: null,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
      milestones: [
        { id: 'm1', goal_id: '1', user_id: 'user-1', title: 'Milestone 1', completed: true, created_at: '2026-01-01' },
        { id: 'm2', goal_id: '1', user_id: 'user-1', title: 'Milestone 2', completed: false, created_at: '2026-01-01' },
        { id: 'm3', goal_id: '1', user_id: 'user-1', title: 'Milestone 3', completed: false, created_at: '2026-01-01' },
      ],
    }

    // 1/3 = 33.33... should round to 33
    expect(calculateGoalProgress(goal)).toBe(33)
  })
})
