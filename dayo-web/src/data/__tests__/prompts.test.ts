import { describe, it, expect } from 'vitest'
import {
  adultPrompts,
  kidsPrompts,
  adultGratitudePrompts,
  kidsGratitudePrompts,
  adultHighlightEmojis,
  kidsHighlightEmojis,
} from '../prompts'

describe('prompts data', () => {
  describe('adultPrompts', () => {
    it('should have a placeholder', () => {
      expect(adultPrompts.placeholder).toBeDefined()
      expect(typeof adultPrompts.placeholder).toBe('string')
      expect(adultPrompts.placeholder.length).toBeGreaterThan(0)
    })

    it('should have suggestions array', () => {
      expect(Array.isArray(adultPrompts.suggestions)).toBe(true)
      expect(adultPrompts.suggestions.length).toBeGreaterThan(0)
    })

    it('should have proper diary placeholder', () => {
      expect(adultPrompts.placeholder).toBe('Dear diary, today...')
    })
  })

  describe('kidsPrompts', () => {
    it('should have a placeholder', () => {
      expect(kidsPrompts.placeholder).toBeDefined()
      expect(typeof kidsPrompts.placeholder).toBe('string')
      expect(kidsPrompts.placeholder.length).toBeGreaterThan(0)
    })

    it('should have suggestions array', () => {
      expect(Array.isArray(kidsPrompts.suggestions)).toBe(true)
      expect(kidsPrompts.suggestions.length).toBeGreaterThan(0)
    })

    it('should have kid-friendly placeholder', () => {
      expect(kidsPrompts.placeholder).toBe('Today was so cool because...')
    })

    it('should have different content than adult prompts', () => {
      expect(kidsPrompts.placeholder).not.toBe(adultPrompts.placeholder)
    })
  })

  describe('gratitudePrompts', () => {
    it('adultGratitudePrompts should be an array with items', () => {
      expect(Array.isArray(adultGratitudePrompts)).toBe(true)
      expect(adultGratitudePrompts.length).toBeGreaterThan(0)
    })

    it('kidsGratitudePrompts should be an array with items', () => {
      expect(Array.isArray(kidsGratitudePrompts)).toBe(true)
      expect(kidsGratitudePrompts.length).toBeGreaterThan(0)
    })

    it('all prompts should be strings', () => {
      adultGratitudePrompts.forEach((prompt) => {
        expect(typeof prompt).toBe('string')
      })
      kidsGratitudePrompts.forEach((prompt) => {
        expect(typeof prompt).toBe('string')
      })
    })
  })

  describe('highlightEmojis', () => {
    it('adultHighlightEmojis should have 10 emojis', () => {
      expect(adultHighlightEmojis).toHaveLength(10)
    })

    it('kidsHighlightEmojis should have 10 emojis', () => {
      expect(kidsHighlightEmojis).toHaveLength(10)
    })

    it('all items should be single emoji strings', () => {
      adultHighlightEmojis.forEach((emoji) => {
        expect(typeof emoji).toBe('string')
        expect(emoji.length).toBeGreaterThan(0)
      })
      kidsHighlightEmojis.forEach((emoji) => {
        expect(typeof emoji).toBe('string')
        expect(emoji.length).toBeGreaterThan(0)
      })
    })

    it('should have unique emojis in each array', () => {
      const uniqueAdult = [...new Set(adultHighlightEmojis)]
      const uniqueKids = [...new Set(kidsHighlightEmojis)]
      expect(uniqueAdult).toHaveLength(adultHighlightEmojis.length)
      expect(uniqueKids).toHaveLength(kidsHighlightEmojis.length)
    })
  })
})
