interface WritingStatsCardProps {
  totalWords: number
  averageWords: number
  longestEntry: number
  writingStreak: number
}

export default function WritingStatsCard({
  totalWords,
  averageWords,
  longestEntry,
  writingStreak,
}: WritingStatsCardProps) {
  const stats = [
    { label: 'Total Words', value: totalWords.toLocaleString(), icon: '\u{1F4DD}' },
    { label: 'Avg/Entry', value: averageWords.toLocaleString(), icon: '\u{1F4CA}' },
    { label: 'Longest Entry', value: longestEntry.toLocaleString(), icon: '\u{1F3C6}' },
    { label: 'Writing Streak', value: `${writingStreak} day${writingStreak !== 1 ? 's' : ''}`, icon: '\u{1F525}' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4">
      <h4 className="font-semibold text-dayo-gray-900 mb-3">Writing Stats</h4>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-start gap-2">
            <span className="text-lg">{stat.icon}</span>
            <div>
              <p className="text-xs text-dayo-gray-500">{stat.label}</p>
              <p className="font-semibold text-dayo-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
