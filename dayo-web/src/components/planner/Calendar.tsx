import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDirection } from '../../hooks/useDirection'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  daysWithEntries?: string[] // Array of dates in YYYY-MM-DD format
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  daysWithEntries = [],
}: CalendarProps) {
  const { t } = useTranslation()
  const { isRTL } = useDirection()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekDays = t('calendar.weekDays', { returnObjects: true }) as string[]

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(
      direction === 'prev' ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1)
    )
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(startOfMonth(today))
    onDateSelect(today)
  }

  const hasEntry = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return daysWithEntries.includes(dateStr)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isRTL ? 'rtl-flip' : ''}`} />
        </button>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={goToToday}
            className="text-xs text-dayo-orange hover:underline mt-1"
          >
            {t('nav.today')}
          </button>
        </div>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isRTL ? 'rtl-flip' : ''}`} />
        </button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isTodayDate = isToday(day)
          const hasEntryOnDay = hasEntry(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={`
                relative aspect-square flex items-center justify-center rounded-lg text-sm
                transition-all duration-200
                ${!isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}
                ${isSelected ? 'bg-dayo-orange text-white font-semibold' : ''}
                ${!isSelected && isTodayDate ? 'ring-2 ring-dayo-orange ring-inset' : ''}
                ${!isSelected && isCurrentMonth ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
              `}
            >
              {format(day, 'd')}
              {/* Entry indicator dot */}
              {hasEntryOnDay && !isSelected && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-dayo-orange rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
