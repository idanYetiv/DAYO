import { useState } from 'react'
import { Check, Trash2, Star } from 'lucide-react'

interface KidsTaskItemProps {
  id: string
  title: string
  completed: boolean
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

// Fun stickers for completed tasks
const completedStickers = ['⭐', '🌟', '✨', '🎉', '🏆', '💪', '🦁', '🚀']

export default function KidsTaskItem({
  id,
  title,
  completed,
  onToggle,
  onDelete,
}: KidsTaskItemProps) {
  const [showSticker, setShowSticker] = useState(false)
  const [sticker] = useState(() =>
    completedStickers[Math.floor(Math.random() * completedStickers.length)]
  )

  const handleToggle = () => {
    if (!completed) {
      setShowSticker(true)
      setTimeout(() => setShowSticker(false), 1500)
    }
    onToggle(id, completed)
  }

  return (
    <div
      className={`
        relative flex items-center gap-3 p-4 rounded-2xl
        transition-all duration-200 min-h-[64px]
        ${completed
          ? 'bg-dayo-kids-green/20 border-2 border-dayo-kids-green'
          : 'bg-white border-2 border-dayo-gray-200 hover:border-dayo-kids-yellow'
        }
      `}
    >
      {/* Checkbox - Large touch target */}
      <button
        onClick={handleToggle}
        className={`
          flex-shrink-0 w-10 h-10 rounded-xl
          flex items-center justify-center
          transition-all duration-200
          ${completed
            ? 'bg-dayo-kids-green text-white shadow-md'
            : 'bg-dayo-gray-100 hover:bg-dayo-kids-yellow/30 hover:scale-110'
          }
        `}
      >
        {completed ? (
          <Check className="w-6 h-6" />
        ) : (
          <div className="w-5 h-5 rounded-md border-2 border-dayo-gray-300" />
        )}
      </button>

      {/* Task title */}
      <span
        className={`
          flex-1 text-base font-medium
          ${completed ? 'text-dayo-gray-400 line-through' : 'text-dayo-gray-800'}
        `}
      >
        {title}
      </span>

      {/* Sticker for completed tasks */}
      {completed && (
        <span className="text-2xl">{sticker}</span>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(id)}
        className="
          flex-shrink-0 w-10 h-10 rounded-xl
          flex items-center justify-center
          text-dayo-gray-400 hover:text-red-500
          hover:bg-red-50 transition-colors
        "
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Celebration sticker animation */}
      {showSticker && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-5xl animate-pop">{sticker}</span>
        </div>
      )}
    </div>
  )
}

// Kids-friendly add task input
interface KidsAddTaskInputProps {
  onAddTask: (title: string) => void
  isLoading?: boolean
}

export function KidsAddTaskInput({ onAddTask, isLoading }: KidsAddTaskInputProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && !isLoading) {
      onAddTask(title.trim())
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new adventure..."
        className="
          flex-1 px-4 py-3 rounded-xl
          border-2 border-dayo-gray-200
          focus:border-dayo-kids-yellow focus:outline-none
          text-base placeholder-dayo-gray-400
          transition-colors
        "
      />
      <button
        type="submit"
        disabled={!title.trim() || isLoading}
        className="
          px-6 py-3 rounded-xl
          bg-kids-gradient text-white font-bold
          shadow-kids hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-transform flex items-center gap-2
        "
      >
        <Star className="w-5 h-5" />
        Add!
      </button>
    </form>
  )
}
