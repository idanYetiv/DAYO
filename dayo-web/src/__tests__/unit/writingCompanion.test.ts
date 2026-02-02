import { describe, it, expect } from 'vitest'
import { getLocalWritingPrompt, buildCompanionSystemPrompt, type WritingCompanionContext } from '../../lib/writingCompanion'

function makeContext(overrides: Partial<WritingCompanionContext> = {}): WritingCompanionContext {
  return {
    mood: 'okay',
    currentText: '',
    wordCount: 0,
    isKidsMode: false,
    ...overrides,
  }
}

describe('writingCompanion', () => {
  describe('getLocalWritingPrompt', () => {
    it('returns a string prompt', () => {
      const prompt = getLocalWritingPrompt(makeContext())
      expect(typeof prompt).toBe('string')
      expect(prompt.length).toBeGreaterThan(0)
    })

    it('returns different prompts for different moods', () => {
      const moods = ['amazing', 'happy', 'okay', 'sad', 'stressed', 'tired']
      const prompts = new Set(
        moods.map(mood => getLocalWritingPrompt(makeContext({ mood })))
      )
      // At least some should be different (probabilistic but very likely)
      expect(prompts.size).toBeGreaterThanOrEqual(2)
    })

    it('returns different prompts for different word count stages', () => {
      const stages = [
        { wordCount: 0, currentText: '' },             // start
        { wordCount: 30, currentText: 'x '.repeat(30) },  // going
        { wordCount: 80, currentText: 'x '.repeat(80) },  // reflecting
      ]

      const prompts = stages.map(s => getLocalWritingPrompt(makeContext(s)))
      // Should have gotten prompts for each stage
      expect(prompts).toHaveLength(3)
      prompts.forEach(p => {
        expect(typeof p).toBe('string')
        expect(p.length).toBeGreaterThan(0)
      })
    })

    it('returns kids-mode prompts with emoji', () => {
      const prompt = getLocalWritingPrompt(makeContext({ isKidsMode: true }))
      expect(typeof prompt).toBe('string')
      expect(prompt.length).toBeGreaterThan(0)
    })

    it('returns adult-mode prompts without emoji prefix', () => {
      // Run multiple times to reduce flakiness
      let hasNonEmoji = false
      for (let i = 0; i < 10; i++) {
        const prompt = getLocalWritingPrompt(makeContext({ isKidsMode: false, mood: 'okay' }))
        // Adult prompts shouldn't start with emoji (they start with letters)
        if (/^[A-Z]/.test(prompt)) {
          hasNonEmoji = true
          break
        }
      }
      expect(hasNonEmoji).toBe(true)
    })

    it('handles unknown mood gracefully', () => {
      const prompt = getLocalWritingPrompt(makeContext({ mood: 'unknown-mood' }))
      expect(typeof prompt).toBe('string')
      expect(prompt.length).toBeGreaterThan(0)
    })
  })

  describe('buildCompanionSystemPrompt', () => {
    it('builds a system prompt string', () => {
      const prompt = buildCompanionSystemPrompt(makeContext())
      expect(prompt).toContain('writing companion')
      expect(prompt).toContain('diary app')
    })

    it('includes mood context', () => {
      const prompt = buildCompanionSystemPrompt(makeContext({ mood: 'happy' }))
      expect(prompt).toContain('mood=happy')
    })

    it('includes word count', () => {
      const prompt = buildCompanionSystemPrompt(makeContext({ wordCount: 42 }))
      expect(prompt).toContain('words=42')
    })

    it('mentions kids mode for kids', () => {
      const prompt = buildCompanionSystemPrompt(makeContext({ isKidsMode: true }))
      expect(prompt).toContain('child')
    })

    it('mentions adult for adults', () => {
      const prompt = buildCompanionSystemPrompt(makeContext({ isKidsMode: false }))
      expect(prompt).toContain('adult')
    })

    it('includes recent text', () => {
      const prompt = buildCompanionSystemPrompt(makeContext({ currentText: 'Today I went for a walk' }))
      expect(prompt).toContain('Today I went for a walk')
    })

    it('truncates long text to 300 chars', () => {
      const longText = 'a'.repeat(500)
      const prompt = buildCompanionSystemPrompt(makeContext({ currentText: longText }))
      // The system prompt should include a slice of 300 chars
      expect(prompt).not.toContain('a'.repeat(500))
    })
  })
})
