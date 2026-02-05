import { type DiaryExportData, type ExportFormat, EXPORT_DIMENSIONS } from '../../../hooks/useExportImage'
import { styleConfigs, truncateText, formatExportDate } from '../../../lib/exportUtils'
import type { ExportStyle } from '../../../hooks/useExportImage'

interface DiaryPageProps {
  data: DiaryExportData
  style: ExportStyle
  format: ExportFormat
}

export default function DiaryPage({ data, style, format }: DiaryPageProps) {
  const styles = styleConfigs[style]
  const dimensions = EXPORT_DIMENSIONS[format]
  const { dayOfWeek, fullDate } = formatExportDate(data.date)

  const isStory = format === 'story'
  const diaryMaxLength = isStory ? 400 : 250

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
          <span>{data.moodEmoji}</span>
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

      {/* Diary Text Card */}
      <div
        style={{
          background: styles.cardBg,
          borderRadius: styles.borderRadius,
          padding: isStory ? 44 : 32,
          boxShadow: styles.shadow,
          border: `1px solid ${styles.cardBorder}`,
          flex: 1,
          marginBottom: isStory ? 24 : 20,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: isStory ? 28 : 22,
            color: styles.textPrimary,
            lineHeight: 1.7,
            fontStyle: 'italic',
          }}
        >
          "{truncateText(data.diaryText, diaryMaxLength)}"
        </div>
      </div>

      {/* Tags Row */}
      {data.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: isStory ? 12 : 10,
            flexWrap: 'wrap',
            marginBottom: isStory ? 24 : 20,
          }}
        >
          {data.tags.slice(0, 6).map((tag, index) => (
            <div
              key={index}
              style={{
                background: styles.cardBg,
                borderRadius: '999px',
                padding: isStory ? '10px 22px' : '8px 18px',
                fontSize: isStory ? 20 : 16,
                color: styles.accentSecondary,
                fontWeight: 600,
                border: `1px solid ${styles.cardBorder}`,
                boxShadow: styles.shadow,
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 'none', height: isStory ? 60 : 40 }} />

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
