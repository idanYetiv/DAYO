import { type ExportData, type ExportFormat, EXPORT_DIMENSIONS } from '../../../hooks/useExportImage'
import { styleConfigs, truncateText, formatExportDate, getMoodLabel } from '../../../lib/exportUtils'
import type { ExportStyle } from '../../../hooks/useExportImage'

interface FullDayCardProps {
  data: ExportData
  style: ExportStyle
  format: ExportFormat
}

export default function FullDayCard({ data, style, format }: FullDayCardProps) {
  const styles = styleConfigs[style]
  const dimensions = EXPORT_DIMENSIONS[format]
  const { dayOfWeek, fullDate } = formatExportDate(data.date)

  // Scale factor for preview (actual export is full size)
  const isStory = format === 'story'
  const diaryMaxLength = isStory ? 180 : 120

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
      {/* Date Header */}
      <div style={{ marginBottom: isStory ? 40 : 30 }}>
        <div
          style={{
            fontSize: isStory ? 48 : 42,
            fontWeight: 700,
            color: styles.textPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>✨</span>
          <span>{dayOfWeek}</span>
        </div>
        <div
          style={{
            fontSize: isStory ? 28 : 24,
            color: styles.textSecondary,
            marginTop: 4,
          }}
        >
          {fullDate}
        </div>
      </div>

      {/* Mood Card */}
      <div
        style={{
          background: styles.cardBg,
          borderRadius: styles.borderRadius,
          padding: isStory ? 40 : 30,
          boxShadow: styles.shadow,
          border: `1px solid ${styles.cardBorder}`,
          marginBottom: isStory ? 24 : 20,
        }}
      >
        <div
          style={{
            fontSize: isStory ? 72 : 56,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          {data.moodEmoji}
        </div>
        <div
          style={{
            fontSize: isStory ? 32 : 26,
            fontWeight: 600,
            textAlign: 'center',
            color: styles.textPrimary,
          }}
        >
          Feeling {getMoodLabel(data.mood)}
        </div>
      </div>

      {/* Diary Excerpt */}
      {data.diaryText && (
        <div
          style={{
            background: styles.cardBg,
            borderRadius: styles.borderRadius,
            padding: isStory ? 36 : 28,
            boxShadow: styles.shadow,
            border: `1px solid ${styles.cardBorder}`,
            marginBottom: isStory ? 24 : 20,
            flex: isStory ? 1 : 'none',
            maxHeight: isStory ? 400 : 200,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontSize: isStory ? 26 : 22,
              color: styles.textPrimary,
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}
          >
            "{truncateText(data.diaryText, diaryMaxLength)}"
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div
        style={{
          display: 'flex',
          gap: isStory ? 20 : 16,
          marginTop: 'auto',
          marginBottom: isStory ? 80 : 60,
        }}
      >
        {/* Tasks */}
        <div
          style={{
            flex: 1,
            background: styles.cardBg,
            borderRadius: styles.borderRadius,
            padding: isStory ? 24 : 20,
            boxShadow: styles.shadow,
            border: `1px solid ${styles.cardBorder}`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: isStory ? 36 : 28, marginBottom: 4 }}>✅</div>
          <div
            style={{
              fontSize: isStory ? 32 : 26,
              fontWeight: 700,
              color: styles.textPrimary,
            }}
          >
            {data.tasksCompleted}/{data.totalTasks}
          </div>
          <div
            style={{
              fontSize: isStory ? 18 : 14,
              color: styles.textSecondary,
              marginTop: 4,
            }}
          >
            Tasks Done
          </div>
        </div>

        {/* Streak */}
        <div
          style={{
            flex: 1,
            background: styles.cardBg,
            borderRadius: styles.borderRadius,
            padding: isStory ? 24 : 20,
            boxShadow: styles.shadow,
            border: `1px solid ${styles.cardBorder}`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: isStory ? 36 : 28, marginBottom: 4 }}>🔥</div>
          <div
            style={{
              fontSize: isStory ? 32 : 26,
              fontWeight: 700,
              color: styles.accent,
            }}
          >
            {data.streak}
          </div>
          <div
            style={{
              fontSize: isStory ? 18 : 14,
              color: styles.textSecondary,
              marginTop: 4,
            }}
          >
            Day Streak
          </div>
        </div>
      </div>

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
