import { vi } from 'vitest'

// Mock user
export const mockUser = {
  id: 'test-user-id-123',
  email: 'test@example.com',
  created_at: '2026-01-01T00:00:00Z',
}

// Mock session
export const mockSession = {
  user: mockUser,
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
}

// Mock data factories
export const createMockTask = (overrides = {}) => ({
  id: `task-${Date.now()}`,
  user_id: mockUser.id,
  date: '2026-01-17',
  title: 'Test Task',
  completed: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createMockDayEntry = (overrides = {}) => ({
  id: `day-${Date.now()}`,
  user_id: mockUser.id,
  date: '2026-01-17',
  mood: 'happy',
  diary_text: 'Test diary entry',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createMockUserStats = (overrides = {}) => ({
  user_id: mockUser.id,
  current_streak: 5,
  longest_streak: 10,
  last_active_date: '2026-01-17',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

// Mock Supabase client
export const createMockSupabaseClient = () => {
  const mockFrom = vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
  }))

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: mockFrom,
  }
}

// Mock the supabase module
vi.mock('../../lib/supabase', () => ({
  supabase: createMockSupabaseClient(),
}))
