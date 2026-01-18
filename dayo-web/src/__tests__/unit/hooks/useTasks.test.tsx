import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Use vi.hoisted to create mock functions that can be used in vi.mock
const { mockGetUser, mockFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
}))

// Mock Supabase module
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  },
}))

import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../../hooks/useTasks'

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

describe('useTasks Hook', () => {
  const mockUser = { id: 'user-123' }
  const mockTasks = [
    { id: 'task-1', user_id: 'user-123', date: '2026-01-17', title: 'Task 1', completed: false },
    { id: 'task-2', user_id: 'user-123', date: '2026-01-17', title: 'Task 2', completed: true },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null })
  })

  describe('useTasks', () => {
    it('should fetch tasks for a specific date', async () => {
      // Create a properly chained mock that returns a Promise-like result
      // The query chain is: from -> select -> eq -> order -> [eq if date] -> await
      const chainResult = Promise.resolve({ data: mockTasks, error: null })
      const mockChain: Record<string, ReturnType<typeof vi.fn>> = {
        select: vi.fn(),
        eq: vi.fn(),
        order: vi.fn(),
        then: vi.fn((resolve) => chainResult.then(resolve)),
      }
      // Each method returns the chain object for chaining
      mockChain.select.mockReturnValue(mockChain)
      mockChain.eq.mockReturnValue(mockChain)
      mockChain.order.mockReturnValue(mockChain)
      mockFrom.mockReturnValue(mockChain)

      const { result } = renderHook(() => useTasks('2026-01-17'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data).toEqual(mockTasks)
      expect(mockFrom).toHaveBeenCalledWith('tasks')
    })

    it('should call query methods in correct chain', async () => {
      const chainResult = { data: mockTasks, error: null }
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnValue(chainResult),
      }
      mockFrom.mockReturnValue(mockChain)

      renderHook(() => useTasks('2026-01-17'), { wrapper: createWrapper() })

      await waitFor(() => {
        expect(mockChain.select).toHaveBeenCalledWith('*')
        expect(mockChain.eq).toHaveBeenCalled()
        expect(mockChain.order).toHaveBeenCalled()
      })
    })

    it('should handle error when fetching tasks fails', async () => {
      const chainResult = { data: null, error: new Error('DB Error') }
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnValue(chainResult),
      }
      mockFrom.mockReturnValue(mockChain)

      const { result } = renderHook(() => useTasks('2026-01-17'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
    })

    it('should throw error when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

      const chainResult = { data: [], error: null }
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnValue(chainResult),
      }
      mockFrom.mockReturnValue(mockChain)

      const { result } = renderHook(() => useTasks('2026-01-17'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => expect(result.current.isError).toBe(true))
      expect(result.current.error?.message).toBe('Not authenticated')
    })
  })

  describe('useCreateTask', () => {
    it('should create a new task', async () => {
      const newTask = { id: 'task-new', title: 'New Task', date: '2026-01-17', completed: false }

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: newTask, error: null }),
      }
      mockFrom.mockReturnValue(mockQuery)

      const { result } = renderHook(() => useCreateTask(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({ title: 'New Task', date: '2026-01-17', completed: false })

      expect(mockFrom).toHaveBeenCalledWith('tasks')
      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          date: '2026-01-17',
          user_id: 'user-123',
        })
      )
    })
  })

  describe('useUpdateTask', () => {
    it('should update an existing task', async () => {
      const updatedTask = { id: 'task-1', completed: true }

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedTask, error: null }),
      }
      mockFrom.mockReturnValue(mockQuery)

      const { result } = renderHook(() => useUpdateTask(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync({ id: 'task-1', updates: { completed: true } })

      expect(mockQuery.update).toHaveBeenCalledWith({ completed: true })
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'task-1')
    })
  })

  describe('useDeleteTask', () => {
    it('should delete a task', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }
      mockFrom.mockReturnValue(mockQuery)

      const { result } = renderHook(() => useDeleteTask(), {
        wrapper: createWrapper(),
      })

      await result.current.mutateAsync('task-1')

      expect(mockFrom).toHaveBeenCalledWith('tasks')
      expect(mockQuery.delete).toHaveBeenCalled()
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'task-1')
    })
  })
})
