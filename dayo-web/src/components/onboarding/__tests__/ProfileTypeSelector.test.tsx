import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfileTypeSelector from '../ProfileTypeSelector'

describe('ProfileTypeSelector', () => {
  const defaultProps = {
    selectedType: null,
    onSelect: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render two profile options', () => {
      render(<ProfileTypeSelector {...defaultProps} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })

    it('should display Adults option', () => {
      render(<ProfileTypeSelector {...defaultProps} />)
      expect(screen.getByText('Adults')).toBeInTheDocument()
      expect(screen.getByText('Reflect on your journey')).toBeInTheDocument()
    })

    it('should display Kids option', () => {
      render(<ProfileTypeSelector {...defaultProps} />)
      expect(screen.getByText('Kids')).toBeInTheDocument()
      expect(screen.getByText('Adventure journal!')).toBeInTheDocument()
    })

    it('should display adult emoji', () => {
      render(<ProfileTypeSelector {...defaultProps} />)
      expect(screen.getByText('✨')).toBeInTheDocument()
    })

    it('should display kid emoji', () => {
      render(<ProfileTypeSelector {...defaultProps} />)
      expect(screen.getByText('🦁')).toBeInTheDocument()
    })
  })

  describe('features', () => {
    it('should display adult features', () => {
      render(<ProfileTypeSelector {...defaultProps} />)
      expect(screen.getByText('Calm, minimal design')).toBeInTheDocument()
      expect(screen.getByText('Thoughtful prompts')).toBeInTheDocument()
      expect(screen.getByText('Mood tracking with emojis')).toBeInTheDocument()
      expect(screen.getByText('Private journaling')).toBeInTheDocument()
    })

    it('should display kid features', () => {
      render(<ProfileTypeSelector {...defaultProps} />)
      expect(screen.getByText('Fun, colorful design')).toBeInTheDocument()
      expect(screen.getByText('Animal mood friends')).toBeInTheDocument()
      expect(screen.getByText('Exciting prompts')).toBeInTheDocument()
      expect(screen.getByText('Stickers & celebrations')).toBeInTheDocument()
    })
  })

  describe('selection', () => {
    it('should call onSelect with "adult" when Adults is clicked', () => {
      const onSelect = vi.fn()
      render(<ProfileTypeSelector {...defaultProps} onSelect={onSelect} />)

      fireEvent.click(screen.getByText('Adults'))

      expect(onSelect).toHaveBeenCalledWith('adult')
    })

    it('should call onSelect with "kid" when Kids is clicked', () => {
      const onSelect = vi.fn()
      render(<ProfileTypeSelector {...defaultProps} onSelect={onSelect} />)

      fireEvent.click(screen.getByText('Kids'))

      expect(onSelect).toHaveBeenCalledWith('kid')
    })

    it('should show checkmark for selected adult option', () => {
      render(<ProfileTypeSelector {...defaultProps} selectedType="adult" />)
      expect(screen.getByText('✓')).toBeInTheDocument()
    })

    it('should show checkmark for selected kid option', () => {
      render(<ProfileTypeSelector {...defaultProps} selectedType="kid" />)
      expect(screen.getByText('✓')).toBeInTheDocument()
    })

    it('should not show checkmark when no selection', () => {
      render(<ProfileTypeSelector {...defaultProps} selectedType={null} />)
      expect(screen.queryByText('✓')).not.toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply selected styling to adult option', () => {
      render(<ProfileTypeSelector {...defaultProps} selectedType="adult" />)
      const buttons = screen.getAllByRole('button')
      // First button (Adults) should have gradient and scale
      expect(buttons[0]).toHaveClass('scale-105')
    })

    it('should apply selected styling to kid option', () => {
      render(<ProfileTypeSelector {...defaultProps} selectedType="kid" />)
      const buttons = screen.getAllByRole('button')
      // Second button (Kids) should have gradient and scale
      expect(buttons[1]).toHaveClass('scale-105')
    })

    it('should not apply selected styling to unselected options', () => {
      render(<ProfileTypeSelector {...defaultProps} selectedType={null} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).not.toHaveClass('scale-105')
      expect(buttons[1]).not.toHaveClass('scale-105')
    })
  })
})
