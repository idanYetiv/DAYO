import { type ExportData, type ExportFormat, EXPORT_DIMENSIONS } from '../../../hooks/useExportImage'
import { styleConfigs, truncateText, formatExportDate, getMoodLabel } from '../../../lib/exportUtils'
import type { ExportStyle } from '../../../hooks/useExportImage'

interface DiarySpotlightProps {
  data: ExportData
  style: ExportStyle
  format: ExportFormat
}

export default function DiarySpotlight({ data, style, format }: DiarySpotlightProps) {
  const styles = styleConfigs[style]
  const dimensions = EXPORT_DIMENSIONS[format]
  const { shortDate } = formatExportDate(data.date)

  const isStory = format === 'story'
  const diaryMaxLength = isStory ? 280 : 180

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
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Large Mood Emoji */}
      <div
        style={{
          fontSize: isStory ? 120 : 96,
          marginBottom: isStory ? 40 : 30,
          filter: style === 'dark' ? 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.3))' : 'none',
        }}
      >
        {data.moodEmoji}
      </div>

      {/* Diary Text Card */}
      <div
        style={{
          background: styles.cardBg,
          borderRadius: styles.borderRadius,
          padding: isStory ? 48 : 36,
          boxShadow: styles.shadow,
          border: `1px solid ${styles.cardBorder}`,
          maxWidth: isStory ? 900 : 900,
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: isStory ? 32 : 26,
            color: styles.textPrimary,
            lineHeight: 1.7,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          {data.diaryText ? (
            <>"{truncateText(data.diaryText, diaryMaxLength)}"</>
          ) : (
            <span style={{ color: styles.textSecondary }}>
              Feeling {getMoodLabel(data.mood)} today
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div
        style={{
          position: 'absolute',
          bottom: isStory ? 80 : 60,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isStory ? 20 : 16,
        }}
      >
        {/* Date and Streak */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isStory ? 24 : 20,
            fontSize: isStory ? 24 : 20,
            color: styles.textSecondary,
          }}
        >
          <span>{shortDate}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span
            style={{
              color: styles.accent,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            🔥 {data.streak} day streak
          </span>
        </div>

        {/* Branding */}
        <div
          style={{
            fontSize: isStory ? 22 : 18,
            color: styles.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            opacity: 0.8,
          }}
        >
          <span>📝</span>
          <span style={{ fontWeight: 500 }}>dayo.app</span>
        </div>
      </div>
    </div>
  )
}
