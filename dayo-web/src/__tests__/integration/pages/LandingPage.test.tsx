import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../../../pages/LandingPage'

describe('LandingPage', () => {
  const renderPage = () => {
    return render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )
  }

  describe('navigation', () => {
    it('should render DAYO logo', () => {
      renderPage()
      // DAYO appears in both nav and footer
      const dayoTexts = screen.getAllByText('DAYO')
      expect(dayoTexts.length).toBeGreaterThanOrEqual(1)
    })

    it('should render Sign In link', () => {
      renderPage()
      const signInLink = screen.getByRole('link', { name: 'Sign In' })
      expect(signInLink).toHaveAttribute('href', '/login')
    })

    it('should render Get Started link', () => {
      renderPage()
      const getStartedLink = screen.getByRole('link', { name: 'Get Started' })
      expect(getStartedLink).toHaveAttribute('href', '/signup')
    })
  })

  describe('hero section', () => {
    it('should render tagline', () => {
      renderPage()
      expect(screen.getByText(/Your personal growth companion/)).toBeInTheDocument()
    })

    it('should render main heading', () => {
      renderPage()
      expect(screen.getByText(/Your Day. Your Story./)).toBeInTheDocument()
    })

    it('should render description', () => {
      renderPage()
      expect(screen.getByText(/A beautiful daily journal for reflection and growth/)).toBeInTheDocument()
    })

    it('should render Start Your Journey CTA', () => {
      renderPage()
      const ctaLink = screen.getByRole('link', { name: /Start Your Journey/ })
      expect(ctaLink).toHaveAttribute('href', '/signup')
    })

    it('should render free forever text', () => {
      renderPage()
      expect(screen.getByText(/Free forever. No credit card required/)).toBeInTheDocument()
    })
  })

  describe('mode preview section', () => {
    it('should render For Adults & Kids heading', () => {
      renderPage()
      expect(screen.getByText('For Adults & Kids')).toBeInTheDocument()
    })

    it('should render mode toggle', () => {
      renderPage()
      // ModePreview component should render
      expect(screen.getByRole('button', { name: 'Adults' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Kids' })).toBeInTheDocument()
    })

    it('should toggle between adult and kids preview', () => {
      renderPage()

      // Default is adult mode
      expect(screen.getByText(/thoughtful reflection/)).toBeInTheDocument()

      // Click Kids button
      fireEvent.click(screen.getByRole('button', { name: 'Kids' }))

      // Should show kids mode description
      expect(screen.getByText(/animal mood friends/)).toBeInTheDocument()
    })
  })

  describe('features section', () => {
    it('should render features heading', () => {
      renderPage()
      expect(screen.getByText('Everything you need to grow')).toBeInTheDocument()
    })

    it('should render 2 Minutes a Day feature', () => {
      renderPage()
      expect(screen.getByText('2 Minutes a Day')).toBeInTheDocument()
    })

    it('should render Private & Secure feature', () => {
      renderPage()
      expect(screen.getByText('Private & Secure')).toBeInTheDocument()
    })

    it('should render Smart Prompts feature', () => {
      renderPage()
      expect(screen.getByText('Smart Prompts')).toBeInTheDocument()
    })

    it('should render Track Your Growth feature', () => {
      renderPage()
      expect(screen.getByText('Track Your Growth')).toBeInTheDocument()
    })

    it('should render all 4 feature cards', () => {
      renderPage()
      // Each feature has a description
      expect(screen.getByText(/Quick daily check-ins/)).toBeInTheDocument()
      expect(screen.getByText(/Your thoughts are yours alone/)).toBeInTheDocument()
      expect(screen.getByText(/Thoughtful questions/)).toBeInTheDocument()
      expect(screen.getByText(/Build streaks/)).toBeInTheDocument()
    })
  })

  describe('testimonials section', () => {
    it('should render testimonials heading', () => {
      renderPage()
      expect(screen.getByText('Loved by thousands')).toBeInTheDocument()
    })

    it('should render 3 testimonials', () => {
      renderPage()
      expect(screen.getByText('Sarah K.')).toBeInTheDocument()
      expect(screen.getByText('Michael T.')).toBeInTheDocument()
      expect(screen.getByText('Emma R.')).toBeInTheDocument()
    })

    it('should render testimonial roles', () => {
      renderPage()
      expect(screen.getByText('Designer')).toBeInTheDocument()
      expect(screen.getByText('Parent')).toBeInTheDocument()
      expect(screen.getByText('Teacher')).toBeInTheDocument()
    })

    it('should render testimonial quotes', () => {
      renderPage()
      expect(screen.getByText(/DAYO has become my morning ritual/)).toBeInTheDocument()
      expect(screen.getByText(/My daughter loves the animal moods/)).toBeInTheDocument()
      expect(screen.getByText(/a journal app that doesn't feel like homework/)).toBeInTheDocument()
    })
  })

  describe('CTA section', () => {
    it('should render Start your journey today heading', () => {
      renderPage()
      expect(screen.getByText('Start your journey today')).toBeInTheDocument()
    })

    it('should render Create Free Account link', () => {
      renderPage()
      const ctaLink = screen.getByRole('link', { name: /Create Free Account/ })
      expect(ctaLink).toHaveAttribute('href', '/signup')
    })
  })

  describe('footer', () => {
    it('should render footer DAYO logo', () => {
      renderPage()
      // Footer has DAYO text
      const footerDayo = screen.getAllByText('DAYO')
      expect(footerDayo.length).toBeGreaterThanOrEqual(2) // Nav + footer
    })

    it('should render footer links', () => {
      renderPage()
      expect(screen.getByText('Privacy')).toBeInTheDocument()
      expect(screen.getByText('Terms')).toBeInTheDocument()
      expect(screen.getByText('Support')).toBeInTheDocument()
      expect(screen.getByText('Contact')).toBeInTheDocument()
    })

    it('should render copyright', () => {
      renderPage()
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(`© ${currentYear} DAYO. All rights reserved.`)).toBeInTheDocument()
    })
  })
})
