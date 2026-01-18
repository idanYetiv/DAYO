import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, Save, Calendar, ImagePlus, Heart, Sparkles } from 'lucide-react'

interface DiaryEntryModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  initialMood?: string
  initialText?: string
  onSave: (data: { mood: string; text: string }) => void
  isSaving?: boolean
}

const moods = [
  { id: 'amazing', emoji: '✨', label: 'Amazing' },
  { id: 'happy', emoji: '🥰', label: 'Happy' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'stressed', emoji: '😫', label: 'Stressed' },
]

export default function DiaryEntryModal({
  isOpen,
  onClose,
  date,
  initialMood = '',
  initialText = '',
  onSave,
  isSaving = false,
}: DiaryEntryModalProps) {
  const [selectedMood, setSelectedMood] = useState(initialMood)
  const [diaryText, setDiaryText] = useState(initialText)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasInitialized = useRef(false)

  // Initialize state only when modal opens
  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      setSelectedMood(initialMood)
      setDiaryText(initialText)
      hasInitialized.current = true
    }
    if (!isOpen) {
      hasInitialized.current = false
    }
  }, [isOpen, initialMood, initialText])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    onSave({ mood: selectedMood, text: diaryText })
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dayo-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white px-4 py-3 flex items-center justify-between border-b border-dayo-gray-100 safe-area-top">
        <button
          onClick={handleClose}
          className="p-2 -ml-2 text-dayo-gray-600 hover:text-dayo-gray-900 transition-colors"
          type="button"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="font-semibold text-dayo-gray-900">{format(date, 'EEEE')}</p>
          <p className="text-xs text-dayo-gray-500">{format(date, 'MMMM d, yyyy')}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          type="button"
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </header>

      {/* Mood Selector */}
      <div className="flex-shrink-0 bg-white px-4 py-4 border-b border-dayo-gray-100">
        <div className="max-w-lg mx-auto flex justify-center gap-2">
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.id
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                type="button"
                className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-dayo-gray-600 hover:bg-dayo-gray-100'
                }`}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-dayo-gray-500'}`}>
                  {mood.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-lg mx-auto h-full">
          <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 min-h-[300px] h-full flex flex-col">
            {/* Date Header */}
            <div className="flex items-center gap-2 text-dayo-gray-400 mb-4 flex-shrink-0">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{format(date, 'EEEE, MMMM d, yyyy')}</span>
            </div>

            {/* Text Area */}
            <textarea
              ref={textareaRef}
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="Dear diary, today..."
              className="flex-1 w-full resize-none outline-none text-dayo-gray-700 placeholder-dayo-gray-300 text-base leading-relaxed min-h-[200px]"
            />
          </div>
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 bg-white px-4 py-4 border-t border-dayo-gray-100 safe-area-bottom">
        <div className="max-w-lg mx-auto flex items-center gap-3 overflow-x-auto">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dayo-gray-200 text-dayo-gray-600 hover:bg-dayo-gray-50 transition-colors whitespace-nowrap"
          >
            <ImagePlus className="w-4 h-4" />
            <span className="text-sm font-medium">Add photo</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100 transition-colors whitespace-nowrap"
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Gratitude</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 text-purple-500 border border-purple-200 hover:bg-purple-100 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Highlights</span>
          </button>
        </div>
      </div>
    </div>
  )
}
