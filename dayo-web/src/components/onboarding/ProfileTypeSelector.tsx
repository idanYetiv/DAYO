import type { ProfileType } from '../../hooks/useProfileMode'

interface ProfileTypeSelectorProps {
  selectedType: ProfileType | null
  onSelect: (type: ProfileType) => void
}

const profileOptions: {
  type: ProfileType
  title: string
  subtitle: string
  emoji: string
  features: string[]
  gradient: string
  borderColor: string
}[] = [
  {
    type: 'adult',
    title: 'Adults',
    subtitle: 'Reflect on your journey',
    emoji: '✨',
    features: [
      'Calm, minimal design',
      'Thoughtful prompts',
      'Mood tracking with emojis',
      'Private journaling',
    ],
    gradient: 'from-dayo-purple to-dayo-pink',
    borderColor: 'border-dayo-purple',
  },
  {
    type: 'kid',
    title: 'Kids',
    subtitle: 'Adventure journal!',
    emoji: '🦁',
    features: [
      'Fun, colorful design',
      'Animal mood friends',
      'Exciting prompts',
      'Stickers & celebrations',
    ],
    gradient: 'from-dayo-kids-yellow to-dayo-kids-orange',
    borderColor: 'border-dayo-kids-orange',
  },
]

export default function ProfileTypeSelector({
  selectedType,
  onSelect,
}: ProfileTypeSelectorProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
      {profileOptions.map((option) => {
        const isSelected = selectedType === option.type

        return (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className={`
              relative p-6 rounded-3xl text-left transition-all duration-300
              ${isSelected
                ? `bg-gradient-to-br ${option.gradient} text-white shadow-xl scale-105`
                : 'bg-white border-2 border-dayo-gray-200 hover:border-dayo-gray-300 hover:shadow-lg'
              }
            `}
          >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-lg">✓</span>
              </div>
            )}

            {/* Emoji */}
            <div className={`text-5xl mb-4 ${isSelected ? 'animate-bounce-gentle' : ''}`}>
              {option.emoji}
            </div>

            {/* Title */}
            <h3 className={`text-2xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-dayo-gray-900'}`}>
              {option.title}
            </h3>

            {/* Subtitle */}
            <p className={`text-sm mb-4 ${isSelected ? 'text-white/80' : 'text-dayo-gray-500'}`}>
              {option.subtitle}
            </p>

            {/* Features */}
            <ul className="space-y-2">
              {option.features.map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    isSelected ? 'text-white/90' : 'text-dayo-gray-600'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-dayo-purple'}>•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        )
      })}
    </div>
  )
}
