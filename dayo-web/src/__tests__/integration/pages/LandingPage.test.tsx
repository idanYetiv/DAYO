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

    it('should render updated description', () => {
      renderPage()
      expect(screen.getByText(/The diary that makes you want to write/)).toBeInTheDocument()
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

  describe('interactive demo', () => {
    it('should render the demo section', () => {
      renderPage()
      expect(screen.getByText('Try it yourself')).toBeInTheDocument()
    })

    it('should have mode toggle in demo', () => {
      renderPage()
      // Demo has its own Adults/Kids toggle
      const adultButtons = screen.getAllByText('Adults')
      expect(adultButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('should render mood options in demo', () => {
      renderPage()
      expect(screen.getByText('How are you feeling?')).toBeInTheDocument()
    })

    it('should render template options in demo', () => {
      renderPage()
      expect(screen.getByText('Choose a template')).toBeInTheDocument()
      const morningIntentionTexts = screen.getAllByText('Morning Intention')
      expect(morningIntentionTexts.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('diary features showcase', () => {
    it('should render features heading', () => {
      renderPage()
      expect(screen.getByText('A diary experience like no other')).toBeInTheDocument()
    })

    it('should render Smart Templates feature', () => {
      renderPage()
      expect(screen.getByText('Smart Templates')).toBeInTheDocument()
    })

    it('should render Mood Insights feature', () => {
      renderPage()
      expect(screen.getByText('Mood Insights')).toBeInTheDocument()
    })

    it('should render Search & Tags feature', () => {
      renderPage()
      expect(screen.getByText('Search & Tags')).toBeInTheDocument()
    })

    it('should render Photo Diary feature', () => {
      renderPage()
      expect(screen.getByText('Photo Diary')).toBeInTheDocument()
    })

    it('should render Writing Streaks feature', () => {
      renderPage()
      expect(screen.getByText('Writing Streaks')).toBeInTheDocument()
    })

    it('should render Bookmark Favorites feature', () => {
      renderPage()
      expect(screen.getByText('Bookmark Favorites')).toBeInTheDocument()
    })
  })

  describe('before/after comparison', () => {
    it('should render comparison heading', () => {
      renderPage()
      expect(screen.getByText('Not just another notes app')).toBeInTheDocument()
    })

    it('should render before section', () => {
      renderPage()
      expect(screen.getByText('BEFORE')).toBeInTheDocument()
    })

    it('should render after section', () => {
      renderPage()
      expect(screen.getByText('WITH DAYO')).toBeInTheDocument()
    })
  })

  describe('mode preview section', () => {
    it('should render For Adults & Kids heading', () => {
      renderPage()
      expect(screen.getByText('For Adults & Kids')).toBeInTheDocument()
    })

    it('should render mode toggle', () => {
      renderPage()
      // Both the demo and ModePreview have Adults/Kids buttons
      const adultButtons = screen.getAllByRole('button', { name: 'Adults' })
      const kidsButtons = screen.getAllByRole('button', { name: 'Kids' })
      expect(adultButtons.length).toBeGreaterThanOrEqual(1)
      expect(kidsButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('should toggle between adult and kids preview', () => {
      renderPage()
      expect(screen.getByText(/thoughtful reflection/)).toBeInTheDocument()
      // Click the ModePreview Kids button (last one, since demo comes first)
      const kidsButtons = screen.getAllByRole('button', { name: 'Kids' })
      fireEvent.click(kidsButtons[kidsButtons.length - 1])
      expect(screen.getByText(/animal mood friends/)).toBeInTheDocument()
    })
  })

  describe('testimonials section', () => {
    it('should render testimonials heading', () => {
      renderPage()
      expect(screen.getByText('Loved by journalers everywhere')).toBeInTheDocument()
    })

    it('should render 4 testimonials', () => {
      renderPage()
      expect(screen.getByText('Sarah K.')).toBeInTheDocument()
      expect(screen.getByText('Michael T.')).toBeInTheDocument()
      expect(screen.getByText('Emma R.')).toBeInTheDocument()
      expect(screen.getByText('James L.')).toBeInTheDocument()
    })

    it('should render testimonial quotes', () => {
      renderPage()
      expect(screen.getByText(/templates changed everything/)).toBeInTheDocument()
      expect(screen.getByText(/mood insights were eye-opening/)).toBeInTheDocument()
      expect(screen.getByText(/kids fight over who gets to pick/)).toBeInTheDocument()
      expect(screen.getByText(/bookmark feature is my personal highlight reel/)).toBeInTheDocument()
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
      const footerDayo = screen.getAllByText('DAYO')
      expect(footerDayo.length).toBeGreaterThanOrEqual(2)
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
      expect(screen.getByText(`\u00A9 ${currentYear} DAYO. All rights reserved.`)).toBeInTheDocument()
    })
  })
})
