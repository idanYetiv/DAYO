import { useState, useEffect, useRef, useCallback } from 'react'
import { Pen, Camera, Heart, Sparkles, ArrowUpRight, Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DiaryPreviewCardProps {
  diaryText: string
  mood: string | null
  gratitudeCount: number
  photosCount: number
  highlightsCount: number
  prompt: string
  onOpen: () => void
  onSave: (text: string) => void
  isKidsMode: boolean
  onShare?: () => void
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function wordCount(text: string): number {
  const stripped = stripHtml(text)
  if (!stripped) return 0
  return stripped.split(/\s+/).filter(Boolean).length
}

export default function DiaryPreviewCard({
  diaryText,
  mood,
  gratitudeCount,
  photosCount,
  highlightsCount,
  prompt,
  onOpen,
  onSave,
  isKidsMode,
  onShare,
}: DiaryPreviewCardProps) {
  const { t } = useTranslation()
  const [text, setText] = useState(diaryText)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sync local state when prop changes (e.g. after modal save or date navigation)
  useEffect(() => {
    setText(diaryText)
  }, [diaryText])

  // Auto-resize textarea to fit content
  const autoResize = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }, [])

  useEffect(() => {
    autoResize()
  }, [text, autoResize])

  const handleBlur = () => {
    if (text !== diaryText) {
      onSave(text)
    }
  }

  const hasEntry = stripHtml(diaryText).length > 0
  const words = wordCount(text)

  return (
    <div
      className={`rounded-3xl p-6 relative overflow-hidden ${
        hasEntry
          ? isKidsMode
            ? 'bg-white border-2 border-dayo-kids-yellow/30'
            : 'bg-white shadow-dayo'
          : isKidsMode
            ? 'bg-kids-gradient text-white'
            : 'bg-gradient-to-br from-violet-100 to-purple-50 text-dayo-gray-900'
      }`}
    >
      {/* Decorative elements for empty state */}
      {!hasEntry && (
        <>
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 ${
            isKidsMode ? 'bg-white/15' : 'bg-violet-200/40'
          }`} />
          <div className={`absolute bottom-0 left-0 w-16 h-16 rounded-full translate-y-1/3 -translate-x-1/3 ${
            isKidsMode ? 'bg-white/10' : 'bg-purple-200/30'
          }`} />
        </>
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {hasEntry && mood && <span className="text-xl">{mood}</span>}
            {!hasEntry && <Sparkles className={`w-5 h-5 ${isKidsMode ? 'text-white' : 'text-violet-500'}`} />}
            <span className={`text-sm font-semibold ${
              hasEntry
                ? isKidsMode ? 'text-dayo-kids-orange' : 'text-dayo-gray-900'
                : isKidsMode ? 'text-white/90' : 'text-violet-600'
            }`}>
              {isKidsMode
                ? hasEntry ? t('diary.title.kids') : t('diary.title.kidsAlt')
                : hasEntry ? t('diary.title.adult') : t('diary.title.adultAlt')}
            </span>
          </div>
          <button
            onClick={onOpen}
            className={`p-2 rounded-full transition-colors ${
              hasEntry
                ? isKidsMode
                  ? 'text-dayo-kids-orange/50 hover:bg-dayo-kids-yellow/20 hover:text-dayo-kids-orange'
                  : 'text-dayo-gray-300 hover:bg-dayo-gray-100 hover:text-dayo-gray-600'
                : isKidsMode
                  ? 'text-white/60 hover:bg-white/20 hover:text-white'
                  : 'text-violet-400 hover:bg-violet-200/50 hover:text-violet-600'
            }`}
            title={t('diary.openFull')}
          >
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          placeholder={prompt}
          rows={2}
          className={`w-full resize-none rounded-2xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 transition-colors ${
            hasEntry
              ? isKidsMode
                ? 'bg-dayo-kids-yellow/10 text-dayo-gray-900 placeholder:text-dayo-gray-400 focus:ring-dayo-kids-yellow/40'
                : 'bg-dayo-gray-50 text-dayo-gray-900 placeholder:text-dayo-gray-400 focus:ring-violet-300'
              : isKidsMode
                ? 'bg-white/30 text-white placeholder:text-white/50 focus:ring-white/40'
                : 'bg-white/80 text-dayo-gray-900 placeholder:text-dayo-gray-400 focus:ring-violet-300'
          }`}
        />

        {/* Metadata pills — only when there's an entry */}
        {hasEntry && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dayo-gray-100 text-dayo-gray-600 text-xs font-medium">
              <Pen className="w-3 h-3" />
              {t('diary.wordCount', { count: words })}
            </span>
            {gratitudeCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dayo-gray-100 text-dayo-gray-600 text-xs font-medium">
                <Heart className="w-3 h-3" />
                {t('diary.gratitudeCount', { count: gratitudeCount })}
              </span>
            )}
            {photosCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dayo-gray-100 text-dayo-gray-600 text-xs font-medium">
                <Camera className="w-3 h-3" />
                {t('diary.photoCount', { count: photosCount })}
              </span>
            )}
            {highlightsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dayo-gray-100 text-dayo-gray-600 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                {t('diary.highlightCount', { count: highlightsCount })}
              </span>
            )}
            {onShare && (
              <button
                onClick={(e) => { e.stopPropagation(); onShare() }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-dayo-purple/10 text-dayo-purple text-xs font-medium hover:bg-dayo-purple/20 transition-colors"
              >
                <Share2 className="w-3 h-3" />
                {t('actions.share')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
