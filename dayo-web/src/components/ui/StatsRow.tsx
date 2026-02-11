import { PenLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StatsRowProps {
  tasksCompleted: number
  totalTasks: number
  habitsCompleted: number
  totalHabits: number
  mood: string | null
  onMoodClick: () => void
  onDiaryClick: () => void
}

export default function StatsRow({
  tasksCompleted,
  totalTasks,
  habitsCompleted,
  totalHabits,
  mood,
  onMoodClick,
  onDiaryClick,
}: StatsRowProps) {
  const { t } = useTranslation()
  const taskPercentage = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Tasks Done */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-dayo-gray-100">
        <div className="flex flex-col items-center">
          <div className="relative w-14 h-14 mb-2">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${taskPercentage * 1.51} 151`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-emerald-500">
              {taskPercentage}%
            </span>
          </div>
          <span className="text-xs text-dayo-gray-500">{t('stats.tasksDone')}</span>
        </div>
      </div>

      {/* Habits */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-dayo-gray-100">
        <div className="flex flex-col items-center">
          <div className="text-center mb-2">
            <span className="text-2xl font-bold text-dayo-purple">{habitsCompleted}</span>
            <span className="text-dayo-gray-400 text-lg"> / </span>
            <span className="text-lg text-dayo-gray-600">{totalHabits}</span>
          </div>
          <span className="text-xs text-dayo-gray-500">{t('stats.habits')}</span>
        </div>
      </div>

      {/* Mood + Write Diary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-dayo-gray-100">
        <div className="flex flex-col items-center">
          {/* Mood */}
          <button
            onClick={onMoodClick}
            className="text-3xl mb-1 hover:scale-110 transition-transform"
          >
            {mood || '😐'}
          </button>
          <span className="text-xs text-dayo-gray-500 mb-2">{t('stats.mood')}</span>

          {/* Write Diary Button */}
          <button
            onClick={onDiaryClick}
            className="flex items-center gap-1 text-xs font-medium text-white bg-dayo-gradient px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            <PenLine className="w-3 h-3" />
            {t('stats.writeDiary')}
          </button>
        </div>
      </div>
    </div>
  )
}
