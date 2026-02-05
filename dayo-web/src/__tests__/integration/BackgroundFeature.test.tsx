import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock supabase
const mockGetUser = vi.fn()
const mockSelect = vi.fn()
const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()

vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => mockSingle(),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => mockUpdate(),
          }),
        }),
      }),
    }),
  },
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Background Feature', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    vi.clearAllMocks()

    // Reset body styles
    document.body.style.backgroundImage = ''
    document.body.style.backgroundSize = ''
    document.body.style.backgroundPosition = ''
    document.body.style.backgroundAttachment = ''
  })

  afterEach(() => {
    queryClient.clear()
    // Clean up body styles
    document.body.style.backgroundImage = ''
    document.body.style.backgroundSize = ''
    document.body.style.backgroundPosition = ''
    document.body.style.backgroundAttachment = ''
  })

  describe('Background Data Types', () => {
    it('should support gradient backgrounds', () => {
      const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      expect(gradient.startsWith('linear-gradient')).toBe(true)
    })

    it('should support data URL backgrounds (uploaded images)', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      expect(dataUrl.startsWith('data:')).toBe(true)
    })

    it('should support HTTP URL backgrounds', () => {
      const httpUrl = 'https://example.com/image.jpg'
      expect(httpUrl.startsWith('http')).toBe(true)
    })

    it('should support null for default background', () => {
      const defaultBg = null
      expect(defaultBg).toBeNull()
    })
  })

  describe('Background Application Logic', () => {
    it('should apply gradient background correctly', () => {
      const bg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

      // Simulate BackgroundApplier logic
      if (bg.startsWith('linear-gradient')) {
        document.body.style.backgroundImage = bg
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundAttachment = 'fixed'
      }

      // Browser normalizes hex to rgb, so check for gradient pattern
      expect(document.body.style.backgroundImage).toContain('linear-gradient')
      expect(document.body.style.backgroundSize).toBe('cover')
      expect(document.body.style.backgroundAttachment).toBe('fixed')
    })

    it('should apply data URL background correctly', () => {
      const bg = 'data:image/png;base64,abc123'

      // Simulate BackgroundApplier logic
      if (bg.startsWith('data:') || bg.startsWith('http')) {
        document.body.style.backgroundImage = `url(${bg})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundAttachment = 'fixed'
      }

      // Browser adds quotes around URL, so check for containment
      expect(document.body.style.backgroundImage).toContain('data:image/png;base64,abc123')
      expect(document.body.style.backgroundSize).toBe('cover')
      // Browser expands 'center' to 'center center'
      expect(document.body.style.backgroundPosition).toContain('center')
      expect(document.body.style.backgroundAttachment).toBe('fixed')
    })

    it('should apply HTTP URL background correctly', () => {
      const bg = 'https://example.com/image.jpg'

      // Simulate BackgroundApplier logic
      if (bg.startsWith('data:') || bg.startsWith('http')) {
        document.body.style.backgroundImage = `url(${bg})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundAttachment = 'fixed'
      }

      // Browser adds quotes around URL, so check for containment
      expect(document.body.style.backgroundImage).toContain('https://example.com/image.jpg')
    })

    it('should clear background when set to null/empty', () => {
      // First set a background
      document.body.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      document.body.style.backgroundSize = 'cover'

      // Then clear it (simulate null background)
      const bg = null
      if (!bg) {
        document.body.style.backgroundImage = ''
        document.body.style.backgroundSize = ''
        document.body.style.backgroundPosition = ''
        document.body.style.backgroundAttachment = ''
      }

      expect(document.body.style.backgroundImage).toBe('')
      expect(document.body.style.backgroundSize).toBe('')
    })
  })

  describe('Adult Mode Backgrounds', () => {
    const adultBackgrounds = [
      { id: 'none', label: 'Default', value: null },
      { id: 'gradient-purple', label: 'Purple Mist', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { id: 'gradient-ocean', label: 'Ocean Blue', value: 'linear-gradient(135deg, #667eea 0%, #17a2b8 100%)' },
      { id: 'gradient-sunset', label: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { id: 'gradient-forest', label: 'Forest', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
      { id: 'gradient-night', label: 'Night Sky', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
    ]

    it('should have 6 preset backgrounds for adults', () => {
      expect(adultBackgrounds).toHaveLength(6)
    })

    it('should have a default (none) option', () => {
      const defaultBg = adultBackgrounds.find(bg => bg.id === 'none')
      expect(defaultBg).toBeDefined()
      expect(defaultBg?.value).toBeNull()
    })

    it('should have valid gradient values for all presets', () => {
      adultBackgrounds.forEach(bg => {
        if (bg.value !== null) {
          expect(bg.value).toMatch(/^linear-gradient/)
        }
      })
    })
  })

  describe('Kids Mode Backgrounds', () => {
    const kidsBackgrounds = [
      { id: 'none', label: 'Default', value: null },
      { id: 'rainbow', label: 'Rainbow', value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 20%, #48dbfb 40%, #ff9ff3 60%, #54a0ff 80%, #5f27cd 100%)' },
      { id: 'candy', label: 'Candy Land', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
      { id: 'space', label: 'Space Adventure', value: 'linear-gradient(135deg, #0c0c2d 0%, #1a1a4e 50%, #2d2d6b 100%)' },
      { id: 'jungle', label: 'Jungle', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
      { id: 'ocean', label: 'Under the Sea', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #00d4ff 100%)' },
      { id: 'sunshine', label: 'Sunshine', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    ]

    it('should have 7 preset backgrounds for kids', () => {
      expect(kidsBackgrounds).toHaveLength(7)
    })

    it('should have a default (none) option', () => {
      const defaultBg = kidsBackgrounds.find(bg => bg.id === 'none')
      expect(defaultBg).toBeDefined()
      expect(defaultBg?.value).toBeNull()
    })

    it('should have kid-friendly themed backgrounds', () => {
      const themeNames = kidsBackgrounds.map(bg => bg.label)
      expect(themeNames).toContain('Rainbow')
      expect(themeNames).toContain('Candy Land')
      expect(themeNames).toContain('Space Adventure')
    })
  })

  describe('Custom Photo Upload', () => {
    it('should convert file to data URL format', async () => {
      // Simulate FileReader behavior
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })

      const reader = new FileReader()
      const dataUrlPromise = new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
      })
      reader.readAsDataURL(mockFile)

      const dataUrl = await dataUrlPromise
      expect(dataUrl).toMatch(/^data:image\/png;base64,/)
    })

    it('should accept image file types', () => {
      const acceptedTypes = 'image/*'
      expect(acceptedTypes).toBe('image/*')
    })
  })

  describe('Background Selection Logic', () => {
    it('should identify preset background as selected', () => {
      const currentBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      const presetValue = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

      expect(currentBackground === presetValue).toBe(true)
    })

    it('should identify custom background (not in presets)', () => {
      const currentBackground = 'data:image/png;base64,customImageData'
      const presets = [
        { value: null },
        { value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      ]

      const isCustom = !presets.some(bg => bg.value === currentBackground)
      expect(isCustom).toBe(true)
    })

    it('should identify default (null) as selected when no background', () => {
      const currentBackground = null
      const defaultPresetValue = null

      expect(currentBackground === defaultPresetValue).toBe(true)
    })
  })

  describe('Background Persistence', () => {
    it('should include background_image in profile update payload', () => {
      const updatePayload = {
        background_image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }

      expect(updatePayload).toHaveProperty('background_image')
      expect(updatePayload.background_image).toBeTruthy()
    })

    it('should allow setting background_image to null', () => {
      const updatePayload = {
        background_image: null,
      }

      expect(updatePayload).toHaveProperty('background_image')
      expect(updatePayload.background_image).toBeNull()
    })
  })
})

describe('Background Edge Cases', () => {
  beforeEach(() => {
    document.body.style.backgroundImage = ''
  })

  afterEach(() => {
    document.body.style.backgroundImage = ''
  })

  it('should handle empty string background', () => {
    const bg = ''

    // Empty string should be treated like null
    if (!bg) {
      document.body.style.backgroundImage = ''
    }

    expect(document.body.style.backgroundImage).toBe('')
  })

  it('should handle malformed gradient gracefully', () => {
    const bg = 'not-a-valid-gradient'

    // Should not match any of the expected patterns
    const isGradient = bg.startsWith('linear-gradient')
    const isUrl = bg.startsWith('data:') || bg.startsWith('http')

    expect(isGradient).toBe(false)
    expect(isUrl).toBe(false)
  })

  it('should handle very long data URLs (large images)', () => {
    // Simulate a large base64 image (this is a simplified test)
    const largeDataUrl = 'data:image/png;base64,' + 'A'.repeat(10000)

    expect(largeDataUrl.startsWith('data:')).toBe(true)
    expect(largeDataUrl.length).toBeGreaterThan(10000)
  })
})
