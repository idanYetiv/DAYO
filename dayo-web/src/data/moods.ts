import i18n from '../i18n'

export interface MoodOption {
  id: string
  emoji: string
  label: string
  labelKey: string
  color?: string
}

// Helper to get translated moods
export function getAdultMoods(): MoodOption[] {
  return [
    { id: 'amazing', emoji: '✨', label: i18n.t('adult.amazing', { ns: 'moods' }), labelKey: 'adult.amazing' },
    { id: 'happy', emoji: '🥰', label: i18n.t('adult.happy', { ns: 'moods' }), labelKey: 'adult.happy' },
    { id: 'okay', emoji: '😐', label: i18n.t('adult.okay', { ns: 'moods' }), labelKey: 'adult.okay' },
    { id: 'sad', emoji: '😢', label: i18n.t('adult.sad', { ns: 'moods' }), labelKey: 'adult.sad' },
    { id: 'stressed', emoji: '😫', label: i18n.t('adult.stressed', { ns: 'moods' }), labelKey: 'adult.stressed' },
  ]
}

export function getKidsMoods(): MoodOption[] {
  return [
    { id: 'amazing', emoji: '🦁', label: i18n.t('kids.amazing', { ns: 'moods' }), labelKey: 'kids.amazing', color: '#FCD34D' },
    { id: 'happy', emoji: '🐶', label: i18n.t('kids.happy', { ns: 'moods' }), labelKey: 'kids.happy', color: '#FB923C' },
    { id: 'okay', emoji: '🐢', label: i18n.t('kids.okay', { ns: 'moods' }), labelKey: 'kids.okay', color: '#34D399' },
    { id: 'sad', emoji: '🐰', label: i18n.t('kids.sad', { ns: 'moods' }), labelKey: 'kids.sad', color: '#60A5FA' },
    { id: 'tired', emoji: '🐻', label: i18n.t('kids.tired', { ns: 'moods' }), labelKey: 'kids.tired', color: '#A78BFA' },
  ]
}

// Static arrays for backward compatibility (will use English by default)
export const adultMoods: MoodOption[] = [
  { id: 'amazing', emoji: '✨', label: 'Amazing', labelKey: 'adult.amazing' },
  { id: 'happy', emoji: '🥰', label: 'Happy', labelKey: 'adult.happy' },
  { id: 'okay', emoji: '😐', label: 'Okay', labelKey: 'adult.okay' },
  { id: 'sad', emoji: '😢', label: 'Sad', labelKey: 'adult.sad' },
  { id: 'stressed', emoji: '😫', label: 'Stressed', labelKey: 'adult.stressed' },
]

export const kidsMoods: MoodOption[] = [
  { id: 'amazing', emoji: '🦁', label: 'ROAR Amazing!', labelKey: 'kids.amazing', color: '#FCD34D' },
  { id: 'happy', emoji: '🐶', label: 'Puppy Happy!', labelKey: 'kids.happy', color: '#FB923C' },
  { id: 'okay', emoji: '🐢', label: 'Turtle Fine', labelKey: 'kids.okay', color: '#34D399' },
  { id: 'sad', emoji: '🐰', label: 'Bunny Sad', labelKey: 'kids.sad', color: '#60A5FA' },
  { id: 'tired', emoji: '🐻', label: 'Bear Tired', labelKey: 'kids.tired', color: '#A78BFA' },
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
