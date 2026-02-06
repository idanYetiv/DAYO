import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DailyInsightToast from '../../../components/diary/DailyInsightToast'

describe('DailyInsightToast Component', () => {
  const mockOnClose = vi.fn()
  const defaultProps = {
    insight: 'Your reflection shows thoughtful self-awareness.',
    onClose: mockOnClose,
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render the insight text', () => {
    render(<DailyInsightToast {...defaultProps} />)

    expect(screen.getByText('Your reflection shows thoughtful self-awareness.')).toBeInTheDocument()
  })

  it('should render mood emoji when provided', () => {
    render(<DailyInsightToast {...defaultProps} moodEmoji="😊" />)

    expect(screen.getByText('😊')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    render(<DailyInsightToast {...defaultProps} />)

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    vi.advanceTimersByTime(300)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should auto-dismiss after 6 seconds', () => {
    render(<DailyInsightToast {...defaultProps} />)

    expect(mockOnClose).not.toHaveBeenCalled()

    // Advance time by 6 seconds
    vi.advanceTimersByTime(6000)
    // Plus animation time
    vi.advanceTimersByTime(300)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should render with kids mode styling', () => {
    const { container } = render(<DailyInsightToast {...defaultProps} isKidsMode />)

    // Check for kids mode gradient classes
    expect(container.querySelector('.from-dayo-kids-yellow\\/95')).toBeInTheDocument()
  })

  it('should have progress bar for auto-dismiss', () => {
    const { container } = render(<DailyInsightToast {...defaultProps} />)

    // Check for progress bar with shrink animation
    expect(container.querySelector('.animate-shrink')).toBeInTheDocument()
  })

  it('should show sparkles icon when no mood emoji in adult mode', () => {
    render(<DailyInsightToast {...defaultProps} />)

    // The sparkles icon should be rendered (inside the emoji container)
    const iconContainer = document.querySelector('.bg-purple-100')
    expect(iconContainer).toBeInTheDocument()
  })

  it('should show star emoji when no mood emoji in kids mode', () => {
    render(<DailyInsightToast {...defaultProps} isKidsMode />)

    expect(screen.getByText('✨')).toBeInTheDocument()
  })
})
