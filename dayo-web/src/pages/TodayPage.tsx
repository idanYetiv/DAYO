import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight, Flame, Share2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks'
import { useDayEntry, useUpsertDayEntry, useUpdateGratitude, useUpdateHighlights, type DiaryHighlight } from '../hooks/useDiary'
import { useUserStats, useUpdateStreak } from '../hooks/useUserStats'
import { useProfileMode } from '../hooks/useProfileMode'
import { useContentForMode } from '../hooks/useContentForMode'
import { taskToast, diaryToast } from '../lib/toast'
import { useHaptics } from '../hooks/useHaptics'
import { useSwipeNavigation } from '../hooks/useSwipeNavigation'
import { useDiaryMilestones, type MilestoneInfo } from '../hooks/useDiaryMilestones'
import { generateMilestoneCelebration, generateDailyInsight } from '../lib/openai'
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
import MilestoneCelebration from '../components/diary/MilestoneCelebration'
import DailyInsightToast from '../components/diary/DailyInsightToast'
import { stripToPlainText } from '../lib/exportUtils'
import StreakDisplay from '../components/kids/StreakDisplay'
import ThemedHeader from '../components/ui/ThemedHeader'

export default function TodayPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showDiaryExportModal, setShowDiaryExportModal] = useState(false)
  const [diaryText, setDiaryText] = useState('')

  // AI feedback state
  const [celebrationMilestone, setCelebrationMilestone] = useState<MilestoneInfo | null>(null)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [dailyInsight, setDailyInsight] = useState('')
  const previousDiaryText = useRef<string>('')

  const { notification, impact } = useHaptics()
  const { isKidsMode } = useProfileMode()
  const { moodEmojis, diaryPrompts } = useContentForMode()

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

  // Diary milestones hook
  const { checkMilestones, countWords } = useDiaryMilestones({
    userId,
    isKidsMode,
  })

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

  const handleSaveDiary = async (data: { mood: string; text: string; gratitude: string[]; highlights: DiaryHighlight[]; tags: string[]; sketchUrl?: string | null; templateId?: string | null }) => {
    setSelectedMood(data.mood)
    setDiaryText(data.text)
    const wasNewEntry = !previousDiaryText.current && data.text
    previousDiaryText.current = data.text

    if (user) {
      // Save diary text and mood
      upsertDayEntry.mutate(
        {
          date: today,
          mood: data.mood,
          diaryText: data.text,
        },
        {
          onSuccess: async () => {
            diaryToast.saved()
            // Update streak on activity
            updateStreak.mutate(userId)

            // Check for milestones and generate AI feedback
            const wordCount = countWords(data.text)
            if (wordCount >= 20) {
              try {
                // Check milestones
                const milestoneResult = await checkMilestones(data.text, !!wasNewEntry)

                if (milestoneResult?.newMilestone) {
                  // Generate celebration message
                  const message = await generateMilestoneCelebration({
                    milestoneId: milestoneResult.newMilestone.id,
                    milestoneTitle: milestoneResult.newMilestone.title,
                    milestoneDescription: milestoneResult.newMilestone.description,
                    totalEntries: milestoneResult.totalEntries,
                    totalWords: milestoneResult.totalWords,
                    isKidsMode,
                  })
                  setCelebrationMilestone(milestoneResult.newMilestone)
                  setCelebrationMessage(message)
                  notification('success')
                } else {
                  // Generate daily insight (only if no milestone)
                  const insight = await generateDailyInsight({
                    diaryText: data.text,
                    mood: data.mood,
                    gratitude: data.gratitude,
                    highlights: data.highlights,
                    isKidsMode,
                  })
                  if (insight) {
                    setDailyInsight(insight)
                  }
                }
              } catch (error) {
                console.error('Error generating AI feedback:', error)
              }
            }
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

  const navigateDate = useCallback((direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(newDate)
  }, [selectedDate])

  // Swipe navigation for day switching
  const { handlers: swipeHandlers, isSwiping, swipeDirection, swipeProgress } = useSwipeNavigation({
    onSwipeLeft: () => {
      navigateDate('next')
      impact('light')
    },
    onSwipeRight: () => {
      navigateDate('prev')
      impact('light')
    },
    enabled: !showDiaryModal && !showExportModal && !showDiaryExportModal,
  })

  const completedTasks = tasks.filter((t) => t.completed).length
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  // Get real streak from user stats
  const currentStreak = userStats?.current_streak || 0

  // Get mood emoji for display
  const moodEmoji = selectedMood ? (moodEmojis[selectedMood] || selectedMood) : null

  return (
    <div
      className={`min-h-screen pb-24 ${isKidsMode ? 'bg-dayo-kids-yellow/10' : 'bg-dayo-gray-50'} relative`}
      {...swipeHandlers}
    >
      {/* Swipe Edge Indicators */}
      {isSwiping && (
        <>
          {/* Left edge indicator (swipe right = previous) */}
          <div
            className={`fixed left-0 top-0 bottom-0 w-2 transition-opacity z-50 ${
              isKidsMode ? 'bg-dayo-kids-orange' : 'bg-dayo-purple'
            }`}
            style={{
              opacity: swipeDirection === 'right' ? Math.min(Math.abs(swipeProgress), 0.8) : 0,
            }}
          />
          {/* Right edge indicator (swipe left = next) */}
          <div
            className={`fixed right-0 top-0 bottom-0 w-2 transition-opacity z-50 ${
              isKidsMode ? 'bg-dayo-kids-orange' : 'bg-dayo-purple'
            }`}
            style={{
              opacity: swipeDirection === 'left' ? Math.min(Math.abs(swipeProgress), 0.8) : 0,
            }}
          />
        </>
      )}
      <ThemedHeader
        showLogo={true}
        className={isKidsMode ? 'bg-kids-gradient' : ''}
        rightContent={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 transition-colors rounded-full themed-header-icon"
              title="Share your day"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {isKidsMode ? (
              <StreakDisplay streak={currentStreak} />
            ) : (
              <div className="flex items-center gap-2 bg-dayo-orange text-white px-3 py-1.5 rounded-full text-sm font-medium">
                <Flame className="w-4 h-4" />
                {currentStreak}
              </div>
            )}
          </div>
        }
      />

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

      {/* Milestone Celebration Modal */}
      {celebrationMilestone && (
        <MilestoneCelebration
          milestone={celebrationMilestone}
          message={celebrationMessage}
          isKidsMode={isKidsMode}
          onClose={() => {
            setCelebrationMilestone(null)
            setCelebrationMessage('')
          }}
        />
      )}

      {/* Daily Insight Toast */}
      {dailyInsight && !celebrationMilestone && (
        <DailyInsightToast
          insight={dailyInsight}
          moodEmoji={moodEmoji || undefined}
          isKidsMode={isKidsMode}
          onClose={() => setDailyInsight('')}
        />
      )}
    </div>
  )
}
