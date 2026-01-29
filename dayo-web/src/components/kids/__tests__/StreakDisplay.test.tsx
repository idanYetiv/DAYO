import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import StreakDisplay, { StreakConfetti } from '../StreakDisplay'
import { kidsStreakCelebrations } from '../../../data/encouragements'

describe('StreakDisplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('rendering', () => {
    it('should render streak count', () => {
      render(<StreakDisplay streak={5} />)
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should show singular "day" for streak of 1', () => {
      render(<StreakDisplay streak={1} />)
      expect(screen.getByText('day!')).toBeInTheDocument()
    })

    it('should show plural "days" for streak > 1', () => {
      render(<StreakDisplay streak={3} />)
      expect(screen.getByText('days!')).toBeInTheDocument()
    })

    it('should show plural "days" for streak of 0', () => {
      render(<StreakDisplay streak={0} />)
      expect(screen.getByText('days!')).toBeInTheDocument()
    })
  })

  describe('celebration messages', () => {
    it('should show celebration message for 3-day milestone', () => {
      render(<StreakDisplay streak={3} showCelebration />)
      expect(screen.getByText(kidsStreakCelebrations[3])).toBeInTheDocument()
    })

    it('should show celebration message for 7-day milestone', () => {
      render(<StreakDisplay streak={7} showCelebration />)
      expect(screen.getByText(kidsStreakCelebrations[7])).toBeInTheDocument()
    })

    it('should not show celebration message without showCelebration prop', () => {
      render(<StreakDisplay streak={7} />)
      expect(screen.queryByText(kidsStreakCelebrations[7])).not.toBeInTheDocument()
    })

    it('should not show celebration message for non-milestone streaks', () => {
      render(<StreakDisplay streak={5} showCelebration />)
      // Check that no milestone message is shown
      Object.values(kidsStreakCelebrations).forEach((message) => {
        expect(screen.queryByText(message)).not.toBeInTheDocument()
      })
    })
  })

  describe('animation', () => {
    it('should animate when showCelebration is true and streak > 0', async () => {
      const { container } = render(<StreakDisplay streak={5} showCelebration />)

      // Should show sparkle effects during animation
      expect(container.querySelector('.animate-ping')).toBeInTheDocument()
    })

    it('should not animate without showCelebration', () => {
      const { container } = render(<StreakDisplay streak={5} />)
      expect(container.querySelector('.animate-ping')).not.toBeInTheDocument()
    })

    it('should stop animation after 2 seconds', async () => {
      const { container } = render(<StreakDisplay streak={5} showCelebration />)

      expect(container.querySelector('.animate-ping')).toBeInTheDocument()

      // Advance time by 2 seconds using act to handle state updates
      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      expect(container.querySelector('.animate-ping')).not.toBeInTheDocument()
    })

    it('should not animate when streak is 0 even with showCelebration', () => {
      const { container } = render(<StreakDisplay streak={0} showCelebration />)
      expect(container.querySelector('.animate-ping')).not.toBeInTheDocument()
    })
  })
})

describe('StreakConfetti', () => {
  it('should render 50 confetti pieces', () => {
    const { container } = render(<StreakConfetti />)
    const confettiPieces = container.querySelectorAll('.animate-confetti')
    expect(confettiPieces).toHaveLength(50)
  })

  it('should have pointer-events-none to avoid blocking interaction', () => {
    const { container } = render(<StreakConfetti />)
    const confettiContainer = container.firstChild
    expect(confettiContainer).toHaveClass('pointer-events-none')
  })

  it('should be fixed positioned for overlay effect', () => {
    const { container } = render(<StreakConfetti />)
    const confettiContainer = container.firstChild
    expect(confettiContainer).toHaveClass('fixed')
    expect(confettiContainer).toHaveClass('inset-0')
  })
})
