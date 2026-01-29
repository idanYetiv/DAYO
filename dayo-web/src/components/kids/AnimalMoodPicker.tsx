import { kidsMoods, type MoodOption } from '../../data/moods'

interface AnimalMoodPickerProps {
  selectedMood: string
  onSelectMood: (moodId: string) => void
}

export default function AnimalMoodPicker({ selectedMood, onSelectMood }: AnimalMoodPickerProps) {
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {kidsMoods.map((mood) => (
        <AnimalMoodButton
          key={mood.id}
          mood={mood}
          isSelected={selectedMood === mood.id}
          onClick={() => onSelectMood(mood.id)}
        />
      ))}
    </div>
  )
}

interface AnimalMoodButtonProps {
  mood: MoodOption
  isSelected: boolean
  onClick: () => void
}

function AnimalMoodButton({ mood, isSelected, onClick }: AnimalMoodButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`
        relative flex flex-col items-center justify-center
        w-20 h-24 rounded-2xl transition-all duration-200
        ${isSelected
          ? 'bg-kids-gradient shadow-kids scale-110 -translate-y-1'
          : 'bg-white border-2 border-dayo-gray-200 hover:border-dayo-kids-yellow hover:scale-105'
        }
      `}
      style={{
        boxShadow: isSelected ? `0 4px 0 ${mood.color}, 0 8px 20px -4px ${mood.color}40` : undefined,
      }}
    >
      {/* Animal emoji */}
      <span className={`text-4xl mb-1 ${isSelected ? 'animate-bounce-gentle' : ''}`}>
        {mood.emoji}
      </span>

      {/* Label */}
      <span className={`text-[10px] font-bold text-center px-1 leading-tight ${
        isSelected ? 'text-white' : 'text-dayo-gray-600'
      }`}>
        {mood.label}
      </span>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md animate-pop">
          <span className="text-sm">✓</span>
        </div>
      )}
    </button>
  )
}
