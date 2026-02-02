import { format } from 'date-fns'
import { BookOpen, Loader2 } from 'lucide-react'
import type { Database } from '../../lib/supabase'

type DayEntry = Database['public']['Tables']['days']['Row']

interface SearchResultsListProps {
  results: DayEntry[] | undefined
  isLoading: boolean
  searchQuery: string
  moodEmojis: Record<string, string>
  onEntryClick: (entry: DayEntry) => void
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim() || !text) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

function countWords(text: string | null): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

export default function SearchResultsList({
  results,
  isLoading,
  searchQuery,
  moodEmojis,
  onEntryClick,
}: SearchResultsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-dayo-purple animate-spin" />
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-6 text-center">
        <BookOpen className="w-10 h-10 text-dayo-gray-300 mx-auto mb-3" />
        <p className="text-dayo-gray-500 text-sm">No entries match your search</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {results.map((entry) => {
        const words = countWords(entry.diary_text)
        return (
          <button
            key={entry.id}
            onClick={() => onEntryClick(entry)}
            className="w-full text-left bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 hover:border-dayo-purple/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {entry.mood ? moodEmojis[entry.mood] || entry.mood : '\u{1F4DD}'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-dayo-gray-400 mb-1">
                  {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-dayo-gray-700 text-sm line-clamp-3">
                  {searchQuery
                    ? highlightText(entry.diary_text || 'No diary text', searchQuery)
                    : entry.diary_text || 'No diary text'}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {entry.photos && entry.photos.length > 0 && (
                    <span className="text-xs text-dayo-gray-400">
                      {'\u{1F4F7}'} {entry.photos.length} photo{entry.photos.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-1">
                      {entry.tags.map(tag => (
                        <span key={tag} className="text-xs bg-dayo-gray-100 text-dayo-gray-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {words > 0 && (
                    <span className="text-xs text-dayo-gray-400 ml-auto">
                      {words} {words === 1 ? 'word' : 'words'}
                    </span>
                  )}
                  {entry.bookmarked && (
                    <span className="text-xs">{'\u{2B50}'}</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
