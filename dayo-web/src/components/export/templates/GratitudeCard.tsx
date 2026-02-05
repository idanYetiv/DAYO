import { type DiaryExportData, type ExportFormat, EXPORT_DIMENSIONS } from '../../../hooks/useExportImage'
import { styleConfigs, truncateText, formatExportDate } from '../../../lib/exportUtils'
import type { ExportStyle } from '../../../hooks/useExportImage'

interface GratitudeCardProps {
  data: DiaryExportData
  style: ExportStyle
  format: ExportFormat
}

export default function GratitudeCard({ data, style, format }: GratitudeCardProps) {
  const styles = styleConfigs[style]
  const dimensions = EXPORT_DIMENSIONS[format]
  const { shortDate } = formatExportDate(data.date)

  const isStory = format === 'story'
  const diaryMaxLength = isStory ? 160 : 100
  const filteredGratitude = data.gratitude.filter(g => g.trim())

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

      {/* Diary Excerpt Card */}
      {data.diaryText && (
        <div
          style={{
            background: styles.cardBg,
            borderRadius: styles.borderRadius,
            padding: isStory ? 40 : 30,
            boxShadow: styles.shadow,
            border: `1px solid ${styles.cardBorder}`,
            maxWidth: isStory ? 900 : 900,
            width: '100%',
            marginBottom: isStory ? 32 : 24,
          }}
        >
          <div
            style={{
              fontSize: isStory ? 28 : 22,
              color: styles.textPrimary,
              lineHeight: 1.6,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            "{truncateText(data.diaryText, diaryMaxLength)}"
          </div>
        </div>
      )}

      {/* Gratitude Section */}
      {filteredGratitude.length > 0 && (
        <div
          style={{
            background: styles.cardBg,
            borderRadius: styles.borderRadius,
            padding: isStory ? 40 : 30,
            boxShadow: styles.shadow,
            border: `1px solid ${styles.cardBorder}`,
            maxWidth: isStory ? 900 : 900,
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: isStory ? 24 : 20,
              fontWeight: 700,
              color: styles.accent,
              marginBottom: isStory ? 24 : 18,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Grateful For
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isStory ? 18 : 14 }}>
            {filteredGratitude.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isStory ? 16 : 12,
                  fontSize: isStory ? 26 : 20,
                  color: styles.textPrimary,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ fontSize: isStory ? 24 : 20, flexShrink: 0 }}>❤️</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
        <div
          style={{
            fontSize: isStory ? 24 : 20,
            color: styles.textSecondary,
          }}
        >
          {shortDate}
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
