import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Search, BookOpen } from 'lucide-react'
import BottomNavigation from '../components/ui/BottomNavigation'

interface DiaryEntry {
  id: string
  date: string
  mood: string
  preview: string
  hasMedia: boolean
}

// Mock data for now
const mockEntries: DiaryEntry[] = [
  { id: '1', date: '2026-01-12', mood: '😊', preview: 'Had a great day working on DAYO...', hasMedia: false },
  { id: '2', date: '2026-01-11', mood: '😌', preview: 'Peaceful Sunday morning...', hasMedia: true },
  { id: '3', date: '2026-01-10', mood: '😊', preview: 'Finally finished the project!', hasMedia: false },
  { id: '4', date: '2026-01-08', mood: '😐', preview: 'Regular day at work...', hasMedia: false },
]

export default function DiaryPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar')

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week for the first day (0 = Sunday)
  const startDay = monthStart.getDay()
  const emptyDays = Array(startDay).fill(null)

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentMonth(newMonth)
  }

  const getEntryForDate = (date: Date) => {
    return mockEntries.find(entry => entry.date === format(date, 'yyyy-MM-dd'))
  }

  const recentEntries = mockEntries.slice(0, 5)

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-dayo-gray-100">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-dayo-gray-900">Diary</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 text-dayo-gray-400 hover:text-dayo-gray-600 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-1.5 bg-dayo-gradient text-white text-sm font-medium px-4 py-2 rounded-xl">
                <Plus className="w-4 h-4" />
                New Entry
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex bg-dayo-gray-100 rounded-xl p-1">
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
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {viewMode === 'calendar' ? (
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
              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                {days.map((day) => {
                  const entry = getEntryForDate(day)
                  const isSelected = selectedDate && isSameDay(day, selectedDate)
                  const isTodayDate = isToday(day)

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                        isSelected
                          ? 'bg-dayo-gradient text-white'
                          : isTodayDate
                          ? 'bg-dayo-purple/10 text-dayo-purple font-semibold'
                          : 'hover:bg-dayo-gray-50'
                      }`}
                    >
                      <span className={!isSameMonth(day, currentMonth) ? 'text-dayo-gray-300' : ''}>
                        {format(day, 'd')}
                      </span>
                      {entry && (
                        <span className="text-xs mt-0.5">{entry.mood}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Date Entry or Recent Entries */}
            {selectedDate ? (
              <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4">
                <h3 className="font-semibold text-dayo-gray-900 mb-3">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                {getEntryForDate(selectedDate) ? (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getEntryForDate(selectedDate)?.mood}</span>
                    <p className="text-dayo-gray-600 text-sm flex-1">
                      {getEntryForDate(selectedDate)?.preview}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="w-10 h-10 text-dayo-gray-300 mx-auto mb-3" />
                    <p className="text-dayo-gray-500 text-sm mb-3">No entry for this day</p>
                    <button className="text-sm text-dayo-purple font-medium">
                      Write an entry
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-dayo-gray-900 mb-3">Recent Entries</h3>
                <div className="space-y-3">
                  {recentEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{entry.mood}</span>
                        <div className="flex-1">
                          <p className="text-xs text-dayo-gray-400 mb-1">
                            {format(new Date(entry.date), 'EEEE, MMMM d')}
                          </p>
                          <p className="text-dayo-gray-700 text-sm line-clamp-2">
                            {entry.preview}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Timeline View */
          <div className="space-y-4">
            {mockEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">{entry.mood}</span>
                    <div className="w-0.5 h-full bg-dayo-gray-200 mt-2" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-dayo-gray-900">
                      {format(new Date(entry.date), 'EEEE')}
                    </p>
                    <p className="text-xs text-dayo-gray-400 mb-2">
                      {format(new Date(entry.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-dayo-gray-700 text-sm">
                      {entry.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}
