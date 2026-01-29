import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import React from 'react'
import { ProfileModeProvider } from '../../contexts/ProfileModeContext'

// Use vi.hoisted to create mocks that can be modified between tests
const { mockProfile, mockUpdateMutate } = vi.hoisted(() => ({
  mockProfile: {
    data: null as { profile_type: 'adult' | 'kid'; onboarding_completed: boolean } | null,
    isLoading: false,
  },
  mockUpdateMutate: vi.fn(),
}))

// Mock the useUserProfile hook
vi.mock('../useUserProfile', () => ({
  useUserProfile: () => mockProfile,
  useUpdateUserProfile: () => ({
    mutate: mockUpdateMutate,
  }),
}))

// Import after mocking
import { useProfileMode, useOnboardingStatus } from '../useProfileMode'

// Wrapper component for rendering hooks with provider
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(ProfileModeProvider, null, children)
  }
}

describe('useProfileMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockProfile.data = null
    mockProfile.isLoading = false
  })

  describe('default values', () => {
    it('should default to adult profile type', () => {
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })
      expect(result.current.profileType).toBe('adult')
    })

    it('should default isKidsMode to false', () => {
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })
      expect(result.current.isKidsMode).toBe(false)
    })

    it('should default onboardingCompleted to true for new users', () => {
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })
      expect(result.current.onboardingCompleted).toBe(true)
    })

    it('should reflect loading state from profile', () => {
      mockProfile.isLoading = true
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })
      expect(result.current.isLoading).toBe(true)
    })
  })

  describe('with profile data', () => {
    it('should use profile type from profile data', async () => {
      mockProfile.data = { profile_type: 'kid', onboarding_completed: true }
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })
      await waitFor(() => {
        expect(result.current.profileType).toBe('kid')
      })
    })

    it('should set isKidsMode to true when profile type is kid', async () => {
      mockProfile.data = { profile_type: 'kid', onboarding_completed: true }
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })
      await waitFor(() => {
        expect(result.current.isKidsMode).toBe(true)
      })
    })

    it('should use onboarding_completed from profile', async () => {
      mockProfile.data = { profile_type: 'adult', onboarding_completed: false }
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })
      await waitFor(() => {
        expect(result.current.onboardingCompleted).toBe(false)
      })
    })
  })

  describe('setProfileType', () => {
    it('should update local profile type', async () => {
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.setProfileType('kid')
      })

      expect(result.current.profileType).toBe('kid')
      expect(result.current.isKidsMode).toBe(true)
    })

    it('should call updateProfile mutation', () => {
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })

      act(() => {
        result.current.setProfileType('kid')
      })

      expect(mockUpdateMutate).toHaveBeenCalledWith({ profile_type: 'kid' })
    })

    it('should toggle back to adult mode', async () => {
      mockProfile.data = { profile_type: 'kid', onboarding_completed: true }
      const { result } = renderHook(() => useProfileMode(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.profileType).toBe('kid')
      })

      act(() => {
        result.current.setProfileType('adult')
      })

      expect(result.current.profileType).toBe('adult')
      expect(result.current.isKidsMode).toBe(false)
    })
  })
})

describe('useOnboardingStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockProfile.data = null
    mockProfile.isLoading = false
  })

  it('should return onboardingCompleted status', () => {
    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    })
    expect(result.current.onboardingCompleted).toBe(true)
  })

  it('should return loading status', () => {
    mockProfile.isLoading = true
    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(true)
  })

  it('should reflect onboarding_completed from profile', async () => {
    mockProfile.data = { profile_type: 'adult', onboarding_completed: false }
    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => {
      expect(result.current.onboardingCompleted).toBe(false)
    })
  })

  it('should only return onboardingCompleted and isLoading properties', () => {
    const { result } = renderHook(() => useOnboardingStatus(), {
      wrapper: createWrapper(),
    })
    const keys = Object.keys(result.current)
    expect(keys).toContain('onboardingCompleted')
    expect(keys).toContain('isLoading')
    expect(keys).toHaveLength(2)
  })
})
