import { describe, it, expect } from 'vitest'
import {
  adultEncouragements,
  kidsEncouragements,
  adultStreakCelebrations,
  kidsStreakCelebrations,
} from '../encouragements'

describe('encouragements data', () => {
  describe('adultEncouragements', () => {
    it('should have all required keys', () => {
      const requiredKeys = [
        'taskCreated',
        'taskCompleted',
        'taskDeleted',
        'diarySaved',
        'streakUpdated',
        'habitCompleted',
        'goalMilestone',
        'weeklyReview',
        'morningGreeting',
        'afternoonGreeting',
        'eveningGreeting',
      ]
      requiredKeys.forEach((key) => {
        expect(adultEncouragements).toHaveProperty(key)
      })
    })

    it('streakUpdated should be a function', () => {
      expect(typeof adultEncouragements.streakUpdated).toBe('function')
    })

    it('streakUpdated should return a string with the day count', () => {
      const result = adultEncouragements.streakUpdated(5)
      expect(typeof result).toBe('string')
      expect(result).toContain('5')
    })

    it('greetings should be appropriate for adults', () => {
      expect(adultEncouragements.morningGreeting).toBe('Good morning')
      expect(adultEncouragements.afternoonGreeting).toBe('Good afternoon')
      expect(adultEncouragements.eveningGreeting).toBe('Good evening')
    })
  })

  describe('kidsEncouragements', () => {
    it('should have all required keys', () => {
      const requiredKeys = [
        'taskCreated',
        'taskCompleted',
        'taskDeleted',
        'diarySaved',
        'streakUpdated',
        'habitCompleted',
        'goalMilestone',
        'weeklyReview',
        'morningGreeting',
        'afternoonGreeting',
        'eveningGreeting',
      ]
      requiredKeys.forEach((key) => {
        expect(kidsEncouragements).toHaveProperty(key)
      })
    })

    it('streakUpdated should be a function', () => {
      expect(typeof kidsEncouragements.streakUpdated).toBe('function')
    })

    it('streakUpdated should return an exciting message', () => {
      const result = kidsEncouragements.streakUpdated(5)
      expect(typeof result).toBe('string')
      expect(result).toContain('5')
      expect(result).toContain('FIRE') // Kids get exciting messages
    })

    it('should have more exciting messages than adults', () => {
      expect(kidsEncouragements.taskCompleted).toContain('WOOHOO')
      expect(kidsEncouragements.taskCreated).toContain('Awesome')
    })

    it('greetings should be fun for kids', () => {
      expect(kidsEncouragements.morningGreeting).toContain('superstar')
      expect(kidsEncouragements.afternoonGreeting).toContain('champion')
    })
  })

  describe('adultStreakCelebrations', () => {
    it('should have celebration messages for milestones', () => {
      expect(adultStreakCelebrations[3]).toBeDefined()
      expect(adultStreakCelebrations[7]).toBeDefined()
      expect(adultStreakCelebrations[14]).toBeDefined()
      expect(adultStreakCelebrations[30]).toBeDefined()
      expect(adultStreakCelebrations[100]).toBeDefined()
    })

    it('all celebration messages should be strings', () => {
      Object.values(adultStreakCelebrations).forEach((message) => {
        expect(typeof message).toBe('string')
      })
    })
  })

  describe('kidsStreakCelebrations', () => {
    it('should have celebration messages for milestones', () => {
      expect(kidsStreakCelebrations[3]).toBeDefined()
      expect(kidsStreakCelebrations[7]).toBeDefined()
      expect(kidsStreakCelebrations[14]).toBeDefined()
      expect(kidsStreakCelebrations[30]).toBeDefined()
      expect(kidsStreakCelebrations[100]).toBeDefined()
    })

    it('all celebration messages should be strings', () => {
      Object.values(kidsStreakCelebrations).forEach((message) => {
        expect(typeof message).toBe('string')
      })
    })

    it('should have more exciting messages than adults', () => {
      // Kids messages should have caps or emojis
      Object.values(kidsStreakCelebrations).forEach((message) => {
        const hasExcitement = message.includes('!') || /[A-Z]{2,}/.test(message)
        expect(hasExcitement).toBe(true)
      })
    })

    it('should have same milestones as adults', () => {
      const adultMilestones = Object.keys(adultStreakCelebrations).map(Number)
      const kidsMilestones = Object.keys(kidsStreakCelebrations).map(Number)
      expect(kidsMilestones).toEqual(adultMilestones)
    })
  })
})
