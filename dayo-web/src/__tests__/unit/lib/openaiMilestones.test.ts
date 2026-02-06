import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateMilestoneCelebration, generateDailyInsight } from '../../../lib/openai'

describe('OpenAI Milestone & Insight Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateMilestoneCelebration', () => {
    it('should return a celebration message for first_entry milestone', async () => {
      const message = await generateMilestoneCelebration({
        milestoneId: 'first_entry',
        milestoneTitle: 'First Steps',
        milestoneDescription: 'Wrote your first diary entry',
        totalEntries: 1,
        totalWords: 50,
        isKidsMode: false,
      })

      expect(message).toBeTruthy()
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    })

    it('should return kids-friendly message when isKidsMode is true', async () => {
      const message = await generateMilestoneCelebration({
        milestoneId: 'first_entry',
        milestoneTitle: 'First Steps',
        milestoneDescription: 'Wrote your first diary entry',
        totalEntries: 1,
        totalWords: 50,
        isKidsMode: true,
      })

      expect(message).toBeTruthy()
      // Kids messages typically have emojis or exclamations
      expect(message.includes('!') || message.includes('YAY') || message.includes('WOW')).toBe(true)
    })

    it('should return message for words_100 milestone', async () => {
      const message = await generateMilestoneCelebration({
        milestoneId: 'words_100',
        milestoneTitle: 'Finding Your Voice',
        milestoneDescription: 'Wrote 100 words total',
        totalEntries: 5,
        totalWords: 105,
        isKidsMode: false,
      })

      expect(message).toBeTruthy()
      expect(typeof message).toBe('string')
    })

    it('should return message for words_1000 milestone', async () => {
      const message = await generateMilestoneCelebration({
        milestoneId: 'words_1000',
        milestoneTitle: 'Storyteller',
        milestoneDescription: 'Wrote 1,000 words total',
        totalEntries: 20,
        totalWords: 1050,
        isKidsMode: false,
      })

      expect(message).toBeTruthy()
    })

    it('should return message for words_10000 milestone', async () => {
      const message = await generateMilestoneCelebration({
        milestoneId: 'words_10000',
        milestoneTitle: 'Master Writer',
        milestoneDescription: 'Wrote 10,000 words total',
        totalEntries: 100,
        totalWords: 10500,
        isKidsMode: false,
      })

      expect(message).toBeTruthy()
    })
  })

  describe('generateDailyInsight', () => {
    it('should return empty string for short entries (less than 20 words)', async () => {
      const insight = await generateDailyInsight({
        diaryText: 'Short entry',
        mood: 'happy',
        isKidsMode: false,
      })

      expect(insight).toBe('')
    })

    it('should return an insight for entries with 20+ words', async () => {
      const insight = await generateDailyInsight({
        diaryText: 'Today was a wonderful day. I went for a walk in the park and enjoyed the sunshine. The birds were singing and everything felt peaceful and calm.',
        mood: 'happy',
        isKidsMode: false,
      })

      expect(insight).toBeTruthy()
      expect(typeof insight).toBe('string')
      expect(insight.length).toBeGreaterThan(0)
    })

    it('should handle different moods', async () => {
      const moods = ['amazing', 'happy', 'okay', 'sad', 'stressed']
      const diaryText = 'Today was a day filled with many thoughts and experiences. I spent time reflecting on what matters most to me.'

      for (const mood of moods) {
        const insight = await generateDailyInsight({
          diaryText,
          mood,
          isKidsMode: false,
        })

        expect(insight).toBeTruthy()
      }
    })

    it('should return kids-friendly insight when isKidsMode is true', async () => {
      const insight = await generateDailyInsight({
        diaryText: 'Today I played with my friends at school and we had so much fun playing tag and other games together.',
        mood: 'happy',
        isKidsMode: true,
      })

      expect(insight).toBeTruthy()
      // Kids insights typically have emojis or casual language
    })

    it('should handle gratitude and highlights context', async () => {
      const insight = await generateDailyInsight({
        diaryText: 'Today was a productive day at work. I finished my project and felt really accomplished and proud of myself. Looking forward to tomorrow and continuing the good momentum.',
        mood: 'happy',
        gratitude: ['My supportive team', 'Good weather'],
        highlights: [
          { emoji: '🎉', text: 'Finished the project' },
          { emoji: '☕', text: 'Great coffee' },
        ],
        isKidsMode: false,
      })

      expect(insight).toBeTruthy()
    })

    it('should strip HTML from diary text before word count', async () => {
      // This should be less than 20 words when HTML is stripped
      const insight = await generateDailyInsight({
        diaryText: '<p><strong>Hello</strong></p><div>World</div>',
        mood: 'okay',
        isKidsMode: false,
      })

      expect(insight).toBe('')
    })

    it('should handle diary with HTML that has 20+ words', async () => {
      const insight = await generateDailyInsight({
        diaryText: '<p>Today was a wonderful day. I went for a walk in the park and enjoyed the sunshine. The birds were singing and everything felt peaceful.</p>',
        mood: 'happy',
        isKidsMode: false,
      })

      expect(insight).toBeTruthy()
    })
  })
})
