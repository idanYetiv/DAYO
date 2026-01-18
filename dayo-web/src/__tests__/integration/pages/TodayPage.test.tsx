import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../mocks/testUtils'
import TodayPage from '../../../pages/TodayPage'

// Mock all external dependencies
vi.mock('../../../store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-123', email: 'test@example.com' },
  }),
}))

const mockTasks = [
  { id: 'task-1', title: 'Task 1', completed: false, date: '2026-01-17' },
  { id: 'task-2', title: 'Task 2', completed: true, date: '2026-01-17' },
]

const mockDayEntry = {
  id: 'day-1',
  date: '2026-01-17',
  mood: 'happy',
  diary_text: 'Great day!',
}

const mockUserStats = {
  current_streak: 5,
  longest_streak: 10,
}

vi.mock('../../../hooks/useTasks', () => ({
  useTasks: () => ({
    data: mockTasks,
    isLoading: false,
    error: null,
  }),
  useCreateTask: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateTask: () => ({
    mutate: vi.fn(),
  }),
  useDeleteTask: () => ({
    mutate: vi.fn(),
  }),
}))

vi.mock('../../../hooks/useDiary', () => ({
  useDayEntry: () => ({
    data: mockDayEntry,
    isLoading: false,
  }),
  useUpsertDayEntry: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('../../../hooks/useUserStats', () => ({
  useUserStats: () => ({
    data: mockUserStats,
    isLoading: false,
  }),
  useUpdateStreak: () => ({
    mutate: vi.fn(),
  }),
}))

vi.mock('../../../lib/toast', () => ({
  taskToast: {
    created: vi.fn(),
    completed: vi.fn(),
    deleted: vi.fn(),
    error: vi.fn(),
  },
  diaryToast: {
    saved: vi.fn(),
    error: vi.fn(),
  },
}))

describe('TodayPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the page with greeting', () => {
    render(<TodayPage />)

    // Should show a greeting based on time of day
    const greetings = ['Good morning', 'Good afternoon', 'Good evening']
    const hasGreeting = greetings.some((g) => screen.queryByText(g))
    expect(hasGreeting).toBe(true)
  })

  it('should display current streak in header', () => {
    render(<TodayPage />)

    // There are two elements with streak text - header badge and quick access
    const streakElements = screen.getAllByText(/5 day streak/)
    expect(streakElements.length).toBeGreaterThan(0)
  })

  it('should display date header section', () => {
    render(<TodayPage />)

    // Look for the date navigation area with chevron buttons
    const chevronButtons = screen.getAllByRole('button').filter((btn) =>
      btn.querySelector('svg')
    )
    expect(chevronButtons.length).toBeGreaterThan(0)
  })

  it('should render tasks in the tasks section', () => {
    render(<TodayPage />)

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('should have date navigation buttons', () => {
    render(<TodayPage />)

    // Find buttons with chevron icons
    const allButtons = screen.getAllByRole('button')
    const navButtons = allButtons.filter((btn) => {
      const svg = btn.querySelector('svg')
      return svg?.classList.contains('lucide-chevron-left') ||
             svg?.classList.contains('lucide-chevron-right')
    })

    expect(navButtons.length).toBeGreaterThanOrEqual(2)
  })

  it('should render bottom navigation', () => {
    render(<TodayPage />)

    // Bottom navigation has a nav element
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should display mood emoji when mood is set', () => {
    render(<TodayPage />)

    // Happy mood should show the emoji
    expect(screen.getByText('🥰')).toBeInTheDocument()
  })

  it('should display task completion percentage', () => {
    render(<TodayPage />)

    // 1 of 2 tasks completed = 50%
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should show Today\'s Tasks section header', () => {
    render(<TodayPage />)

    expect(screen.getByText("Today's Tasks")).toBeInTheDocument()
  })
})
