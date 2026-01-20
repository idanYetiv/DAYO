import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, Save, Calendar, ImagePlus, Heart, Sparkles, X, Trash2, Loader2 } from 'lucide-react'
import { usePhotoUpload } from '../../hooks/usePhotoUpload'
import type { DiaryHighlight } from '../../hooks/useDiary'

interface DiaryEntryModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  initialMood?: string
  initialText?: string
  initialPhotos?: string[]
  initialGratitude?: string[]
  initialHighlights?: DiaryHighlight[]
  onSave: (data: {
    mood: string
    text: string
    gratitude: string[]
    highlights: DiaryHighlight[]
  }) => void
  isSaving?: boolean
}

const moods = [
  { id: 'amazing', emoji: '✨', label: 'Amazing' },
  { id: 'happy', emoji: '🥰', label: 'Happy' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'stressed', emoji: '😫', label: 'Stressed' },
]

const highlightEmojis = ['🎯', '💪', '🎉', '📚', '🏃', '🍽️', '💼', '❤️', '🌟', '✅']

export default function DiaryEntryModal({
  isOpen,
  onClose,
  date,
  initialMood = '',
  initialText = '',
  initialPhotos = [],
  initialGratitude = [],
  initialHighlights = [],
  onSave,
  isSaving = false,
}: DiaryEntryModalProps) {
  const [selectedMood, setSelectedMood] = useState(initialMood)
  const [diaryText, setDiaryText] = useState(initialText)
  const [gratitude, setGratitude] = useState<string[]>(initialGratitude)
  const [highlights, setHighlights] = useState<DiaryHighlight[]>(initialHighlights)
  const [activeSection, setActiveSection] = useState<'none' | 'gratitude' | 'highlights'>('none')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasInitialized = useRef(false)

  const dateStr = format(date, 'yyyy-MM-dd')
  const { uploadPhoto, deletePhoto, uploadProgress, maxPhotos } = usePhotoUpload(dateStr)

  // Initialize state only when modal opens
  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      setSelectedMood(initialMood)
      setDiaryText(initialText)
      setGratitude(initialGratitude.length > 0 ? initialGratitude : ['', '', ''])
      setHighlights(initialHighlights)
      setActiveSection('none')
      hasInitialized.current = true
    }
    if (!isOpen) {
      hasInitialized.current = false
    }
  }, [isOpen, initialMood, initialText, initialGratitude, initialHighlights])

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
    const filteredGratitude = gratitude.filter(g => g.trim())
    const filteredHighlights = highlights.filter(h => h.text.trim())
    onSave({
      mood: selectedMood,
      text: diaryText,
      gratitude: filteredGratitude,
      highlights: filteredHighlights,
    })
  }

  const handleClose = () => {
    onClose()
  }

  const handlePhotoSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadPhoto.mutate(file)
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeletePhoto = (photoUrl: string) => {
    deletePhoto.mutate(photoUrl)
  }

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitude = [...gratitude]
    newGratitude[index] = value
    setGratitude(newGratitude)
  }

  const handleAddHighlight = (emoji: string) => {
    if (highlights.length < 5) {
      setHighlights([...highlights, { emoji, text: '' }])
    }
  }

  const handleHighlightTextChange = (index: number, text: string) => {
    const newHighlights = [...highlights]
    newHighlights[index] = { ...newHighlights[index], text }
    setHighlights(newHighlights)
  }

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const toggleSection = (section: 'gratitude' | 'highlights') => {
    setActiveSection(activeSection === section ? 'none' : section)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dayo-gray-50">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={handleFileChange}
        className="hidden"
      />

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
        <div className="max-w-lg mx-auto space-y-4">
          {/* Photo Gallery */}
          {(initialPhotos.length > 0 || uploadProgress) && (
            <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4">
              <div className="flex items-center gap-2 text-dayo-gray-600 mb-3">
                <ImagePlus className="w-4 h-4" />
                <span className="text-sm font-medium">Photos ({initialPhotos.length}/{maxPhotos})</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {initialPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Diary photo ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {uploadProgress && (
                  <div className="w-20 h-20 bg-dayo-gray-100 rounded-xl flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-dayo-purple animate-spin" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diary Text Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 min-h-[200px] flex flex-col">
            <div className="flex items-center gap-2 text-dayo-gray-400 mb-4 flex-shrink-0">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{format(date, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <textarea
              ref={textareaRef}
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="Dear diary, today..."
              className="flex-1 w-full resize-none outline-none text-dayo-gray-700 placeholder-dayo-gray-300 text-base leading-relaxed min-h-[150px]"
            />
          </div>

          {/* Gratitude Section */}
          {activeSection === 'gratitude' && (
            <div className="bg-orange-50 rounded-2xl border border-orange-200 p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-4">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Today I'm grateful for...</span>
              </div>
              <div className="space-y-3">
                {gratitude.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-orange-400">{index + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleGratitudeChange(index, e.target.value)}
                      placeholder="I'm grateful for..."
                      className="flex-1 bg-white border border-orange-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights Section */}
          {activeSection === 'highlights' && (
            <div className="bg-purple-50 rounded-2xl border border-purple-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Today's Highlights</span>
                </div>
                <span className="text-xs text-purple-400">{highlights.length}/5</span>
              </div>

              {/* Emoji picker for new highlights */}
              {highlights.length < 5 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {highlightEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleAddHighlight(emoji)}
                      className="w-10 h-10 text-xl bg-white border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Highlight items */}
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xl">{highlight.emoji}</span>
                    <input
                      type="text"
                      value={highlight.text}
                      onChange={(e) => handleHighlightTextChange(index, e.target.value)}
                      placeholder="What happened?"
                      className="flex-1 bg-white border border-purple-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-purple-400 transition-colors"
                    />
                    <button
                      onClick={() => handleRemoveHighlight(index)}
                      className="p-2 text-purple-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {highlights.length === 0 && (
                <p className="text-center text-purple-400 text-sm py-4">
                  Tap an emoji above to add a highlight
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 bg-white px-4 py-4 border-t border-dayo-gray-100 safe-area-bottom">
        <div className="max-w-lg mx-auto flex items-center gap-3 overflow-x-auto">
          <button
            type="button"
            onClick={handlePhotoSelect}
            disabled={initialPhotos.length >= maxPhotos || uploadPhoto.isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dayo-gray-200 text-dayo-gray-600 hover:bg-dayo-gray-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadPhoto.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ImagePlus className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {initialPhotos.length > 0 ? `Photos (${initialPhotos.length})` : 'Add photo'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => toggleSection('gratitude')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors whitespace-nowrap ${
              activeSection === 'gratitude'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Gratitude</span>
            {gratitude.some(g => g.trim()) && activeSection !== 'gratitude' && (
              <span className="bg-orange-500 text-white text-xs px-1.5 rounded-full">
                {gratitude.filter(g => g.trim()).length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => toggleSection('highlights')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors whitespace-nowrap ${
              activeSection === 'highlights'
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-purple-50 text-purple-500 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Highlights</span>
            {highlights.length > 0 && activeSection !== 'highlights' && (
              <span className="bg-purple-500 text-white text-xs px-1.5 rounded-full">
                {highlights.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
