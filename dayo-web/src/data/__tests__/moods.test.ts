import { describe, it, expect } from 'vitest'
import {
  adultMoods,
  kidsMoods,
  adultMoodEmojis,
  kidsMoodEmojis,
  type MoodOption,
} from '../moods'

describe('moods data', () => {
  describe('adultMoods', () => {
    it('should have 5 mood options', () => {
      expect(adultMoods).toHaveLength(5)
    })

    it('should have required properties for each mood', () => {
      adultMoods.forEach((mood: MoodOption) => {
        expect(mood).toHaveProperty('id')
        expect(mood).toHaveProperty('emoji')
        expect(mood).toHaveProperty('label')
        expect(typeof mood.id).toBe('string')
        expect(typeof mood.emoji).toBe('string')
        expect(typeof mood.label).toBe('string')
      })
    })

    it('should include standard moods', () => {
      const moodIds = adultMoods.map((m) => m.id)
      expect(moodIds).toContain('amazing')
      expect(moodIds).toContain('happy')
      expect(moodIds).toContain('okay')
      expect(moodIds).toContain('sad')
      expect(moodIds).toContain('stressed')
    })

    it('should have unique IDs', () => {
      const ids = adultMoods.map((m) => m.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids).toHaveLength(uniqueIds.length)
    })
  })

  describe('kidsMoods', () => {
    it('should have 5 mood options', () => {
      expect(kidsMoods).toHaveLength(5)
    })

    it('should have required properties for each mood', () => {
      kidsMoods.forEach((mood: MoodOption) => {
        expect(mood).toHaveProperty('id')
        expect(mood).toHaveProperty('emoji')
        expect(mood).toHaveProperty('label')
        expect(typeof mood.id).toBe('string')
        expect(typeof mood.emoji).toBe('string')
        expect(typeof mood.label).toBe('string')
      })
    })

    it('should have animal emojis', () => {
      const animalEmojis = ['🦁', '🐶', '🐢', '🐰', '🐻']
      kidsMoods.forEach((mood) => {
        expect(animalEmojis).toContain(mood.emoji)
      })
    })

    it('should have color property for each mood', () => {
      kidsMoods.forEach((mood) => {
        expect(mood).toHaveProperty('color')
        expect(mood.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      })
    })

    it('should have unique IDs', () => {
      const ids = kidsMoods.map((m) => m.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids).toHaveLength(uniqueIds.length)
    })
  })

  describe('adultMoodEmojis', () => {
    it('should map mood IDs to emojis', () => {
      expect(adultMoodEmojis.amazing).toBe('✨')
      expect(adultMoodEmojis.happy).toBe('🥰')
      expect(adultMoodEmojis.okay).toBe('😐')
      expect(adultMoodEmojis.sad).toBe('😢')
      expect(adultMoodEmojis.stressed).toBe('😫')
    })

    it('should have matching IDs with adultMoods', () => {
      const moodIds = adultMoods.map((m) => m.id)
      moodIds.forEach((id) => {
        expect(adultMoodEmojis[id]).toBeDefined()
      })
    })
  })

  describe('kidsMoodEmojis', () => {
    it('should map mood IDs to animal emojis', () => {
      expect(kidsMoodEmojis.amazing).toBe('🦁')
      expect(kidsMoodEmojis.happy).toBe('🐶')
      expect(kidsMoodEmojis.okay).toBe('🐢')
      expect(kidsMoodEmojis.sad).toBe('🐰')
      expect(kidsMoodEmojis.tired).toBe('🐻')
    })

    it('should have backwards compatibility for stressed', () => {
      expect(kidsMoodEmojis.stressed).toBe('🐻')
    })
  })
})
