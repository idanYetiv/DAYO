import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MilestoneCelebration from '../../../components/diary/MilestoneCelebration'
import { DIARY_MILESTONES } from '../../../hooks/useDiaryMilestones'

describe('MilestoneCelebration Component', () => {
  const mockOnClose = vi.fn()
  const defaultProps = {
    milestone: DIARY_MILESTONES.first_entry,
    message: 'Congratulations on your first entry!',
    onClose: mockOnClose,
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render milestone title and message', () => {
    render(<MilestoneCelebration {...defaultProps} />)

    expect(screen.getByText('First Steps')).toBeInTheDocument()
    expect(screen.getByText('Wrote your first diary entry')).toBeInTheDocument()
    expect(screen.getByText('Congratulations on your first entry!')).toBeInTheDocument()
  })

  it('should render milestone emoji', () => {
    render(<MilestoneCelebration {...defaultProps} />)

    expect(screen.getByText(DIARY_MILESTONES.first_entry.emoji)).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    render(<MilestoneCelebration {...defaultProps} />)

    // Get all buttons and find the X close button (first one)
    const buttons = screen.getAllByRole('button')
    const closeButton = buttons[0] // X button is first
    fireEvent.click(closeButton)

    // Wait for animation timeout
    vi.advanceTimersByTime(300)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when "Keep Writing" button is clicked', () => {
    render(<MilestoneCelebration {...defaultProps} />)

    const keepWritingButton = screen.getByRole('button', { name: /keep writing/i })
    fireEvent.click(keepWritingButton)

    vi.advanceTimersByTime(300)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should auto-dismiss after 8 seconds', () => {
    render(<MilestoneCelebration {...defaultProps} />)

    expect(mockOnClose).not.toHaveBeenCalled()

    // Advance time by 8 seconds
    vi.advanceTimersByTime(8000)
    // Plus animation time
    vi.advanceTimersByTime(300)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should render differently in kids mode', () => {
    render(<MilestoneCelebration {...defaultProps} isKidsMode />)

    // Kids mode shows "Yay! Keep Writing!" instead of "Keep Writing"
    expect(screen.getByText('Yay! Keep Writing!')).toBeInTheDocument()
  })

  it('should close when backdrop is clicked', () => {
    render(<MilestoneCelebration {...defaultProps} />)

    // Find backdrop by class
    const backdrop = document.querySelector('.backdrop-blur-sm')
    expect(backdrop).toBeInTheDocument()

    if (backdrop) {
      fireEvent.click(backdrop)
      vi.advanceTimersByTime(300)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }
  })

  it('should render confetti particles', () => {
    render(<MilestoneCelebration {...defaultProps} />)

    // Check for confetti elements (should have animate-confetti class)
    const confettiElements = document.querySelectorAll('.animate-confetti')
    expect(confettiElements.length).toBe(50)
  })
})
