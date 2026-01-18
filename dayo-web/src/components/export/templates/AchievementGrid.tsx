import { type ExportData, type ExportFormat, EXPORT_DIMENSIONS } from '../../../hooks/useExportImage'
import { styleConfigs, truncateText, formatExportDate, getMoodLabel } from '../../../lib/exportUtils'
import type { ExportStyle } from '../../../hooks/useExportImage'

interface AchievementGridProps {
  data: ExportData
  style: ExportStyle
  format: ExportFormat
}

export default function AchievementGrid({ data, style, format }: AchievementGridProps) {
  const styles = styleConfigs[style]
  const dimensions = EXPORT_DIMENSIONS[format]
  const { fullDate } = formatExportDate(data.date)

  const isStory = format === 'story'
  const diaryMaxLength = isStory ? 100 : 80

  const gridItems = [
    {
      emoji: data.moodEmoji,
      value: getMoodLabel(data.mood),
      label: 'Mood',
    },
    {
      emoji: '✅',
      value: `${data.tasksCompleted}/${data.totalTasks}`,
      label: 'Tasks',
    },
    {
      emoji: '🔥',
      value: data.streak.toString(),
      label: 'Streak',
      isAccent: true,
    },
  ]

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        background: styles.background,
        padding: isStory ? 60 : 50,
        fontFamily: styles.fontFamily,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isStory ? 60 : 40,
        }}
      >
        <div
          style={{
            fontSize: isStory ? 48 : 40,
            fontWeight: 700,
            color: styles.textPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <span>My Day</span>
          <span>✨</span>
        </div>
        <div
          style={{
            fontSize: isStory ? 26 : 22,
            color: styles.textSecondary,
            marginTop: 8,
          }}
        >
          {fullDate}
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'flex',
          gap: isStory ? 20 : 16,
          marginBottom: isStory ? 40 : 30,
        }}
      >
        {gridItems.map((item, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              background: styles.cardBg,
              borderRadius: styles.borderRadius,
              padding: isStory ? 32 : 24,
              boxShadow: styles.shadow,
              border: `1px solid ${styles.cardBorder}`,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isStory ? 180 : 140,
            }}
          >
            <div
              style={{
                fontSize: isStory ? 56 : 44,
                marginBottom: isStory ? 12 : 8,
              }}
            >
              {item.emoji}
            </div>
            <div
              style={{
                fontSize: isStory ? 28 : 22,
                fontWeight: 700,
                color: item.isAccent ? styles.accent : styles.textPrimary,
                marginBottom: 4,
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontSize: isStory ? 16 : 14,
                color: styles.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Diary Quote */}
      {data.diaryText && (
        <div
          style={{
            background: styles.cardBg,
            borderRadius: styles.borderRadius,
            padding: isStory ? 36 : 28,
            boxShadow: styles.shadow,
            border: `1px solid ${styles.cardBorder}`,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: isStory ? 80 : 60,
          }}
        >
          <div
            style={{
              fontSize: isStory ? 28 : 22,
              color: styles.textPrimary,
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            "{truncateText(data.diaryText, diaryMaxLength)}"
          </div>
        </div>
      )}

      {/* Spacer if no diary */}
      {!data.diaryText && <div style={{ flex: 1 }} />}

      {/* Branding Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: isStory ? 50 : 40,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: isStory ? 22 : 18,
            color: styles.textSecondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span style={{ opacity: 0.7 }}>📝</span>
          <span style={{ fontWeight: 500 }}>dayo.app</span>
        </div>
      </div>
    </div>
  )
}
