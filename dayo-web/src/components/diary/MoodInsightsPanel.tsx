import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useDiaryInsights } from '../../hooks/useDiaryInsights'
import { useContentForMode } from '../../hooks/useContentForMode'
import MoodDistributionChart from './MoodDistributionChart'
import WritingStatsCard from './WritingStatsCard'

type Period = '7d' | '30d' | 'all'

export default function MoodInsightsPanel() {
  const [period, setPeriod] = useState<Period>('30d')
  const { data: insights, isLoading } = useDiaryInsights(period)
  const { moodEmojis } = useContentForMode()

  const periods: { value: Period; label: string }[] = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: 'all', label: 'All time' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-dayo-purple animate-spin" />
      </div>
    )
  }

  if (!insights) return null

  const photoPercent = insights.totalEntries > 0
    ? Math.round((insights.entriesWithPhotos / insights.totalEntries) * 100)
    : 0
  const gratitudePercent = insights.totalEntries > 0
    ? Math.round((insights.entriesWithGratitude / insights.totalEntries) * 100)
    : 0
  const highlightsPercent = insights.totalEntries > 0
    ? Math.round((insights.entriesWithHighlights / insights.totalEntries) * 100)
    : 0

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex bg-dayo-gray-100 rounded-xl p-1">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              period === p.value
                ? 'bg-white text-dayo-gray-900 shadow-sm'
                : 'text-dayo-gray-500'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Mood Distribution */}
      <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4">
        <h4 className="font-semibold text-dayo-gray-900 mb-3">Mood Distribution</h4>
        <MoodDistributionChart
          distribution={insights.moodDistribution}
          total={insights.entriesWithMood}
        />
        {insights.mostCommonMood && (
          <div className="mt-3 pt-3 border-t border-dayo-gray-100 space-y-1">
            <p className="text-xs text-dayo-gray-500">
              Most common: {moodEmojis[insights.mostCommonMood] || ''} {insights.mostCommonMood}
            </p>
            {insights.moodStreak.count > 1 && insights.moodStreak.mood && (
              <p className="text-xs text-dayo-gray-500">
                Mood streak: {insights.moodStreak.count} days {moodEmojis[insights.moodStreak.mood] || ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Writing Stats */}
      <WritingStatsCard
        totalWords={insights.totalWords}
        averageWords={insights.averageWords}
        longestEntry={insights.longestEntry}
        writingStreak={insights.writingStreak}
      />

      {/* Entry Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4">
        <h4 className="font-semibold text-dayo-gray-900 mb-3">Entry Stats</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dayo-gray-500">Total entries</span>
            <span className="font-medium text-dayo-gray-900">{insights.totalEntries}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dayo-gray-500">With photos</span>
            <span className="font-medium text-dayo-gray-900">{photoPercent}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dayo-gray-500">With gratitude</span>
            <span className="font-medium text-dayo-gray-900">{gratitudePercent}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dayo-gray-500">With highlights</span>
            <span className="font-medium text-dayo-gray-900">{highlightsPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
