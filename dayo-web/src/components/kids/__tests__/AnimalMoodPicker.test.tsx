import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AnimalMoodPicker from '../AnimalMoodPicker'
import { kidsMoods } from '../../../data/moods'

describe('AnimalMoodPicker', () => {
  const defaultProps = {
    selectedMood: '',
    onSelectMood: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render all kids moods', () => {
      render(<AnimalMoodPicker {...defaultProps} />)

      kidsMoods.forEach((mood) => {
        expect(screen.getByText(mood.emoji)).toBeInTheDocument()
        expect(screen.getByText(mood.label)).toBeInTheDocument()
      })
    })

    it('should render 5 mood buttons', () => {
      render(<AnimalMoodPicker {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(5)
    })

    it('should render animal emojis', () => {
      render(<AnimalMoodPicker {...defaultProps} />)

      // Kids moods use animal emojis
      expect(screen.getByText('🦁')).toBeInTheDocument()
      expect(screen.getByText('🐶')).toBeInTheDocument()
      expect(screen.getByText('🐢')).toBeInTheDocument()
      expect(screen.getByText('🐰')).toBeInTheDocument()
      expect(screen.getByText('🐻')).toBeInTheDocument()
    })
  })

  describe('selection', () => {
    it('should call onSelectMood when a mood is clicked', () => {
      const onSelectMood = vi.fn()
      render(<AnimalMoodPicker {...defaultProps} onSelectMood={onSelectMood} />)

      const amazingButton = screen.getByText('🦁').closest('button')
      fireEvent.click(amazingButton!)

      expect(onSelectMood).toHaveBeenCalledWith('amazing')
    })

    it('should visually indicate selected mood', () => {
      render(<AnimalMoodPicker {...defaultProps} selectedMood="happy" />)

      // The selected button should have a checkmark
      expect(screen.getByText('✓')).toBeInTheDocument()
    })

    it('should not show checkmark for unselected moods', () => {
      render(<AnimalMoodPicker {...defaultProps} selectedMood="" />)

      expect(screen.queryByText('✓')).not.toBeInTheDocument()
    })

    it('should allow selecting different moods', () => {
      const onSelectMood = vi.fn()
      render(<AnimalMoodPicker {...defaultProps} onSelectMood={onSelectMood} />)

      const sadButton = screen.getByText('🐰').closest('button')
      fireEvent.click(sadButton!)

      expect(onSelectMood).toHaveBeenCalledWith('sad')
    })
  })

  describe('accessibility', () => {
    it('should have button type on mood buttons', () => {
      render(<AnimalMoodPicker {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })
  })
})
