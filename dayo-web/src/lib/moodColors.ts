export interface MoodColorSet {
  bg: string
  border: string
  calendarBg: string
}

const moodColorMap: Record<string, MoodColorSet> = {
  amazing: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    calendarBg: 'bg-amber-50 hover:bg-amber-100',
  },
  happy: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    calendarBg: 'bg-emerald-50 hover:bg-emerald-100',
  },
  okay: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    calendarBg: 'bg-blue-50 hover:bg-blue-100',
  },
  sad: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    calendarBg: 'bg-indigo-50 hover:bg-indigo-100',
  },
  stressed: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    calendarBg: 'bg-red-50 hover:bg-red-100',
  },
  tired: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    calendarBg: 'bg-purple-50 hover:bg-purple-100',
  },
}

const defaultColors: MoodColorSet = {
  bg: 'bg-white',
  border: 'border-dayo-gray-100',
  calendarBg: 'bg-emerald-50 hover:bg-emerald-100',
}

export function getMoodColors(mood: string | null): MoodColorSet {
  if (!mood) return defaultColors
  return moodColorMap[mood] || defaultColors
}

export function getMoodBackground(mood: string | null): string {
  const colors = getMoodColors(mood)
  return `${colors.bg} ${colors.border}`
}

export function getMoodCalendarBg(mood: string | null): string {
  const colors = getMoodColors(mood)
  return colors.calendarBg
}
