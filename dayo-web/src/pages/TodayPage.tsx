import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight, Moon, Sun, Flame, Share2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks'
import { useDayEntry, useUpsertDayEntry, useUpdateGratitude, useUpdateHighlights, type DiaryHighlight } from '../hooks/useDiary'
import { useUserStats, useUpdateStreak } from '../hooks/useUserStats'
import { useProfileMode } from '../hooks/useProfileMode'
import { useContentForMode, useGreeting } from '../hooks/useContentForMode'
import { taskToast, diaryToast } from '../lib/toast'
import { useHaptics } from '../hooks/useHaptics'
import QuoteCard from '../components/ui/QuoteCard'
import StatsRow from '../components/ui/StatsRow'
import TasksSection from '../components/planner/TasksSection'
import HabitsSection from '../components/planner/HabitsSection'
import QuickAccessCards from '../components/ui/QuickAccessCards'
import BottomNavigation from '../components/ui/BottomNavigation'
import DiaryEntryModal from '../components/diary/DiaryEntryModal'
import DiaryPreviewCard from '../components/diary/DiaryPreviewCard'
import ExportModal from '../components/export/ExportModal'
import DiaryExportModal from '../components/export/DiaryExportModal'
import { stripToPlainText } from '../lib/exportUtils'
import StreakDisplay from '../components/kids/StreakDisplay'

