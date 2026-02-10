import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Search, BookOpen, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import BottomNavigation from '../components/ui/BottomNavigation'
import DiaryEntryModal from '../components/diary/DiaryEntryModal'
import TemplateSelector from '../components/diary/TemplateSelector'
import DiarySearchPanel from '../components/diary/DiarySearchPanel'
import SearchResultsList from '../components/diary/SearchResultsList'
import MoodInsightsPanel from '../components/diary/MoodInsightsPanel'
import {
  useDayEntry,
  useUpsertDayEntry,
  useUpdateGratitude,
  useUpdateHighlights,
  type DiaryHighlight,
} from '../hooks/useDiary'
import { useDiarySearch, defaultFilters, hasActiveFilters, type DiarySearchFilters } from '../hooks/useDiarySearch'
import { useContentForMode } from '../hooks/useContentForMode'
import { useToggleBookmark, useUpdateTags } from '../hooks/useDiaryTags'
import { diaryToast } from '../lib/toast'
import { getMoodColors, getMoodCalendarBg } from '../lib/moodColors'
import { countWords } from '../lib/diaryUtils'
import BookmarkButton from '../components/diary/BookmarkButton'
import ThemedHeader from '../components/ui/ThemedHeader'
import type { DiaryTemplate } from '../data/templates'

interface DiaryEntry {
  id: string
  date: string
  mood: string | null
  diary_text: string | null
  photos: string[]
  gratitude: string[]
  highlights: DiaryHighlight[]
  tags: string[]
  bookmarked: boolean
  template_id: string | null
}

// Hook to fetch all diary entries for a month
function useMonthEntries(year: number, month: number) {
  return useQuery({
    queryKey: ['monthEntries', year, month],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const startDate = format(new Date(year, month, 1), 'yyyy-MM-dd')
      const endDate = format(new Date(year, month + 1, 0), 'yyyy-MM-dd')

      const { data, error } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false })

      if (error) throw error
      return data as DiaryEntry[]
    },
  })
}

