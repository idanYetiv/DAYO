import { type DiaryExportData, type ExportFormat, EXPORT_DIMENSIONS } from '../../../hooks/useExportImage'
import { styleConfigs, truncateText, formatExportDate, getMoodLabel } from '../../../lib/exportUtils'
import type { ExportStyle } from '../../../hooks/useExportImage'

interface HighlightReelProps {
  data: DiaryExportData
  style: ExportStyle
  format: ExportFormat
}

export default function HighlightReel({ data, style, format }: HighlightReelProps) {
  const styles = styleConfigs[style]
  const dimensions = EXPORT_DIMENSIONS[format]
  const { fullDate } = formatExportDate(data.date)

  const isStory = format === 'story'
  const diaryMaxLength = isStory ? 140 : 100
  const filteredHighlights = data.highlights.filter(h => h.text.trim())

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
          marginBottom: isStory ? 50 : 36,
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
          <span>My Day's Highlights</span>
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

      {/* Highlights List */}
      {filteredHighlights.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isStory ? 20 : 16,
            flex: 1,
            marginBottom: isStory ? 24 : 20,
          }}
        >
          {filteredHighlights.slice(0, 5).map((highlight, index) => (
            <div
              key={index}
              style={{
                background: styles.cardBg,
                borderRadius: styles.borderRadius,
                padding: isStory ? 32 : 24,
                boxShadow: styles.shadow,
                border: `1px solid ${styles.cardBorder}`,
                display: 'flex',
                alignItems: 'center',
                gap: isStory ? 20 : 16,
              }}
            >
              <div style={{ fontSize: isStory ? 48 : 38, flexShrink: 0 }}>
                {highlight.emoji}
              </div>
              <div
                style={{
                  fontSize: isStory ? 26 : 20,
                  color: styles.textPrimary,
                  lineHeight: 1.5,
                  fontWeight: 500,
                }}
              >
                {highlight.text}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Fallback: just diary text if no highlights
        <div
          style={{
            background: styles.cardBg,
            borderRadius: styles.borderRadius,
            padding: isStory ? 44 : 32,
            boxShadow: styles.shadow,
            border: `1px solid ${styles.cardBorder}`,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: isStory ? 24 : 20,
          }}
        >
          <div
            style={{
              fontSize: isStory ? 30 : 24,
              color: styles.textPrimary,
              lineHeight: 1.7,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            {data.diaryText
              ? `"${truncateText(data.diaryText, isStory ? 300 : 200)}"`
              : `Feeling ${getMoodLabel(data.mood)} today`}
          </div>
        </div>
      )}

      {/* Mood + Diary Footer Card */}
      {filteredHighlights.length > 0 && (
        <div
          style={{
            background: styles.cardBg,
            borderRadius: styles.borderRadius,
            padding: isStory ? 28 : 22,
            boxShadow: styles.shadow,
            border: `1px solid ${styles.cardBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: isStory ? 20 : 16,
            marginBottom: isStory ? 80 : 60,
          }}
        >
          <div style={{ fontSize: isStory ? 48 : 38, flexShrink: 0 }}>
            {data.moodEmoji}
          </div>
          <div>
            <div
              style={{
                fontSize: isStory ? 22 : 18,
                fontWeight: 600,
                color: styles.textPrimary,
                marginBottom: 4,
              }}
            >
              Feeling {getMoodLabel(data.mood)}
            </div>
            {data.diaryText && (
              <div
                style={{
                  fontSize: isStory ? 20 : 16,
                  color: styles.textSecondary,
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                }}
              >
                "{truncateText(data.diaryText, diaryMaxLength)}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spacer when no highlights */}
      {filteredHighlights.length === 0 && <div style={{ flex: 'none', height: isStory ? 60 : 40 }} />}

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
