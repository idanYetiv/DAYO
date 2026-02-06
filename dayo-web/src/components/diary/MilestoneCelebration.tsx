import { useEffect, useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import type { MilestoneInfo } from '../../hooks/useDiaryMilestones'

interface MilestoneCelebrationProps {
  milestone: MilestoneInfo
  message: string
  isKidsMode?: boolean
  onClose: () => void
}

export default function MilestoneCelebration({
  milestone,
  message,
  isKidsMode = false,
  onClose,
}: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  // Generate confetti particles
  useEffect(() => {
    const colors = isKidsMode
      ? ['#FB923C', '#FCD34D', '#34D399', '#60A5FA', '#F472B6']
      : ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']

    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setConfetti(particles)

    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true))
  }, [isKidsMode])

  // Auto-close after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 8000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full animate-confetti"
            style={{
              left: `${particle.left}%`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header gradient */}
        <div
          className={`h-32 flex items-center justify-center ${
            isKidsMode
              ? 'bg-gradient-to-br from-dayo-kids-orange via-dayo-kids-yellow to-dayo-kids-green'
              : 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400'
          }`}
        >
          <div className="relative">
            <span className="text-6xl animate-bounce-slow">{milestone.emoji}</span>
            <Sparkles
              className={`absolute -top-2 -right-2 w-6 h-6 animate-pulse ${
                isKidsMode ? 'text-white' : 'text-yellow-300'
              }`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2
            className={`text-2xl font-bold mb-2 ${
              isKidsMode ? 'text-dayo-kids-orange-dark' : 'text-gray-900'
            }`}
          >
            {milestone.title}
          </h2>
          <p className="text-gray-500 text-sm mb-4">{milestone.description}</p>
          <p
            className={`text-base leading-relaxed ${
              isKidsMode ? 'text-gray-700 font-medium' : 'text-gray-600'
            }`}
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={handleClose}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
              isKidsMode
                ? 'bg-gradient-to-r from-dayo-kids-orange to-dayo-kids-yellow hover:shadow-lg'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg'
            }`}
          >
            {isKidsMode ? 'Yay! Keep Writing!' : 'Keep Writing'}
          </button>
        </div>
      </div>

      {/* Confetti animation styles */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall 4s ease-in-out forwards;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
