import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

// Mock platform
vi.mock('../../lib/platform', () => ({
  isNativePlatform: vi.fn(() => false),
}))

import { useSubscription, useOfferings } from '../useSubscription'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return free defaults on web', async () => {
    const { result } = renderHook(() => useSubscription(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({
      isPremium: false,
      activeSubscription: null,
    })
  })
})

describe('useOfferings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return null on web', async () => {
    const { result } = renderHook(() => useOfferings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toBeNull()
  })
})
