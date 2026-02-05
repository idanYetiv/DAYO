import { format } from 'date-fns'

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Format date for display
export function formatExportDate(dateString: string): {
  dayOfWeek: string
  fullDate: string
  shortDate: string
} {
  const date = new Date(dateString)
  return {
    dayOfWeek: format(date, 'EEEE'),
    fullDate: format(date, 'MMMM d, yyyy'),
    shortDate: format(date, 'MMM d'),
  }
}

// Generate filename for export
export function generateFilename(
  date: string,
  format: 'story' | 'post'
): string {
  const dateStr = date.replace(/-/g, '')
  return `dayo-${dateStr}-${format}.png`
}

// Generate filename for diary export
export function generateDiaryFilename(
  date: string,
  format: 'story' | 'post'
): string {
  const dateStr = date.replace(/-/g, '')
  return `dayo-diary-${dateStr}-${format}.png`
}

// Strip HTML tags and collapse whitespace to plain text
export function stripToPlainText(html: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

// Style configurations
export const styleConfigs = {
  playful: {
    name: 'Playful',
    background: 'linear-gradient(135deg, #FEF3C7 0%, #FECACA 50%, #E9D5FF 100%)',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: 'rgba(139, 92, 246, 0.1)',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    accent: '#F97316',
    accentSecondary: '#8B5CF6',
    fontFamily: '"Nunito", "SF Pro Rounded", system-ui, sans-serif',
    borderRadius: '24px',
    shadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
  },
  minimal: {
    name: 'Minimal',
    background: '#FFFFFF',
    cardBg: '#F9FAFB',
    cardBorder: '#E5E7EB',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    accent: '#8B5CF6',
    accentSecondary: '#F97316',
    fontFamily: '"Inter", system-ui, sans-serif',
    borderRadius: '16px',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    name: 'Dark',
    background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
    cardBg: 'rgba(55, 65, 81, 0.8)',
    cardBorder: 'rgba(139, 92, 246, 0.3)',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    accent: '#F97316',
    accentSecondary: '#A78BFA',
    fontFamily: '"Inter", system-ui, sans-serif',
    borderRadius: '20px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
} as const

export type StyleConfig = typeof styleConfigs[keyof typeof styleConfigs]

// Mood emoji mapping
export const moodEmojis: Record<string, string> = {
  amazing: '✨',
  happy: '🥰',
  okay: '😐',
  sad: '😢',
  stressed: '😫',
}

// Get mood label from id
export function getMoodLabel(mood: string): string {
  const labels: Record<string, string> = {
    amazing: 'Amazing',
    happy: 'Happy',
    okay: 'Okay',
    sad: 'Sad',
    stressed: 'Stressed',
  }
  return labels[mood] || mood
}
