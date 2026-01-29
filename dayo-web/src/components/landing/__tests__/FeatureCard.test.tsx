import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Clock, Lock, Sparkles } from 'lucide-react'
import FeatureCard from '../FeatureCard'

describe('FeatureCard', () => {
  const defaultProps = {
    icon: Clock,
    title: 'Quick Journaling',
    description: 'Capture your day in just 2 minutes.',
  }

  describe('rendering', () => {
    it('should render the title', () => {
      render(<FeatureCard {...defaultProps} />)
      expect(screen.getByText('Quick Journaling')).toBeInTheDocument()
    })

    it('should render the description', () => {
      render(<FeatureCard {...defaultProps} />)
      expect(screen.getByText('Capture your day in just 2 minutes.')).toBeInTheDocument()
    })

    it('should render the icon', () => {
      const { container } = render(<FeatureCard {...defaultProps} />)
      // The icon should be rendered inside a container
      const iconContainer = container.querySelector('.w-12.h-12')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('different icons', () => {
    it('should render Lock icon', () => {
      render(
        <FeatureCard
          icon={Lock}
          title="Private"
          description="Your data stays yours."
        />
      )
      expect(screen.getByText('Private')).toBeInTheDocument()
    })

    it('should render Sparkles icon', () => {
      render(
        <FeatureCard
          icon={Sparkles}
          title="Smart Prompts"
          description="AI-powered suggestions."
        />
      )
      expect(screen.getByText('Smart Prompts')).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should have proper card styling', () => {
      const { container } = render(<FeatureCard {...defaultProps} />)
      const card = container.firstChild
      expect(card).toHaveClass('bg-white')
      expect(card).toHaveClass('rounded-2xl')
      expect(card).toHaveClass('shadow-sm')
    })

    it('should have gradient background on icon container', () => {
      const { container } = render(<FeatureCard {...defaultProps} />)
      const iconContainer = container.querySelector('.bg-dayo-gradient')
      expect(iconContainer).toBeInTheDocument()
    })
  })
})
