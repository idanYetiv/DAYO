import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Plus, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTasks } from '../hooks/useTasks'
import { useDayEntry } from '../hooks/useDiary'
import { supabase } from '../lib/supabase'
import Calendar from '../components/planner/Calendar'
import BottomNavigation from '../components/ui/BottomNavigation'

export default function CalendarPage() {
  const { user } = useAuthStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [daysWithEntries, setDaysWithEntries] = useState<string[]>([])

  const dateStr = format(selectedDate, 'yyyy-MM-dd')

  // Fetch tasks and diary for selected date
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(dateStr)
  const { data: dayEntry, isLoading: diaryLoading } = useDayEntry(dateStr)

  // Fetch all days with entries for the calendar dots
  useEffect(() => {
    async function fetchDaysWithEntries() {
      if (!user?.id) return

      // Get days with diary entries
      const { data: diaryDays } = await supabase
        .from('days')
        .select('date')
        .eq('user_id', user.id)
        .not('diary_text', 'is', null)

      // Get days with tasks
      const { data: taskDays } = await supabase
        .from('tasks')
        .select('date')
        .eq('user_id', user.id)

      const allDays = new Set<string>()
      diaryDays?.forEach((d) => allDays.add(d.date))
      taskDays?.forEach((d) => allDays.add(d.date))

      setDaysWithEntries(Array.from(allDays))
    }

    fetchDaysWithEntries()
  }, [user?.id])

  const isLoading = tasksLoading || diaryLoading
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  // Mood emoji mapping
  const moodEmojis: Record<string, string> = {
    amazing: '✨',
    happy: '🥰',
    okay: '😐',
    sad: '😢',
    stressed: '😫',
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-dayo-gray-100">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/today"
              className="p-2 -ml-2 text-dayo-gray-600 hover:text-dayo-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-dayo-gray-900">Calendar</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Calendar */}
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          daysWithEntries={daysWithEntries}
        />

        {/* Selected Day Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                {isToday ? 'Today' : format(selectedDate, 'EEEE')}
              </h3>
              <p className="text-sm text-gray-500">
                {format(selectedDate, 'MMMM d, yyyy')}
              </p>
            </div>
            {dayEntry?.mood && (
              <span className="text-2xl">
                {moodEmojis[dayEntry.mood] || dayEntry.mood}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-dayo-orange animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tasks */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Tasks ({tasks.filter((t) => t.completed).length}/{tasks.length})
                </h4>
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No tasks</p>
                ) : (
                  <ul className="space-y-1">
                    {tasks.slice(0, 5).map((task) => (
                      <li
                        key={task.id}
                        className={`text-sm flex items-center gap-2 ${
                          task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                        }`}
                      >
                        <span>{task.completed ? '✓' : '○'}</span>
                        {task.title}
                      </li>
                    ))}
                    {tasks.length > 5 && (
                      <li className="text-sm text-gray-400">
                        +{tasks.length - 5} more
                      </li>
                    )}
                  </ul>
                )}
              </div>

              {/* Diary Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Diary</h4>
                {dayEntry?.diary_text ? (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {dayEntry.diary_text}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">No diary entry</p>
                )}
              </div>

              {/* Action Button */}
              <Link
                to="/today"
                state={{ date: dateStr }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-dayo-orange text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {isToday ? 'View Today' : 'View This Day'}
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
