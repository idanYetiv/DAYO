import { useEffect, useState } from 'react'
import { X, Sparkles } from 'lucide-react'

interface DailyInsightToastProps {
  insight: string
  moodEmoji?: string
  isKidsMode?: boolean
  onClose: () => void
}

export default function DailyInsightToast({
  insight,
  moodEmoji,
  isKidsMode = false,
  onClose,
}: DailyInsightToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 6000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 z-50 flex justify-center transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`max-w-md w-full rounded-2xl shadow-lg border backdrop-blur-sm p-4 ${
          isKidsMode
            ? 'bg-gradient-to-r from-dayo-kids-yellow/95 to-dayo-kids-orange/95 border-dayo-kids-orange/30'
            : 'bg-white/95 border-dayo-gray-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Icon/Emoji */}
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              isKidsMode
                ? 'bg-white/50'
                : 'bg-purple-100'
            }`}
          >
            {moodEmoji || (isKidsMode ? '✨' : <Sparkles className="w-5 h-5 text-purple-500" />)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm leading-relaxed ${
                isKidsMode
                  ? 'text-dayo-kids-orange-dark font-medium'
                  : 'text-dayo-gray-700'
              }`}
            >
              {insight}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={`flex-shrink-0 p-1 rounded-full transition-colors ${
              isKidsMode
                ? 'text-dayo-kids-orange-dark/50 hover:text-dayo-kids-orange-dark hover:bg-white/30'
                : 'text-dayo-gray-400 hover:text-dayo-gray-600 hover:bg-dayo-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar for auto-dismiss */}
        <div
          className={`mt-3 h-1 rounded-full overflow-hidden ${
            isKidsMode ? 'bg-white/30' : 'bg-dayo-gray-100'
          }`}
        >
          <div
            className={`h-full rounded-full animate-shrink ${
              isKidsMode
                ? 'bg-white/70'
                : 'bg-purple-400'
            }`}
            style={{
              animationDuration: '6s',
              animationTimingFunction: 'linear',
            }}
          />
        </div>

        {/* Animation styles */}
        <style>{`
          @keyframes shrink {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
          .animate-shrink {
            animation: shrink 6s linear forwards;
          }
        `}</style>
      </div>
    </div>
  )
}
