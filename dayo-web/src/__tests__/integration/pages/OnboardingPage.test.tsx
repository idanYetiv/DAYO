import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OnboardingPage from '../../../pages/OnboardingPage'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock useUpdateUserProfile
const mockMutateAsync = vi.fn()
const mockMutate = vi.fn()
vi.mock('../../../hooks/useUserProfile', () => ({
  useUpdateUserProfile: () => ({
    mutateAsync: mockMutateAsync,
    mutate: mockMutate,
  }),
}))

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMutateAsync.mockResolvedValue({})
  })

  const renderPage = () => {
    return render(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>
    )
  }

  describe('rendering', () => {
    it('should render welcome message', () => {
      renderPage()
      expect(screen.getByText('Welcome to DAYO')).toBeInTheDocument()
    })

    it('should render description text', () => {
      renderPage()
      expect(screen.getByText(/Choose your experience/)).toBeInTheDocument()
    })

    it('should render profile type selector', () => {
      renderPage()
      expect(screen.getByText('Adults')).toBeInTheDocument()
      expect(screen.getByText('Kids')).toBeInTheDocument()
    })

    it('should render continue button', () => {
      renderPage()
      expect(screen.getByText("Let's Go!")).toBeInTheDocument()
    })

    it('should render skip button', () => {
      renderPage()
      expect(screen.getByText(/Skip for now/)).toBeInTheDocument()
    })
  })

  describe('continue button state', () => {
    it('should be disabled when no profile type is selected', () => {
      renderPage()
      const continueButton = screen.getByText("Let's Go!").closest('button')
      expect(continueButton).toBeDisabled()
    })

    it('should be enabled when profile type is selected', () => {
      renderPage()

      // Select adult profile
      fireEvent.click(screen.getByText('Adults'))

      const continueButton = screen.getByText("Let's Go!").closest('button')
      expect(continueButton).not.toBeDisabled()
    })
  })

  describe('profile selection and submission', () => {
    it('should save adult profile type and navigate on continue', async () => {
      renderPage()

      // Select adult profile
      fireEvent.click(screen.getByText('Adults'))

      // Click continue
      fireEvent.click(screen.getByText("Let's Go!"))

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          profile_type: 'adult',
          onboarding_completed: true,
        })
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/today')
      })
    })

    it('should save kid profile type and navigate on continue', async () => {
      renderPage()

      // Select kid profile
      fireEvent.click(screen.getByText('Kids'))

      // Click continue
      fireEvent.click(screen.getByText("Let's Go!"))

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          profile_type: 'kid',
          onboarding_completed: true,
        })
      })

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/today')
      })
    })
  })

  describe('skip option', () => {
    it('should navigate to today page when skip is clicked', () => {
      renderPage()

      fireEvent.click(screen.getByText(/Skip for now/))

      expect(mockMutate).toHaveBeenCalledWith({ onboarding_completed: true })
      expect(mockNavigate).toHaveBeenCalledWith('/today')
    })
  })

  describe('loading state', () => {
    it('should show loading state while submitting', async () => {
      // Make mutateAsync hang
      mockMutateAsync.mockImplementation(() => new Promise(() => {}))

      renderPage()

      // Select a profile
      fireEvent.click(screen.getByText('Adults'))

      // Click continue
      fireEvent.click(screen.getByText("Let's Go!"))

      await waitFor(() => {
        expect(screen.getByText('Setting up...')).toBeInTheDocument()
      })
    })
  })

  describe('error handling', () => {
    it('should re-enable button on error', async () => {
      mockMutateAsync.mockRejectedValue(new Error('Failed'))

      renderPage()

      // Select a profile
      fireEvent.click(screen.getByText('Adults'))

      // Click continue
      fireEvent.click(screen.getByText("Let's Go!"))

      await waitFor(() => {
        const continueButton = screen.getByText("Let's Go!").closest('button')
        expect(continueButton).not.toBeDisabled()
      })
    })
  })
})