export default function TodayPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDiaryExportModal, setShowDiaryExportModal] = useState(false)
  const [diaryText, setDiaryText] = useState('')

  const { notification } = useHaptics()
  const { isKidsMode } = useProfileMode()
  const { moodEmojis, diaryPrompts } = useContentForMode()
  const greetingText = useGreeting()

  // Pick a random diary prompt, stable per session
  const diaryPrompt = useMemo(
    () => diaryPrompts.suggestions[Math.floor(Math.random() * diaryPrompts.suggestions.length)],
    [diaryPrompts.suggestions]
  )

  const today = format(selectedDate, 'yyyy-MM-dd')

  // Fetch tasks and diary entry for the selected date
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(today)
  const { data: dayEntry } = useDayEntry(today)

  // Fetch user stats for streak
  const userId = user?.id || ''
  const { data: userStats } = useUserStats(userId)

  // Mutations
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const upsertDayEntry = useUpsertDayEntry()
  const updateGratitude = useUpdateGratitude()
  const updateHighlights = useUpdateHighlights()
  const updateStreak = useUpdateStreak()

  // Initialize diary and mood from database
  useEffect(() => {
    if (dayEntry) {
      setDiaryText(dayEntry.diary_text || '')
      setSelectedMood(dayEntry.mood || '')
    } else {
      setDiaryText('')
      setSelectedMood('')
    }
  }, [dayEntry])

  // Get greeting icon based on time of day
  const getGreetingIcon = () => {
    const hour = new Date().getHours()
    if (hour < 18) return Sun
    return Moon
  }

  const GreetingIcon = getGreetingIcon()

  const handleAddTask = (title: string) => {
    createTask.mutate(
      { title, date: today, completed: false },
      {
        onSuccess: () => {
          taskToast.created()
          // Update streak on activity
          if (userId) {
            updateStreak.mutate(userId)
          }
        },
        onError: () => taskToast.error(),
      }
    )
  }

  const handleToggleTask = (id: string, completed: boolean) => {
    updateTask.mutate(
      { id, updates: { completed: !completed } },
      {
        onSuccess: () => {
          if (!completed) {
            taskToast.completed()
            notification('success')
          }
        },
        onError: () => taskToast.error(),
      }
    )
  }

  const handleDeleteTask = (id: string) => {
    deleteTask.mutate(id, {
      onSuccess: () => {
        taskToast.deleted()
        notification('warning')
      },
      onError: () => taskToast.error(),
    })
  }

  const handleQuickSaveDiary = (text: string) => {
    setDiaryText(text)
    if (user) {
      upsertDayEntry.mutate(
        {
          date: today,
          diaryText: text,
        },
        {
          onSuccess: () => {
            diaryToast.saved()
            updateStreak.mutate(userId)
          },
          onError: () => diaryToast.error(),
        }
      )
    }
  }

  const handleSaveDiary = (data: { mood: string; text: string; gratitude: string[]; highlights: DiaryHighlight[]; tags: string[]; sketchUrl?: string | null; templateId?: string | null }) => {
    setSelectedMood(data.mood)
    setDiaryText(data.text)
    if (user) {
      // Save diary text and mood
      upsertDayEntry.mutate(
        {
          date: today,
          mood: data.mood,
          diaryText: data.text,
        },
        {
          onSuccess: () => {
            diaryToast.saved()
            // Update streak on activity
            updateStreak.mutate(userId)
          },
          onError: () => diaryToast.error(),
        }
      )

      // Save gratitude if any
      if (data.gratitude.length > 0) {
        updateGratitude.mutate({ date: today, gratitude: data.gratitude })
      }

      // Save highlights if any
      if (data.highlights.length > 0) {
        updateHighlights.mutate({ date: today, highlights: data.highlights })
      }
    }
    setShowDiaryModal(false)
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(newDate)
  }

  const completedTasks = tasks.filter((t) => t.completed).length
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  // Get real streak from user stats
  const currentStreak = userStats?.current_streak || 0

  // Get mood emoji for display
  const moodEmoji = selectedMood ? (moodEmojis[selectedMood] || selectedMood) : null

  return (
    <div className={`min-h-screen pb-24 ${isKidsMode ? 'bg-dayo-kids-yellow/10' : 'bg-dayo-gray-50'}`}>
      {/* Header */}
      <header className={`px-4 py-4 ${isKidsMode ? 'bg-kids-gradient' : 'bg-white'}`}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GreetingIcon className={`w-5 h-5 ${isKidsMode ? 'text-white' : 'text-dayo-orange'}`} />
            <h1 className={`text-xl font-bold ${isKidsMode ? 'text-white' : 'text-dayo-gray-900'}`}>
              {greetingText}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className={`p-2 transition-colors rounded-full ${
                isKidsMode
                  ? 'text-white/80 hover:text-white hover:bg-white/20'
                  : 'text-dayo-gray-400 hover:text-dayo-purple hover:bg-dayo-gray-100'
              }`}
              title="Share your day"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {isKidsMode ? (
              <StreakDisplay streak={currentStreak} />
            ) : (
              <div className="flex items-center gap-2 bg-dayo-orange text-white px-3 py-1.5 rounded-full text-sm font-medium">
                <Flame className="w-4 h-4" />
                {currentStreak} day streak
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Date Navigation */}
      <div className="bg-white border-b border-dayo-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 text-dayo-gray-400 hover:text-dayo-gray-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-dayo-gray-900">
              {isToday ? 'Today' : format(selectedDate, 'EEEE')}
            </p>
            <p className="text-sm text-dayo-gray-500">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 text-dayo-gray-400 hover:text-dayo-gray-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Quote Card */}
        <QuoteCard />

        {/* Stats Row */}
        <StatsRow
          tasksCompleted={completedTasks}
          totalTasks={tasks.length}
          habitsCompleted={2}
          totalHabits={4}
          mood={moodEmoji}
          onMoodClick={() => setShowDiaryModal(true)}
          onDiaryClick={() => setShowDiaryModal(true)}
        />

        {/* Tasks Section */}
        <TasksSection
          tasks={tasks}
          isLoading={tasksLoading}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          isCreating={createTask.isPending}
        />

        {/* Diary Preview Card */}
        <DiaryPreviewCard
          diaryText={diaryText}
          mood={moodEmoji}
          gratitudeCount={dayEntry?.gratitude?.length || 0}
          photosCount={dayEntry?.photos?.length || 0}
          highlightsCount={dayEntry?.highlights?.length || 0}
          prompt={diaryPrompt}
          onOpen={() => setShowDiaryModal(true)}
          onSave={handleQuickSaveDiary}
          isKidsMode={isKidsMode}
          onShare={stripToPlainText(diaryText).length > 0 ? () => setShowDiaryExportModal(true) : undefined}
        />

        {/* Habits Section */}
        <HabitsSection onViewAll={() => navigate('/habits')} />

        {/* Quick Access Cards */}
        <QuickAccessCards />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Diary Entry Modal */}
      <DiaryEntryModal
        isOpen={showDiaryModal}
        onClose={() => setShowDiaryModal(false)}
        date={selectedDate}
        initialMood={selectedMood}
        initialText={diaryText}
        initialPhotos={dayEntry?.photos || []}
        initialGratitude={dayEntry?.gratitude || []}
        initialHighlights={dayEntry?.highlights || []}
        initialSketchUrl={dayEntry?.sketch_url}
        onSave={handleSaveDiary}
        isSaving={upsertDayEntry.isPending}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        data={{
          date: today,
          dayOfWeek: format(selectedDate, 'EEEE'),
          mood: selectedMood || 'okay',
          moodEmoji: moodEmojis[selectedMood] || '😊',
          diaryText: diaryText,
          tasksCompleted: completedTasks,
          totalTasks: tasks.length,
          streak: currentStreak,
        }}
      />

      {/* Diary Export Modal */}
      <DiaryExportModal
        isOpen={showDiaryExportModal}
        onClose={() => setShowDiaryExportModal(false)}
        data={{
          date: today,
          dayOfWeek: format(selectedDate, 'EEEE'),
          mood: selectedMood || 'okay',
          moodEmoji: moodEmojis[selectedMood] || '😊',
          diaryText: stripToPlainText(diaryText),
          gratitude: dayEntry?.gratitude || [],
          highlights: dayEntry?.highlights || [],
          tags: dayEntry?.tags || [],
        }}
      />
    </div>
  )
}
