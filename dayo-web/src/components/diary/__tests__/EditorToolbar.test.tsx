/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EditorToolbar from '../EditorToolbar'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'toolbar.bold': 'Bold',
        'toolbar.italic': 'Italic',
        'toolbar.underline': 'Underline',
        'toolbar.heading2': 'Heading 2',
        'toolbar.heading3': 'Heading 3',
        'toolbar.bulletList': 'Bullet List',
        'toolbar.orderedList': 'Ordered List',
        'toolbar.draw.adult': 'Sketch',
        'toolbar.draw.kids': 'Draw',
        'toolbar.drawHint.adult': 'Add sketch',
        'toolbar.drawHint.kids': 'Draw something!',
      }
      return translations[key] || key
    },
  }),
}))

// Mock useProfileMode
vi.mock('../../../hooks/useProfileMode', () => ({
  useProfileMode: () => ({ isKidsMode: false }),
}))

// Create a mock editor
const createMockEditor = (overrides = {}) => ({
  chain: () => ({
    focus: () => ({
      toggleBold: () => ({ run: vi.fn() }),
      toggleItalic: () => ({ run: vi.fn() }),
      toggleUnderline: () => ({ run: vi.fn() }),
      toggleHeading: () => ({ run: vi.fn() }),
      toggleBulletList: () => ({ run: vi.fn() }),
      toggleOrderedList: () => ({ run: vi.fn() }),
    }),
  }),
  isActive: vi.fn().mockReturnValue(false),
  ...overrides,
})

describe('EditorToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('formatting buttons', () => {
    it('should render all formatting buttons', () => {
      const editor = createMockEditor()
      render(<EditorToolbar editor={editor as any} />)

      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Underline' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Heading 2' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Heading 3' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Bullet List' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Ordered List' })).toBeInTheDocument()
    })

    it('should not render when editor is null', () => {
      const { container } = render(<EditorToolbar editor={null} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('sketch button', () => {
    it('should render sketch button when onToggleSketch is provided', () => {
      const editor = createMockEditor()
      render(
        <EditorToolbar
          editor={editor as any}
          onToggleSketch={vi.fn()}
          isSketchOpen={false}
          hasSketch={false}
        />
      )

      expect(screen.getByRole('button', { name: 'Sketch' })).toBeInTheDocument()
    })

    it('should not render sketch button when onToggleSketch is not provided', () => {
      const editor = createMockEditor()
      render(<EditorToolbar editor={editor as any} />)

      expect(screen.queryByRole('button', { name: 'Sketch' })).not.toBeInTheDocument()
    })

    it('should call onToggleSketch when sketch button is clicked', () => {
      const onToggleSketch = vi.fn()
      const editor = createMockEditor()
      render(
        <EditorToolbar
          editor={editor as any}
          onToggleSketch={onToggleSketch}
          isSketchOpen={false}
          hasSketch={false}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: 'Sketch' }))
      expect(onToggleSketch).toHaveBeenCalled()
    })

    it('should show active state when sketch is open', () => {
      const editor = createMockEditor()
      render(
        <EditorToolbar
          editor={editor as any}
          onToggleSketch={vi.fn()}
          isSketchOpen={true}
          hasSketch={false}
        />
      )

      const sketchButton = screen.getByRole('button', { name: 'Sketch' })
      expect(sketchButton).toHaveClass('is-active')
    })

    it('should show indicator dot when hasSketch is true and sketch is closed', () => {
      const editor = createMockEditor()
      const { container } = render(
        <EditorToolbar
          editor={editor as any}
          onToggleSketch={vi.fn()}
          isSketchOpen={false}
          hasSketch={true}
        />
      )

      // Look for the indicator dot (small pink circle)
      const indicatorDot = container.querySelector('.bg-pink-500.rounded-full')
      expect(indicatorDot).toBeInTheDocument()
    })

    it('should not show indicator dot when sketch is open', () => {
      const editor = createMockEditor()
      const { container } = render(
        <EditorToolbar
          editor={editor as any}
          onToggleSketch={vi.fn()}
          isSketchOpen={true}
          hasSketch={true}
        />
      )

      // The indicator should be hidden when sketch panel is open
      const indicatorDot = container.querySelector('.bg-pink-500.rounded-full.w-2')
      expect(indicatorDot).not.toBeInTheDocument()
    })

    it('should render separator before sketch button', () => {
      const editor = createMockEditor()
      const { container } = render(
        <EditorToolbar
          editor={editor as any}
          onToggleSketch={vi.fn()}
          isSketchOpen={false}
          hasSketch={false}
        />
      )

      // Look for the separator div
      const separator = container.querySelector('.w-px.h-5.bg-dayo-gray-200')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have toolbar role', () => {
      const editor = createMockEditor()
      render(<EditorToolbar editor={editor as any} />)

      expect(screen.getByRole('toolbar')).toBeInTheDocument()
    })

    it('should have aria-label for toolbar', () => {
      const editor = createMockEditor()
      render(<EditorToolbar editor={editor as any} />)

      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Text formatting')
    })

    it('should have aria-pressed on buttons', () => {
      const editor = createMockEditor({ isActive: () => true })
      render(<EditorToolbar editor={editor as any} />)

      const boldButton = screen.getByRole('button', { name: 'Bold' })
      expect(boldButton).toHaveAttribute('aria-pressed', 'true')
    })
  })
})
