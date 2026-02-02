import { useContentForMode } from '../../hooks/useContentForMode'

interface MoodDistributionChartProps {
  distribution: Record<string, number>
  total: number
}

const moodBarColors: Record<string, string> = {
  amazing: 'bg-amber-400',
  happy: 'bg-emerald-400',
  okay: 'bg-blue-300',
  sad: 'bg-indigo-400',
  stressed: 'bg-red-400',
  tired: 'bg-purple-400',
}

export default function MoodDistributionChart({ distribution, total }: MoodDistributionChartProps) {
  const { moodEmojis } = useContentForMode()

  if (total === 0) {
    return (
      <p className="text-sm text-dayo-gray-400 text-center py-4">
        No mood data yet
      </p>
    )
  }

  const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="h-6 rounded-full overflow-hidden flex bg-dayo-gray-100">
        {sorted.map(([mood, count]) => {
          const pct = (count / total) * 100
          if (pct < 1) return null
          return (
            <div
              key={mood}
              className={`${moodBarColors[mood] || 'bg-dayo-gray-300'} transition-all`}
              style={{ width: `${pct}%` }}
              title={`${mood}: ${Math.round(pct)}%`}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {sorted.map(([mood, count]) => {
          const pct = Math.round((count / total) * 100)
          return (
            <div key={mood} className="flex items-center gap-1.5 text-xs text-dayo-gray-600">
              <span>{moodEmojis[mood] || mood}</span>
              <span>{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { moodBarColors }
