import { Flame, MoreHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Habit {
  id: string
  title: string
  icon: string
  streak: number
  weekProgress: boolean[] // M T W T F S S (7 days)
  color: string
}

interface HabitsSectionProps {
  habits?: Habit[]
  onViewAll?: () => void
}

const defaultHabits: Habit[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    icon: '🧘',
    streak: 5,
    weekProgress: [true, true, true, true, false, false, false],
    color: '#F59E0B',
  },
  {
    id: '2',
    title: 'Drink 8 Glasses of Water',
    icon: '💧',
    streak: 3,
    weekProgress: [true, true, false, true, true, false, false],
    color: '#3B82F6',
  },
  {
    id: '3',
    title: 'Read for 30 Minutes',
    icon: '📚',
    streak: 7,
    weekProgress: [true, true, true, true, false, false, false],
    color: '#10B981',
  },
  {
    id: '4',
    title: 'Evening Journaling',
    icon: '✏️',
    streak: 2,
    weekProgress: [true, true, true, true, false, false, false],
    color: '#EC4899',
  },
]

export default function HabitsSection({ habits = defaultHabits, onViewAll }: HabitsSectionProps) {
  const { t } = useTranslation()
  const weekDays = t('habits.weekDays', { returnObjects: true }) as string[]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-dayo-gray-900">{t('habits.title')}</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-dayo-gray-500 hover:text-dayo-purple transition-colors"
          >
            {t('habits.viewAll')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-dayo-gray-100"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{habit.icon}</span>
                <div>
                  <h4 className="font-medium text-dayo-gray-900 text-sm leading-tight">
                    {habit.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-dayo-orange" />
                    <span className="text-xs text-dayo-orange font-medium">
                      {t('habits.dayStreak', { count: habit.streak })}
                    </span>
                  </div>
                </div>
              </div>
              <button className="text-dayo-gray-400 hover:text-dayo-gray-600 p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Week progress */}
            <div className="flex items-center gap-1 mt-3">
              {weekDays.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`h-1.5 w-full rounded-full ${
                      habit.weekProgress[index]
                        ? 'bg-dayo-purple'
                        : 'bg-dayo-gray-200'
                    }`}
                    style={habit.weekProgress[index] ? { backgroundColor: habit.color } : {}}
                  />
                  <span className="text-[10px] text-dayo-gray-400">{day}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
