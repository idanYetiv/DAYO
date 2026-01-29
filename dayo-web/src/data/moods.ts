export interface MoodOption {
  id: string
  emoji: string
  label: string
  color?: string
}

export const adultMoods: MoodOption[] = [
  { id: 'amazing', emoji: '✨', label: 'Amazing' },
  { id: 'happy', emoji: '🥰', label: 'Happy' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'stressed', emoji: '😫', label: 'Stressed' },
]

export const kidsMoods: MoodOption[] = [
  { id: 'amazing', emoji: '🦁', label: 'ROAR Amazing!', color: '#FCD34D' },
  { id: 'happy', emoji: '🐶', label: 'Puppy Happy!', color: '#FB923C' },
  { id: 'okay', emoji: '🐢', label: 'Turtle Fine', color: '#34D399' },
  { id: 'sad', emoji: '🐰', label: 'Bunny Sad', color: '#60A5FA' },
  { id: 'tired', emoji: '🐻', label: 'Bear Tired', color: '#A78BFA' },
]

// Mood ID to emoji mapping for display
export const adultMoodEmojis: Record<string, string> = {
  amazing: '✨',
  happy: '🥰',
  okay: '😐',
  sad: '😢',
  stressed: '😫',
}

export const kidsMoodEmojis: Record<string, string> = {
  amazing: '🦁',
  happy: '🐶',
  okay: '🐢',
  sad: '🐰',
  tired: '🐻',
  // Map stressed to tired for backwards compatibility
  stressed: '🐻',
}
