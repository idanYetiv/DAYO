import i18n from '../i18n'

export interface TagOption {
  id: string
  label: string
  labelKey: string
  emoji: string
}

// Helper to get translated tags
export function getTranslatedAdultTags(): TagOption[] {
  return [
    { id: 'work', label: i18n.t('tags.adult.work', { ns: 'common' }), labelKey: 'tags.adult.work', emoji: '\u{1F4BC}' },
    { id: 'family', label: i18n.t('tags.adult.family', { ns: 'common' }), labelKey: 'tags.adult.family', emoji: '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}' },
    { id: 'health', label: i18n.t('tags.adult.health', { ns: 'common' }), labelKey: 'tags.adult.health', emoji: '\u{1F3C3}' },
    { id: 'growth', label: i18n.t('tags.adult.growth', { ns: 'common' }), labelKey: 'tags.adult.growth', emoji: '\u{1F4DA}' },
    { id: 'fun', label: i18n.t('tags.adult.fun', { ns: 'common' }), labelKey: 'tags.adult.fun', emoji: '\u{1F389}' },
    { id: 'travel', label: i18n.t('tags.adult.travel', { ns: 'common' }), labelKey: 'tags.adult.travel', emoji: '\u{2708}\u{FE0F}' },
  ]
}

export function getTranslatedKidsTags(): TagOption[] {
  return [
    { id: 'school', label: i18n.t('tags.kids.school', { ns: 'common' }), labelKey: 'tags.kids.school', emoji: '\u{1F3EB}' },
    { id: 'friends', label: i18n.t('tags.kids.friends', { ns: 'common' }), labelKey: 'tags.kids.friends', emoji: '\u{1F46B}' },
    { id: 'sports', label: i18n.t('tags.kids.sports', { ns: 'common' }), labelKey: 'tags.kids.sports', emoji: '\u{26BD}' },
    { id: 'art', label: i18n.t('tags.kids.art', { ns: 'common' }), labelKey: 'tags.kids.art', emoji: '\u{1F3A8}' },
    { id: 'games', label: i18n.t('tags.kids.games', { ns: 'common' }), labelKey: 'tags.kids.games', emoji: '\u{1F3AE}' },
    { id: 'nature', label: i18n.t('tags.kids.nature', { ns: 'common' }), labelKey: 'tags.kids.nature', emoji: '\u{1F333}' },
  ]
}

// Static exports for backward compatibility
export const adultTags: TagOption[] = [
  { id: 'work', label: 'Work', labelKey: 'tags.adult.work', emoji: '\u{1F4BC}' },
  { id: 'family', label: 'Family', labelKey: 'tags.adult.family', emoji: '\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}' },
  { id: 'health', label: 'Health', labelKey: 'tags.adult.health', emoji: '\u{1F3C3}' },
  { id: 'growth', label: 'Growth', labelKey: 'tags.adult.growth', emoji: '\u{1F4DA}' },
  { id: 'fun', label: 'Fun', labelKey: 'tags.adult.fun', emoji: '\u{1F389}' },
  { id: 'travel', label: 'Travel', labelKey: 'tags.adult.travel', emoji: '\u{2708}\u{FE0F}' },
]

export const kidsTags: TagOption[] = [
  { id: 'school', label: 'School', labelKey: 'tags.kids.school', emoji: '\u{1F3EB}' },
  { id: 'friends', label: 'Friends', labelKey: 'tags.kids.friends', emoji: '\u{1F46B}' },
  { id: 'sports', label: 'Sports', labelKey: 'tags.kids.sports', emoji: '\u{26BD}' },
  { id: 'art', label: 'Art', labelKey: 'tags.kids.art', emoji: '\u{1F3A8}' },
  { id: 'games', label: 'Games', labelKey: 'tags.kids.games', emoji: '\u{1F3AE}' },
  { id: 'nature', label: 'Nature', labelKey: 'tags.kids.nature', emoji: '\u{1F333}' },
]

export function getTagsForMode(isKidsMode: boolean): TagOption[] {
  return isKidsMode ? getTranslatedKidsTags() : getTranslatedAdultTags()
}

export function getTagById(id: string): TagOption | undefined {
  return [...getTranslatedAdultTags(), ...getTranslatedKidsTags()].find(t => t.id === id)
}
