import { useState, useEffect } from 'react'
import { X, Camera, Heart, Sparkles, Star } from 'lucide-react'
import { useContentForMode } from '../../hooks/useContentForMode'
import { useProfileMode } from '../../hooks/useProfileMode'
import { getTagsForMode } from '../../data/tags'
import type { DiarySearchFilters } from '../../hooks/useDiarySearch'

interface DiarySearchPanelProps {
  filters: DiarySearchFilters
  onChange: (filters: DiarySearchFilters) => void
  onClear: () => void
  resultCount: number | null
}

export default function DiarySearchPanel({
  filters,
  onChange,
  onClear,
  resultCount,
}: DiarySearchPanelProps) {
  const { moods } = useContentForMode()
  const { isKidsMode } = useProfileMode()
  const [queryInput, setQueryInput] = useState(filters.query)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (queryInput !== filters.query) {
        onChange({ ...filters, query: queryInput })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [queryInput])

  // Sync external filter changes
  useEffect(() => {
    setQueryInput(filters.query)
  }, [filters.query])

  const toggleMood = (moodId: string) => {
    onChange({ ...filters, mood: filters.mood === moodId ? null : moodId })
  }

  const toggleContentFilter = (key: 'hasPhotos' | 'hasGratitude' | 'hasHighlights' | 'bookmarked') => {
    onChange({ ...filters, [key]: !filters[key] })
  }

  return (
    <div className={`rounded-2xl border p-4 space-y-4 ${
      isKidsMode
        ? 'bg-white border-dayo-kids-yellow/50'
        : 'bg-white border-dayo-gray-100'
    }`}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          placeholder="Search diary entries..."
          className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
            isKidsMode
              ? 'border-dayo-kids-yellow/50 focus:border-dayo-kids-orange'
              : 'border-dayo-gray-200 focus:border-dayo-purple/50'
          }`}
        />
        {queryInput && (
          <button
            onClick={() => { setQueryInput(''); onChange({ ...filters, query: '' }) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dayo-gray-400 hover:text-dayo-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mood Filter */}
      <div>
        <p className="text-xs font-medium text-dayo-gray-500 mb-2">Mood</p>
        <div className="flex gap-1.5 flex-wrap">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => toggleMood(mood.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                filters.mood === mood.id
                  ? isKidsMode
                    ? 'bg-kids-gradient text-white'
                    : 'bg-dayo-gradient text-white'
                  : 'bg-dayo-gray-100 text-dayo-gray-600 hover:bg-dayo-gray-200'
              }`}
            >
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <p className="text-xs font-medium text-dayo-gray-500 mb-2">Date Range</p>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || null })}
            className="flex-1 px-3 py-1.5 rounded-lg border border-dayo-gray-200 text-sm outline-none focus:border-dayo-purple/50"
          />
          <span className="text-dayo-gray-400 text-sm">{'\u2192'}</span>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value || null })}
            className="flex-1 px-3 py-1.5 rounded-lg border border-dayo-gray-200 text-sm outline-none focus:border-dayo-purple/50"
          />
        </div>
      </div>

      {/* Content Filters */}
      <div>
        <p className="text-xs font-medium text-dayo-gray-500 mb-2">Filter</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => toggleContentFilter('hasPhotos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filters.hasPhotos
                ? 'bg-blue-500 text-white'
                : 'bg-dayo-gray-100 text-dayo-gray-600 hover:bg-dayo-gray-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Photos
          </button>
          <button
            onClick={() => toggleContentFilter('hasGratitude')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filters.hasGratitude
                ? 'bg-orange-500 text-white'
                : 'bg-dayo-gray-100 text-dayo-gray-600 hover:bg-dayo-gray-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Gratitude
          </button>
          <button
            onClick={() => toggleContentFilter('hasHighlights')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filters.hasHighlights
                ? 'bg-purple-500 text-white'
                : 'bg-dayo-gray-100 text-dayo-gray-600 hover:bg-dayo-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Highlights
          </button>
          <button
            onClick={() => toggleContentFilter('bookmarked')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filters.bookmarked
                ? 'bg-amber-500 text-white'
                : 'bg-dayo-gray-100 text-dayo-gray-600 hover:bg-dayo-gray-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Bookmarked
          </button>
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <p className="text-xs font-medium text-dayo-gray-500 mb-2">Tags</p>
        <div className="flex gap-1.5 flex-wrap">
          {getTagsForMode(isKidsMode).map((tag) => {
            const isActive = filters.tags.includes(tag.id)
            return (
              <button
                key={tag.id}
                onClick={() => {
                  const newTags = isActive
                    ? filters.tags.filter(t => t !== tag.id)
                    : [...filters.tags, tag.id]
                  onChange({ ...filters, tags: newTags })
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-dayo-gray-100 text-dayo-gray-600 hover:bg-dayo-gray-200'
                }`}
              >
                {tag.emoji} {tag.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Result count and clear */}
      <div className="flex items-center justify-between pt-2 border-t border-dayo-gray-100">
        {resultCount !== null ? (
          <p className="text-xs text-dayo-gray-500">
            {resultCount} {resultCount === 1 ? 'result' : 'results'} found
          </p>
        ) : (
          <div />
        )}
        <button
          onClick={onClear}
          className="text-xs font-medium text-dayo-gray-500 hover:text-dayo-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
