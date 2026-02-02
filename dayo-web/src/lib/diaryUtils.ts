import type { Database } from './supabase'

type DayEntry = Database['public']['Tables']['days']['Row']

export function countWords(text: string | null): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function computeMoodDistribution(entries: DayEntry[]): Record<string, number> {
  const dist: Record<string, number> = {}
  for (const entry of entries) {
    if (entry.mood) {
      dist[entry.mood] = (dist[entry.mood] || 0) + 1
    }
  }
  return dist
}

export function computeMoodStreak(entries: DayEntry[]): { count: number; mood: string | null } {
  if (entries.length === 0) return { count: 0, mood: null }

  // Entries should be sorted by date descending
  const sorted = [...entries]
    .filter(e => e.mood)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (sorted.length === 0) return { count: 0, mood: null }

  const currentMood = sorted[0].mood
  let count = 1

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].mood === currentMood) {
      count++
    } else {
      break
    }
  }

  return { count, mood: currentMood }
}

export function computeWritingStreak(entries: DayEntry[]): number {
  if (entries.length === 0) return 0

  // Sort by date descending
  const sorted = [...entries]
    .filter(e => e.diary_text && e.diary_text.trim().length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))

  if (sorted.length === 0) return 0

  // Check if the most recent entry is today or yesterday
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const mostRecent = new Date(sorted[0].date + 'T00:00:00')

  const dayDiff = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24))
  if (dayDiff > 1) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date + 'T00:00:00')
    const curr = new Date(sorted[i].date + 'T00:00:00')
    const diff = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export interface DiaryInsights {
  totalEntries: number
  entriesWithMood: number
  entriesWithPhotos: number
  entriesWithGratitude: number
  entriesWithHighlights: number
  totalWords: number
  averageWords: number
  longestEntry: number
  moodDistribution: Record<string, number>
  mostCommonMood: string | null
  moodStreak: { count: number; mood: string | null }
  writingStreak: number
}

export function computeInsights(entries: DayEntry[]): DiaryInsights {
  const withText = entries.filter(e => e.diary_text && e.diary_text.trim())
  const wordCounts = withText.map(e => countWords(e.diary_text))
  const totalWords = wordCounts.reduce((sum, w) => sum + w, 0)
  const moodDist = computeMoodDistribution(entries)

  let mostCommonMood: string | null = null
  let maxCount = 0
  for (const [mood, count] of Object.entries(moodDist)) {
    if (count > maxCount) {
      maxCount = count
      mostCommonMood = mood
    }
  }

  return {
    totalEntries: entries.length,
    entriesWithMood: entries.filter(e => e.mood).length,
    entriesWithPhotos: entries.filter(e => e.photos && e.photos.length > 0).length,
    entriesWithGratitude: entries.filter(e => e.gratitude && e.gratitude.length > 0).length,
    entriesWithHighlights: entries.filter(e => e.highlights && e.highlights.length > 0).length,
    totalWords,
    averageWords: withText.length > 0 ? Math.round(totalWords / withText.length) : 0,
    longestEntry: wordCounts.length > 0 ? Math.max(...wordCounts) : 0,
    moodDistribution: moodDist,
    mostCommonMood,
    moodStreak: computeMoodStreak(entries),
    writingStreak: computeWritingStreak(entries),
  }
}
