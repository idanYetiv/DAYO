export interface TagOption {
  id: string
  label: string
  emoji: string
}

export const adultTags: TagOption[] = [
  { id: 'work', label: 'Work', emoji: '\u{1F4BC}' },
  { id: 'family', label: 'Family', emoji: '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}' },
  { id: 'health', label: 'Health', emoji: '\u{1F3C3}' },
  { id: 'growth', label: 'Growth', emoji: '\u{1F4DA}' },
  { id: 'fun', label: 'Fun', emoji: '\u{1F389}' },
  { id: 'travel', label: 'Travel', emoji: '\u{2708}\u{FE0F}' },
]

export const kidsTags: TagOption[] = [
  { id: 'school', label: 'School', emoji: '\u{1F3EB}' },
  { id: 'friends', label: 'Friends', emoji: '\u{1F46B}' },
  { id: 'sports', label: 'Sports', emoji: '\u{26BD}' },
  { id: 'art', label: 'Art', emoji: '\u{1F3A8}' },
  { id: 'games', label: 'Games', emoji: '\u{1F3AE}' },
  { id: 'nature', label: 'Nature', emoji: '\u{1F333}' },
]

export function getTagsForMode(isKidsMode: boolean): TagOption[] {
  return isKidsMode ? kidsTags : adultTags
}

export function getTagById(id: string): TagOption | undefined {
  return [...adultTags, ...kidsTags].find(t => t.id === id)
}
