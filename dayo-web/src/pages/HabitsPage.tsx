import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Flame, Check, MoreHorizontal, TrendingUp, Award, Loader2, X, Trash2 } from 'lucide-react'
import BottomNavigation from '../components/ui/BottomNavigation'
import {
  useHabits,
  useCreateHabit,
  useDeleteHabit,
  useToggleHabitCompletion,
  isHabitCompletedForDate,
  getWeekDates,
  getWeekCompletionsCount,
  getWeekCompletionRate,
  type HabitWithCompletions,
} from '../hooks/useHabits'
import { toast } from 'sonner'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const defaultColors = ['#8B5CF6', '#10B981', '#F97316', '#3B82F6', '#EC4899', '#F59E0B']
const defaultIcons = ['✅', '🧘', '💧', '📚', '💪', '✏️', '🏃', '🎯', '🌟', '❤️']

export default function HabitsPage() {
  const [showNewHabitModal, setShowNewHabitModal] = useState(false)

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const weekDates = getWeekDates(today)

  // Hooks
  const { data: habits, isLoading, error } = useHabits()
  const createHabit = useCreateHabit()
  const deleteHabit = useDeleteHabit()
  const toggleCompletion = useToggleHabitCompletion()

  // Stats
  const completedToday = habits?.filter(h => isHabitCompletedForDate(h, todayStr)).length || 0
  const totalHabits = habits?.length || 0
  const totalStreak = habits?.reduce((sum, h) => sum + h.streak, 0) || 0
  const weekCompletionRate = habits ? getWeekCompletionRate(habits, weekDates) : 0

  const handleToggleHabit = (habitId: string, date: string) => {
    const habit = habits?.find(h => h.id === habitId)
    const wasCompleted = habit ? isHabitCompletedForDate(habit, date) : false

    toggleCompletion.mutate(
      { habitId, date },
      {
        onSuccess: (result) => {
          if (result.action === 'added') {
            toast.success('Habit completed!')
          }
        },
        onError: () => {
          toast.error('Failed to update habit')
        }
      }
    )
  }

  const handleDeleteHabit = (habitId: string, title: string) => {
    if (confirm(`Delete "${title}"? This will remove all completion history.`)) {
      deleteHabit.mutate(habitId, {
        onSuccess: () => {
          toast.success('Habit deleted')
        },
        onError: () => {
          toast.error('Failed to delete habit')
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-dayo-gray-100">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-dayo-gray-900">Habits</h1>
            <button
              onClick={() => setShowNewHabitModal(true)}
              className="flex items-center gap-1.5 bg-dayo-gradient text-white text-sm font-medium px-4 py-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              New Habit
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-dayo-gray-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-emerald-500">
                {completedToday}/{totalHabits}
              </div>
              <p className="text-xs text-dayo-gray-500">Today</p>
            </div>
            <div className="bg-dayo-gray-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-dayo-orange" />
                <span className="text-2xl font-bold text-dayo-orange">{totalStreak}</span>
              </div>
              <p className="text-xs text-dayo-gray-500">Total Streak</p>
            </div>
            <div className="bg-dayo-gray-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-5 h-5 text-dayo-purple" />
                <span className="text-2xl font-bold text-dayo-purple">{weekCompletionRate}%</span>
              </div>
              <p className="text-xs text-dayo-gray-500">This Week</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-dayo-purple animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <p className="text-red-600">Failed to load habits</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Week Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 mb-6">
              <h3 className="text-sm font-semibold text-dayo-gray-900 mb-3">This Week</h3>
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date, index) => {
                  const dateStr = format(date, 'yyyy-MM-dd')
                  const isToday = dateStr === todayStr
                  const completedCount = habits?.filter(h => isHabitCompletedForDate(h, dateStr)).length || 0
                  const completionRate = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0

                  return (
                    <div key={index} className="text-center">
                      <p className={`text-xs mb-2 ${isToday ? 'font-bold text-dayo-purple' : 'text-dayo-gray-400'}`}>
                        {weekDays[index]}
                      </p>
                      <div
                        className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-sm font-medium ${
                          isToday
                            ? 'bg-dayo-purple text-white'
                            : completionRate === 100
                            ? 'bg-emerald-100 text-emerald-600'
                            : completionRate > 0
                            ? 'bg-dayo-orange/10 text-dayo-orange'
                            : 'bg-dayo-gray-100 text-dayo-gray-400'
                        }`}
                      >
                        {format(date, 'd')}
                      </div>
                      <p className="text-[10px] text-dayo-gray-400 mt-1">
                        {completedCount}/{totalHabits}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Habits List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-dayo-gray-900">All Habits</h3>

              {(!habits || habits.length === 0) ? (
                <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-8 text-center">
                  <Check className="w-12 h-12 text-dayo-gray-300 mx-auto mb-4" />
                  <p className="text-dayo-gray-500 mb-4">No habits yet</p>
                  <button
                    onClick={() => setShowNewHabitModal(true)}
                    className="text-sm text-dayo-purple font-medium"
                  >
                    Create your first habit
                  </button>
                </div>
              ) : (
                habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    todayStr={todayStr}
                    weekDates={weekDates}
                    onToggle={handleToggleHabit}
                    onDelete={handleDeleteHabit}
                  />
                ))
              )}
            </div>

            {/* Achievement Banner */}
            {habits && habits.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-3">
                  <Award className="w-10 h-10" />
                  <div>
                    <p className="font-semibold">
                      {weekCompletionRate >= 80 ? 'Great progress!' : weekCompletionRate >= 50 ? 'Keep going!' : 'Build momentum!'}
                    </p>
                    <p className="text-sm text-white/80">
                      You've completed {weekCompletionRate}% of habits this week
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* New Habit Modal */}
      {showNewHabitModal && (
        <NewHabitModal
          onClose={() => setShowNewHabitModal(false)}
          onSubmit={createHabit.mutate}
          isLoading={createHabit.isPending}
        />
      )}

      <BottomNavigation />
    </div>
  )
}

// Habit Card Component
interface HabitCardProps {
  habit: HabitWithCompletions
  todayStr: string
  weekDates: Date[]
  onToggle: (habitId: string, date: string) => void
  onDelete: (habitId: string, title: string) => void
}

function HabitCard({ habit, todayStr, weekDates, onToggle, onDelete }: HabitCardProps) {
  const isCompletedToday = isHabitCompletedForDate(habit, todayStr)
  const weekCompletions = getWeekCompletionsCount(habit, weekDates)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4">
      <div className="flex items-start gap-3">
        {/* Complete Button */}
        <button
          onClick={() => onToggle(habit.id, todayStr)}
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
            isCompletedToday
              ? 'bg-emerald-500 text-white'
              : 'border-2 border-dayo-gray-200 hover:border-dayo-purple'
          }`}
          style={!isCompletedToday ? { backgroundColor: `${habit.color}10` } : {}}
        >
          {isCompletedToday ? <Check className="w-6 h-6" /> : habit.icon}
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-dayo-gray-900">{habit.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-dayo-orange" />
                  <span className="text-xs text-dayo-orange font-medium">
                    {habit.streak} day streak
                  </span>
                </div>
                <span className="text-xs text-dayo-gray-300">•</span>
                <span className="text-xs text-dayo-gray-400">
                  Best: {habit.bestStreak}
                </span>
              </div>
            </div>
            <button
              onClick={() => onDelete(habit.id, habit.title)}
              className="text-dayo-gray-400 p-1 hover:text-red-500"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Week Progress */}
          <div className="flex items-center gap-1 mt-3">
            {weekDates.map((date, index) => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const isCompleted = isHabitCompletedForDate(habit, dateStr)
              const isTodayDate = dateStr === todayStr

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <button
                    onClick={() => onToggle(habit.id, dateStr)}
                    className={`h-2 w-full rounded-full transition-all ${
                      isCompleted ? '' : 'bg-dayo-gray-200 hover:bg-dayo-gray-300'
                    }`}
                    style={isCompleted ? { backgroundColor: habit.color } : {}}
                  />
                  <span className={`text-[10px] ${isTodayDate ? 'text-dayo-purple font-bold' : 'text-dayo-gray-400'}`}>
                    {weekDays[index].charAt(0)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Weekly Progress */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-dayo-gray-400">
              {weekCompletions}/{habit.target_per_week} this week
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
            >
              {habit.time_of_day}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// New Habit Modal Component
interface NewHabitModalProps {
  onClose: () => void
  onSubmit: (data: {
    title: string
    icon: string
    color: string
    frequency: 'daily' | 'weekly'
    target_per_week: number
    time_of_day: 'morning' | 'afternoon' | 'evening' | 'anytime'
  }) => void
  isLoading: boolean
}

function NewHabitModal({ onClose, onSubmit, isLoading }: NewHabitModalProps) {
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState(defaultIcons[0])
  const [color, setColor] = useState(defaultColors[0])
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [targetPerWeek, setTargetPerWeek] = useState(7)
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('anytime')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      icon,
      color,
      frequency,
      target_per_week: targetPerWeek,
      time_of_day: timeOfDay,
    })

    toast.success('Habit created!')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-dayo-gray-100">
          <h2 className="text-lg font-semibold text-dayo-gray-900">New Habit</h2>
          <button onClick={onClose} className="text-dayo-gray-400 hover:text-dayo-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">Habit Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Meditation"
              className="w-full mt-1 border border-dayo-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-dayo-purple/20"
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">Icon</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {defaultIcons.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    icon === i
                      ? 'bg-dayo-purple/10 ring-2 ring-dayo-purple'
                      : 'bg-dayo-gray-100'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">Color</label>
            <div className="flex gap-2 mt-2">
              {defaultColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-dayo-gray-400' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">Frequency</label>
            <div className="flex gap-2 mt-2">
              {(['daily', 'weekly'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => {
                    setFrequency(freq)
                    setTargetPerWeek(freq === 'daily' ? 7 : 4)
                  }}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    frequency === freq
                      ? 'bg-dayo-purple text-white'
                      : 'bg-dayo-gray-100 text-dayo-gray-600'
                  }`}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Target per week */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">
              Target per week: {targetPerWeek}x
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={targetPerWeek}
              onChange={(e) => setTargetPerWeek(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-dayo-gray-400">
              <span>1x</span>
              <span>7x</span>
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <label className="text-sm font-medium text-dayo-gray-700">Best time</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {(['morning', 'afternoon', 'evening', 'anytime'] as const).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setTimeOfDay(time)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    timeOfDay === time
                      ? 'bg-dayo-purple text-white'
                      : 'bg-dayo-gray-100 text-dayo-gray-600'
                  }`}
                >
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!title.trim() || isLoading}
            className="w-full bg-dayo-gradient text-white font-medium py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Habit
          </button>
        </form>
      </div>
    </div>
  )
}
