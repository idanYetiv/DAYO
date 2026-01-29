export interface DiaryPrompt {
  placeholder: string
  suggestions: string[]
}

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

// Highlight emojis
export const adultHighlightEmojis = ['🎯', '💪', '🎉', '📚', '🏃', '🍽️', '💼', '❤️', '🌟', '✅']

export const kidsHighlightEmojis = ['⭐', '🎮', '🎨', '⚽', '🎸', '📖', '🍕', '🎂', '🏆', '🌈']
