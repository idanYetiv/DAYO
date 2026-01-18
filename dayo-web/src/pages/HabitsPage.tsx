import { useState } from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import { Plus, Flame, Check, MoreHorizontal, TrendingUp, Award } from 'lucide-react'
import BottomNavigation from '../components/ui/BottomNavigation'

interface Habit {
  id: string
  title: string
  icon: string
  color: string
  streak: number
  bestStreak: number
  frequency: 'daily' | 'weekly'
  targetPerWeek: number
  completedDays: string[] // Array of date strings
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime'
}

const mockHabits: Habit[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    icon: '🧘',
    color: '#F59E0B',
    streak: 5,
    bestStreak: 14,
    frequency: 'daily',
    targetPerWeek: 7,
    completedDays: ['2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11', '2026-01-12'],
    timeOfDay: 'morning',
  },
  {
    id: '2',
    title: 'Drink 8 Glasses of Water',
    icon: '💧',
    color: '#3B82F6',
    streak: 3,
    bestStreak: 21,
    frequency: 'daily',
    targetPerWeek: 7,
    completedDays: ['2026-01-10', '2026-01-11', '2026-01-12'],
    timeOfDay: 'anytime',
  },
  {
    id: '3',
    title: 'Read for 30 Minutes',
    icon: '📚',
    color: '#10B981',
    streak: 7,
    bestStreak: 30,
    frequency: 'daily',
    targetPerWeek: 7,
    completedDays: ['2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11', '2026-01-12'],
    timeOfDay: 'evening',
  },
  {
    id: '4',
    title: 'Evening Journaling',
    icon: '✏️',
    color: '#EC4899',
    streak: 2,
    bestStreak: 10,
    frequency: 'daily',
    targetPerWeek: 7,
    completedDays: ['2026-01-11', '2026-01-12'],
    timeOfDay: 'evening',
  },
  {
    id: '5',
    title: 'Workout',
    icon: '💪',
    color: '#8B5CF6',
    streak: 4,
    bestStreak: 12,
    frequency: 'weekly',
    targetPerWeek: 4,
    completedDays: ['2026-01-06', '2026-01-08', '2026-01-10', '2026-01-12'],
    timeOfDay: 'morning',
  },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function HabitsPage() {
  const [habits, setHabits] = useState(mockHabits)
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')

  // Get current week dates (Monday to Sunday)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const toggleHabitForToday = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDays.includes(todayStr)
        return {
          ...habit,
          completedDays: isCompleted
            ? habit.completedDays.filter(d => d !== todayStr)
            : [...habit.completedDays, todayStr],
          streak: isCompleted ? habit.streak - 1 : habit.streak + 1,
        }
      }
      return habit
    }))
  }

  const completedToday = habits.filter(h => h.completedDays.includes(todayStr)).length
  const totalHabits = habits.length
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-dayo-gray-100">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-dayo-gray-900">Habits</h1>
            <button className="flex items-center gap-1.5 bg-dayo-gradient text-white text-sm font-medium px-4 py-2 rounded-xl">
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
                <span className="text-2xl font-bold text-dayo-purple">85%</span>
              </div>
              <p className="text-xs text-dayo-gray-500">This Week</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Week Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 mb-6">
          <h3 className="text-sm font-semibold text-dayo-gray-900 mb-3">This Week</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const dateStr = format(date, 'yyyy-MM-dd')
              const isToday = dateStr === todayStr
              const completedCount = habits.filter(h => h.completedDays.includes(dateStr)).length
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

          {habits.map((habit) => {
            const isCompletedToday = habit.completedDays.includes(todayStr)
            const weekCompletions = weekDates.filter(date =>
              habit.completedDays.includes(format(date, 'yyyy-MM-dd'))
            ).length

            return (
              <div
                key={habit.id}
                className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Complete Button */}
                  <button
                    onClick={() => toggleHabitForToday(habit.id)}
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
                      <button className="text-dayo-gray-400 p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Week Progress */}
                    <div className="flex items-center gap-1 mt-3">
                      {weekDates.map((date, index) => {
                        const dateStr = format(date, 'yyyy-MM-dd')
                        const isCompleted = habit.completedDays.includes(dateStr)
                        const isTodayDate = dateStr === todayStr

                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className={`h-2 w-full rounded-full ${
                                isCompleted ? '' : 'bg-dayo-gray-200'
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
                        {weekCompletions}/{habit.targetPerWeek} this week
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${habit.color}15`, color: habit.color }}
                      >
                        {habit.timeOfDay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Achievement Banner */}
        <div className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <Award className="w-10 h-10" />
            <div>
              <p className="font-semibold">Great progress!</p>
              <p className="text-sm text-white/80">You've completed 85% of habits this week</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
