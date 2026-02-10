import i18n from '../i18n'

export interface DiaryPrompt {
  placeholder: string
  suggestions: string[]
}

// Helper to get translated prompts
export function getAdultPrompts(): DiaryPrompt {
  const suggestions = i18n.t('diary.adult.suggestions', { ns: 'prompts', returnObjects: true }) as string[]
  return {
    placeholder: i18n.t('diary.adult.placeholder', { ns: 'prompts' }),
    suggestions: Array.isArray(suggestions) ? suggestions : [],
  }
}

export function getKidsPrompts(): DiaryPrompt {
  const suggestions = i18n.t('diary.kids.suggestions', { ns: 'prompts', returnObjects: true }) as string[]
  return {
    placeholder: i18n.t('diary.kids.placeholder', { ns: 'prompts' }),
    suggestions: Array.isArray(suggestions) ? suggestions : [],
  }
}

export function getAdultGratitudePrompts(): string[] {
  const prompts = i18n.t('gratitude.adult', { ns: 'prompts', returnObjects: true }) as string[]
  return Array.isArray(prompts) ? prompts : []
}

export function getKidsGratitudePrompts(): string[] {
  const prompts = i18n.t('gratitude.kids', { ns: 'prompts', returnObjects: true }) as string[]
  return Array.isArray(prompts) ? prompts : []
}

// Static exports for backward compatibility
export const adultPrompts: DiaryPrompt = {
  placeholder: 'Dear diary, today...',
  suggestions: [
    'What made you smile today?',
    'What challenged you?',
    'What are you grateful for?',
    'What did you learn?',
    'How did you take care of yourself?',
  ],
}

export const kidsPrompts: DiaryPrompt = {
  placeholder: 'Today was so cool because...',
  suggestions: [
    'What was the BEST part of today?',
    'Who did you play with?',
    'What made you laugh?',
    'What new thing did you try?',
    'What do you want to do tomorrow?',
  ],
}

// Gratitude prompts
export const adultGratitudePrompts = [
  "I'm grateful for...",
  'Today I appreciated...',
  'Something that made me happy...',
]

export const kidsGratitudePrompts = [
  'I love...',
  'The best thing is...',
  'I feel lucky because...',
]

// Highlight emojis (no translation needed)
export const adultHighlightEmojis = ['🎯', '💪', '🎉', '📚', '🏃', '🍽️', '💼', '❤️', '🌟', '✅']

export const kidsHighlightEmojis = ['⭐', '🎮', '🎨', '⚽', '🎸', '📖', '🍕', '🎂', '🏆', '🌈']