// Hook to fetch recent entries
function useRecentEntries(limit: number = 10) {
  return useQuery({
    queryKey: ['recentEntries', limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('days')
        .select('*')
        .eq('user_id', user.id)
        .not('diary_text', 'is', null)
        .order('date', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data as DiaryEntry[]
    },
  })
}

const moodEmojis: Record<string, string> = {
  amazing: '✨',
  happy: '🥰',
  okay: '😐',
  sad: '😢',
  stressed: '😫',
}

export default function DiaryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'insights'>('calendar')
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState<Date>(new Date())
  const [showSearch, setShowSearch] = useState(false)
  const [searchFilters, setSearchFilters] = useState<DiarySearchFilters>(defaultFilters)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week for the first day (0 = Sunday)
  const startDay = monthStart.getDay()
  const emptyDays = Array(startDay).fill(null)

  // Fetch data
  const { data: monthEntries, isLoading: monthLoading } = useMonthEntries(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  )
  const { data: recentEntries, isLoading: recentLoading } = useRecentEntries(10)

  // Fetch selected date entry
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  const { data: selectedEntry } = useDayEntry(selectedDateStr)

  // Fetch edit date entry (for modal)
  const editDateStr = format(editDate, 'yyyy-MM-dd')
  const { data: editEntry } = useDayEntry(editDateStr)

  // Search
  const isSearchActive = showSearch && hasActiveFilters(searchFilters)
  const { data: searchResults, isLoading: searchLoading } = useDiarySearch(searchFilters, isSearchActive)
  const { moodEmojis: contentMoodEmojis } = useContentForMode()

  // Mutations
  const upsertDayEntry = useUpsertDayEntry()
  const updateGratitude = useUpdateGratitude()
  const updateHighlights = useUpdateHighlights()
  const updateTags = useUpdateTags()
  const toggleBookmark = useToggleBookmark()

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentMonth(newMonth)
  }

  const getEntryForDate = (date: Date): DiaryEntry | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return monthEntries?.find(entry => entry.date === dateStr)
  }

  const handleNewEntry = () => {
    setEditDate(new Date())
    setSelectedTemplateId(null)
    setShowTemplateSelector(true)
  }

  const handleTemplateSelect = (template: DiaryTemplate) => {
    setSelectedTemplateId(template.id)
    setShowTemplateSelector(false)
    setShowDiaryModal(true)
  }

  const handleChangeTemplate = () => {
    setShowDiaryModal(false)
    setShowTemplateSelector(true)
  }

  const handleDayClick = (day: Date) => {
    setSelectedDate(day)
  }

  const handleDayDoubleClick = (day: Date) => {
    setEditDate(day)
    setShowDiaryModal(true)
  }

  const handleWriteEntry = (date: Date) => {
    setEditDate(date)
    setShowDiaryModal(true)
  }

  const handleEntryClick = (entry: DiaryEntry) => {
    const date = new Date(entry.date)
    setEditDate(date)
    setSelectedTemplateId(entry.template_id || null)
    setShowDiaryModal(true)
  }

  const handleSaveDiary = (data: {
    mood: string
    text: string
    gratitude: string[]
    highlights: DiaryHighlight[]
    tags: string[]
    templateId?: string | null
  }) => {
    const dateStr = format(editDate, 'yyyy-MM-dd')

    // Save diary text and mood
    upsertDayEntry.mutate(
      {
        date: dateStr,
        mood: data.mood,
        diaryText: data.text,
        templateId: data.templateId,
      },
      {
        onSuccess: () => {
          diaryToast.saved()
        },
        onError: () => diaryToast.error(),
      }
    )

    // Save gratitude if any
    if (data.gratitude.length > 0) {
      updateGratitude.mutate({ date: dateStr, gratitude: data.gratitude })
    }

    // Save highlights if any
    if (data.highlights.length > 0) {
      updateHighlights.mutate({ date: dateStr, highlights: data.highlights })
    }

    // Save tags
    updateTags.mutate({ date: dateStr, tags: data.tags })

    setShowDiaryModal(false)
  }

  const handleToggleBookmark = (entry: DiaryEntry, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleBookmark.mutate({ date: entry.date, bookmarked: !entry.bookmarked })
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      <ThemedHeader
        title="Diary"
        showLogo={false}
        rightContent={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${
                showSearch ? 'text-dayo-purple bg-dayo-purple/10' : 'themed-header-icon'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={handleNewEntry}
              className="flex items-center gap-1.5 bg-dayo-gradient text-white text-sm font-medium px-4 py-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        }
      />
      {/* View Toggle */}
      <div className="themed-header px-4 pb-3 -mt-1">
        <div className="max-w-lg mx-auto">
          <div className="flex view-toggle-bar rounded-xl p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-dayo-gray-900 shadow-sm'
                  : 'text-dayo-gray-500'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-dayo-gray-900 shadow-sm'
                  : 'text-dayo-gray-500'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('insights')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                viewMode === 'insights'
                  ? 'bg-white text-dayo-gray-900 shadow-sm'
                  : 'text-dayo-gray-500'
              }`}
            >
              Insights
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Search Panel */}
        {showSearch && (
          <div className="mb-6">
            <DiarySearchPanel
              filters={searchFilters}
              onChange={setSearchFilters}
              onClear={() => setSearchFilters(defaultFilters)}
              resultCount={isSearchActive ? (searchResults?.length ?? null) : null}
            />
          </div>
        )}

        {/* Search Results */}
        {isSearchActive ? (
          <SearchResultsList
            results={searchResults}
            isLoading={searchLoading}
            searchQuery={searchFilters.query}
            moodEmojis={contentMoodEmojis}
            onEntryClick={(entry) => {
              const date = new Date(entry.date)
              setEditDate(date)
              setSelectedTemplateId(entry.template_id || null)
              setShowDiaryModal(true)
            }}
          />
        ) : viewMode === 'calendar' ? (
          <>
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 mb-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-dayo-gray-400 hover:text-dayo-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-dayo-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-dayo-gray-400 hover:text-dayo-gray-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-dayo-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              {monthLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-dayo-purple animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {emptyDays.map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                  ))}
                  {days.map((day) => {
                    const entry = getEntryForDate(day)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isTodayDate = isToday(day)
                    const hasEntry = entry && (entry.mood || entry.diary_text)

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleDayClick(day)}
                        onDoubleClick={() => handleDayDoubleClick(day)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                          isSelected
                            ? 'bg-dayo-gradient text-white'
                            : isTodayDate
                            ? 'bg-dayo-purple/10 text-dayo-purple font-semibold'
                            : hasEntry
                            ? getMoodCalendarBg(entry?.mood || null)
                            : 'hover:bg-dayo-gray-50'
                        }`}
                      >
                        <span className={!isSameMonth(day, currentMonth) ? 'text-dayo-gray-300' : ''}>
                          {format(day, 'd')}
                        </span>
                        {entry?.mood && (
                          <span className="text-xs mt-0.5">
                            {moodEmojis[entry.mood] || entry.mood}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              <p className="text-xs text-dayo-gray-400 text-center mt-4">
                Tap to select, double-tap to edit
              </p>
            </div>

            {/* Selected Date Entry or Recent Entries */}
            {selectedDate ? (
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4">
                <h3 className="font-semibold text-dayo-gray-900 mb-3">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                {selectedEntry && (selectedEntry.mood || selectedEntry.diary_text) ? (
                  <button
                    onClick={() => handleWriteEntry(selectedDate)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {selectedEntry.mood ? moodEmojis[selectedEntry.mood] || selectedEntry.mood : '📝'}
                      </span>
                      <div className="flex-1">
                        <p className="text-dayo-gray-600 text-sm line-clamp-3">
                          {selectedEntry.diary_text || 'No diary text'}
                        </p>
                        {selectedEntry.photos && selectedEntry.photos.length > 0 && (
                          <p className="text-xs text-dayo-gray-400 mt-1">
                            📷 {selectedEntry.photos.length} photo(s)
                          </p>
                        )}
                        {selectedEntry.gratitude && selectedEntry.gratitude.length > 0 && (
                          <p className="text-xs text-dayo-gray-400 mt-1">
                            🙏 {selectedEntry.gratitude.length} gratitude item(s)
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-dayo-purple mt-3">Tap to edit</p>
                  </button>
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="w-10 h-10 text-dayo-gray-300 mx-auto mb-3" />
                    <p className="text-dayo-gray-500 text-sm mb-3">No entry for this day</p>
                    <button
                      onClick={() => handleWriteEntry(selectedDate)}
                      className="text-sm text-dayo-purple font-medium hover:underline"
                    >
                      Write an entry
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-dayo-gray-900 mb-3">Recent Entries</h3>
                {recentLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-dayo-purple animate-spin" />
                  </div>
                ) : recentEntries && recentEntries.length > 0 ? (
                  <div className="space-y-3">
                    {recentEntries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => handleEntryClick(entry)}
                        className="w-full text-left bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 hover:border-dayo-purple/30 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">
                            {entry.mood ? moodEmojis[entry.mood] || entry.mood : '📝'}
                          </span>
                          <div className="flex-1">
                            <p className="text-xs text-dayo-gray-400 mb-1">
                              {format(new Date(entry.date), 'EEEE, MMMM d')}
                            </p>
                            <p className="text-dayo-gray-700 text-sm line-clamp-2">
                              {entry.diary_text || 'No diary text'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-6 text-center">
                    <BookOpen className="w-10 h-10 text-dayo-gray-300 mx-auto mb-3" />
                    <p className="text-dayo-gray-500 text-sm mb-3">No diary entries yet</p>
                    <button
                      onClick={handleNewEntry}
                      className="text-sm text-dayo-purple font-medium hover:underline"
                    >
                      Write your first entry
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : viewMode === 'timeline' ? (
          /* Timeline View */
          <div>
            {recentLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-dayo-purple animate-spin" />
              </div>
            ) : recentEntries && recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry) => {
                  const colors = getMoodColors(entry.mood)
                  const words = countWords(entry.diary_text)
                  return (
                    <div
                      key={entry.id}
                      className={`rounded-2xl shadow-sm border p-4 transition-colors ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleEntryClick(entry)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <span className="text-3xl mb-1">
                                {entry.mood ? moodEmojis[entry.mood] || entry.mood : '\u{1F4DD}'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-dayo-gray-900">
                                {format(new Date(entry.date), 'EEEE')}
                              </p>
                              <p className="text-xs text-dayo-gray-400 mb-2">
                                {format(new Date(entry.date), 'MMMM d, yyyy')}
                              </p>
                              <p className="text-dayo-gray-700 text-sm line-clamp-3">
                                {entry.diary_text || 'No diary text'}
                              </p>
                              {entry.photos && entry.photos.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {entry.photos.slice(0, 3).map((photo, i) => (
                                    <img
                                      key={i}
                                      src={photo}
                                      alt=""
                                      className="w-12 h-12 object-cover rounded-lg"
                                    />
                                  ))}
                                  {entry.photos.length > 3 && (
                                    <div className="w-12 h-12 bg-dayo-gray-100 rounded-lg flex items-center justify-center text-xs text-dayo-gray-500">
                                      +{entry.photos.length - 3}
                                    </div>
                                  )}
                                </div>
                              )}
                              {/* Tags + Word Count */}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {entry.tags && entry.tags.length > 0 && entry.tags.map(tag => (
                                  <span key={tag} className="text-xs bg-white/70 text-dayo-gray-600 px-2 py-0.5 rounded-full border border-dayo-gray-200">
                                    {tag}
                                  </span>
                                ))}
                                {words > 0 && (
                                  <span className="text-xs text-dayo-gray-400 ml-auto">
                                    {words} {words === 1 ? 'word' : 'words'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                        <BookmarkButton
                          bookmarked={entry.bookmarked}
                          onClick={(e) => handleToggleBookmark(entry, e)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-6 text-center">
                <BookOpen className="w-10 h-10 text-dayo-gray-300 mx-auto mb-3" />
                <p className="text-dayo-gray-500 text-sm mb-3">No diary entries yet</p>
                <button
                  onClick={handleNewEntry}
                  className="text-sm text-dayo-purple font-medium hover:underline"
                >
                  Write your first entry
                </button>
              </div>
            )}
          </div>
        ) : viewMode === 'insights' ? (
          <MoodInsightsPanel />
        ) : null}
      </main>

      <BottomNavigation />

      {/* Template Selector */}
      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
      />

      {/* Diary Entry Modal */}
      <DiaryEntryModal
        isOpen={showDiaryModal}
        onClose={() => setShowDiaryModal(false)}
        date={editDate}
        initialMood={editEntry?.mood || ''}
        initialText={editEntry?.diary_text || ''}
        initialPhotos={editEntry?.photos || []}
        initialGratitude={editEntry?.gratitude || []}
        initialHighlights={editEntry?.highlights || []}
        initialTags={editEntry?.tags || []}
        templateId={selectedTemplateId}
        onSave={handleSaveDiary}
        onChangeTemplate={handleChangeTemplate}
        isSaving={upsertDayEntry.isPending}
      />
    </div>
  )
}
