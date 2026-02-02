import { Sparkles, X, RefreshCw } from 'lucide-react'
import { getMoodAtmosphere } from '../../lib/moodAtmosphere'

interface WritingCompanionProps {
  prompt: string
  mood: string
  isKidsMode: boolean
  onDismiss: () => void
  onNewPrompt: () => void
}

export default function WritingCompanion({
  prompt,
  mood,
  isKidsMode,
  onDismiss,
  onNewPrompt,
}: WritingCompanionProps) {
  const atmosphere = getMoodAtmosphere(mood || null, isKidsMode)

  if (!prompt) return null

  return (
    <div
      className="writing-companion"
      role="complementary"
      aria-live="polite"
      aria-label="Writing companion suggestion"
    >
      <div
        className={`rounded-2xl border p-4 ${
          isKidsMode
            ? 'bg-dayo-kids-yellow/10 border-dayo-kids-yellow/40'
            : 'bg-white border-dayo-gray-100'
        }`}
        style={{ borderLeftWidth: '3px', borderLeftColor: atmosphere.accentColor }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${atmosphere.accentColor}15` }}
          >
            <Sparkles
              className="w-4 h-4"
              style={{ color: atmosphere.accentColor }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className={`leading-relaxed ${
              isKidsMode
                ? 'text-sm text-dayo-gray-700'
                : 'text-sm text-dayo-gray-600'
            }`}>
              {prompt}
            </p>

            <button
              onClick={onNewPrompt}
              className={`mt-2 flex items-center gap-1 text-xs font-medium transition-colors ${
                isKidsMode
                  ? 'text-dayo-kids-orange hover:text-dayo-kids-orange-dark'
                  : 'text-dayo-purple hover:text-dayo-purple-dark'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              New prompt
            </button>
          </div>

          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 text-dayo-gray-400 hover:text-dayo-gray-600 transition-colors"
            aria-label="Dismiss writing companion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
