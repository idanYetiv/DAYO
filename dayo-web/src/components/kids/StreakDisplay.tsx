import { useState, useEffect } from 'react'
import { Flame } from 'lucide-react'
import { useHaptics } from '../../hooks/useHaptics'
import { kidsStreakCelebrations } from '../../data/encouragements'

interface StreakDisplayProps {
  streak: number
  showCelebration?: boolean
}

export default function StreakDisplay({ streak, showCelebration = false }: StreakDisplayProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const { impact } = useHaptics()

  useEffect(() => {
    if (showCelebration && streak > 0) {
      setIsAnimating(true)
      impact('heavy')
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [streak, showCelebration]) // eslint-disable-line react-hooks/exhaustive-deps

  // Get celebration message if streak hits a milestone
  const celebrationMessage = getCelebrationMessage(streak)

  return (
    <div className="relative">
      {/* Main streak badge */}
      <div
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-kids-gradient text-white font-bold
          shadow-kids transition-transform
          ${isAnimating ? 'animate-bounce-gentle scale-110' : ''}
        `}
      >
        <Flame className={`w-5 h-5 ${isAnimating ? 'animate-wiggle' : ''}`} />
        <span className="text-lg">{streak}</span>
        <span className="text-sm">day{streak !== 1 ? 's' : ''}!</span>

        {/* Sparkle effects when animating */}
        {isAnimating && (
          <>
            <span className="absolute -top-2 -left-2 text-xl animate-ping">⭐</span>
            <span className="absolute -top-1 -right-3 text-lg animate-ping delay-100">✨</span>
            <span className="absolute -bottom-2 left-1/2 text-xl animate-ping delay-200">🌟</span>
          </>
        )}
      </div>

      {/* Celebration message */}
      {celebrationMessage && showCelebration && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-lg border-2 border-dayo-kids-yellow animate-pop">
            <p className="text-xs font-bold text-dayo-kids-orange-dark">
              {celebrationMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function getCelebrationMessage(streak: number): string | null {
  // Check for exact milestones
  if (kidsStreakCelebrations[streak]) {
    return kidsStreakCelebrations[streak]
  }

  // Find the highest milestone achieved
  const milestones = Object.keys(kidsStreakCelebrations)
    .map(Number)
    .sort((a, b) => b - a)

  for (const milestone of milestones) {
    if (streak >= milestone) {
      return null // Only show message on exact milestone
    }
  }

  return null
}

// Confetti component for big celebrations
export function StreakConfetti() {
  const colors = ['#FCD34D', '#FB923C', '#F472B6', '#34D399', '#60A5FA', '#A78BFA']
  const confettiCount = 50

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const color = colors[i % colors.length]
        const left = Math.random() * 100
        const delay = Math.random() * 2
        const duration = 2 + Math.random() * 2

        return (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-sm animate-confetti"
            style={{
              backgroundColor: color,
              left: `${left}%`,
              top: '-20px',
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        )
      })}
    </div>
  )
}
