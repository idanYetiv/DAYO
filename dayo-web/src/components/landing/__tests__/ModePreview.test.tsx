import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ModePreview from '../ModePreview'

describe('ModePreview', () => {
  describe('mode toggle', () => {
    it('should render Adults and Kids toggle buttons', () => {
      render(<ModePreview />)
      expect(screen.getByText('Adults')).toBeInTheDocument()
      expect(screen.getByText('Kids')).toBeInTheDocument()
    })

    it('should default to adult mode', () => {
      render(<ModePreview />)
      // Adult description should be visible
      expect(screen.getByText(/thoughtful reflection/)).toBeInTheDocument()
    })

    it('should switch to kids mode when Kids button is clicked', () => {
      render(<ModePreview />)

      fireEvent.click(screen.getByText('Kids'))

      // Kids description should be visible
      expect(screen.getByText(/animal mood friends/)).toBeInTheDocument()
    })

    it('should switch back to adult mode when Adults button is clicked', () => {
      render(<ModePreview />)

      // Switch to kids first
      fireEvent.click(screen.getByText('Kids'))
      expect(screen.getByText(/animal mood friends/)).toBeInTheDocument()

      // Switch back to adults
      fireEvent.click(screen.getByText('Adults'))
      expect(screen.getByText(/thoughtful reflection/)).toBeInTheDocument()
    })
  })

  describe('adult preview', () => {
    it('should display adult greeting', () => {
      render(<ModePreview />)
      expect(screen.getByText('Good morning')).toBeInTheDocument()
    })

    it('should display adult mood emojis', () => {
      render(<ModePreview />)
      // Adult emojis
      expect(screen.getByText('✨')).toBeInTheDocument()
      expect(screen.getByText('🥰')).toBeInTheDocument()
      expect(screen.getByText('😐')).toBeInTheDocument()
      expect(screen.getByText('😢')).toBeInTheDocument()
      expect(screen.getByText('😫')).toBeInTheDocument()
    })

    it('should display adult diary placeholder', () => {
      render(<ModePreview />)
      expect(screen.getByText('Dear diary, today...')).toBeInTheDocument()
    })
  })

  describe('kids preview', () => {
    it('should display kids greeting', () => {
      render(<ModePreview />)
      expect(screen.getByText('Good morning, superstar!')).toBeInTheDocument()
    })

    it('should display kids animal emojis', () => {
      render(<ModePreview />)
      // Kids animal emojis
      expect(screen.getByText('🦁')).toBeInTheDocument()
      expect(screen.getByText('🐶')).toBeInTheDocument()
      expect(screen.getByText('🐢')).toBeInTheDocument()
      expect(screen.getByText('🐰')).toBeInTheDocument()
      expect(screen.getByText('🐻')).toBeInTheDocument()
    })

    it('should display kids diary placeholder', () => {
      render(<ModePreview />)
      expect(screen.getByText('Today was so cool because...')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should have proper adult card styling with dayo-gradient', () => {
      const { container } = render(<ModePreview />)
      const adultHeader = container.querySelector('.bg-dayo-gradient')
      expect(adultHeader).toBeInTheDocument()
    })

    it('should have proper kids card styling with kids-gradient', () => {
      const { container } = render(<ModePreview />)
      const kidsHeader = container.querySelector('.bg-kids-gradient')
      expect(kidsHeader).toBeInTheDocument()
    })
  })
})
