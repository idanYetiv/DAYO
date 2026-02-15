import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { format } from 'date-fns'
import { ArrowLeft, Save, Calendar, ImagePlus, Heart, Sparkles, Tag, X, Trash2, Loader2, Maximize2, Minimize2, Share2 } from 'lucide-react'
import { usePhotoUpload } from '../../hooks/usePhotoUpload'
import { useSketchUpload } from '../../hooks/useSketchUpload'
import { useNativeCamera } from '../../hooks/useNativeCamera'
import { useContentForMode } from '../../hooks/useContentForMode'
import { useProfileMode } from '../../hooks/useProfileMode'
import { useDirection } from '../../hooks/useDirection'
import { getTemplateById, isFrewriteTemplate, type DiaryTemplate } from '../../data/templates'
import { useDebouncedUpsertDayEntry } from '../../hooks/useDiary'
import TemplatedTextarea from './TemplatedTextarea'
import TagSelector from './TagSelector'
import WritingAtmosphere from './WritingAtmosphere'
import SaveIndicator from './SaveIndicator'
import WritingCompanion from './WritingCompanion'
import PhotoSourceSheet from './PhotoSourceSheet'
import DiaryExportModal from '../export/DiaryExportModal'
import { useHaptics } from '../../hooks/useHaptics'
import { useFocusMode } from '../../hooks/useFocusMode'
import { useWritingCompanion } from '../../hooks/useWritingCompanion'
import { stripToPlainText } from '../../lib/exportUtils'
import type { DiaryHighlight } from '../../hooks/useDiary'
import type { DiaryExportData } from '../../hooks/useExportImage'

const DiaryEditor = lazy(() => import('./DiaryEditor'))

interface DiaryEntryModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  initialMood?: string
  initialText?: string
  initialPhotos?: string[]
  initialGratitude?: string[]
  initialHighlights?: DiaryHighlight[]
  initialTags?: string[]
  initialSketchUrl?: string | null
  templateId?: string | null
  onSave: (data: {
    mood: string
    text: string
    gratitude: string[]
    highlights: DiaryHighlight[]
    tags: string[]
    sketchUrl?: string | null
    templateId?: string | null
  }) => void
  onChangeTemplate?: () => void
  isSaving?: boolean
}


export default function DiaryEntryModal({
  isOpen,
  onClose,
  date,
  initialMood = '',
  initialText = '',
  initialPhotos = [],
  initialGratitude = [],
  initialHighlights = [],
  initialTags = [],
  initialSketchUrl,
  templateId,
  onSave,
  onChangeTemplate,
  isSaving = false,
}: DiaryEntryModalProps) {
  const [selectedMood, setSelectedMood] = useState(initialMood)
  const [diaryText, setDiaryText] = useState(initialText)
  const [gratitude, setGratitude] = useState<string[]>(initialGratitude)
  const [highlights, setHighlights] = useState<DiaryHighlight[]>(initialHighlights)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [sketchDataUrl, setSketchDataUrl] = useState<string | null>(initialSketchUrl || null)
  const [activeSection, setActiveSection] = useState<'none' | 'gratitude' | 'highlights' | 'tags'>('none')
  const [showPhotoSheet, setShowPhotoSheet] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasInitialized = useRef(false)

  const activeTemplate: DiaryTemplate | undefined = templateId ? getTemplateById(templateId) : undefined
  const showTemplatedView = activeTemplate && !isFrewriteTemplate(activeTemplate.id)

  const dateStr = format(date, 'yyyy-MM-dd')
  const { uploadPhoto, deletePhoto, uploadProgress, maxPhotos } = usePhotoUpload(dateStr)
  const { uploadSketch, deleteSketch } = useSketchUpload(dateStr)
  const { moods, moodEmojis, diaryPrompts, gratitudePrompts, highlightEmojis } = useContentForMode()
  const { isKidsMode } = useProfileMode()
  const { isRTL } = useDirection()
  const { pickPhoto, isNative } = useNativeCamera()
  const { impact, notification } = useHaptics()

  // Focus mode
  const { isFocusMode, toggleFocusMode, exitFocusMode } = useFocusMode()

  // Auto-save
  const { debouncedUpsert, isLoading: isAutoSaving, error: autoSaveError, cleanup: cleanupAutoSave } = useDebouncedUpsertDayEntry(1500)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Writing companion
  const {
    prompt: companionPrompt,
    isVisible: companionVisible,
    onTextChange: companionOnTextChange,
    dismiss: dismissCompanion,
    requestNewPrompt,
  } = useWritingCompanion({
    mood: selectedMood,
    isKidsMode,
    activeSection,
  })

  // Initialize state only when modal opens
  useEffect(() => {
    if (isOpen && !hasInitialized.current) {
      setSelectedMood(initialMood)
      setDiaryText(initialText)
      setGratitude(initialGratitude.length > 0 ? initialGratitude : ['', '', ''])
      setHighlights(initialHighlights)
      setTags(initialTags)
      setSketchDataUrl(initialSketchUrl || null)
      setActiveSection('none')
      hasInitialized.current = true
    }
    if (!isOpen) {
      hasInitialized.current = false
    }
  }, [isOpen, initialMood, initialText, initialGratitude, initialHighlights, initialTags, initialSketchUrl])

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

  // Auto-save diary_text on changes
  useEffect(() => {
    if (!isOpen || !hasInitialized.current) return
    if (!diaryText && !initialText) return // skip empty initial state

    setSaveState('saving')
    debouncedUpsert({ date: dateStr, diaryText, mood: selectedMood || undefined })

    return () => { cleanupAutoSave() }
  }, [diaryText]) // eslint-disable-line react-hooks/exhaustive-deps

  // Track auto-save state
  useEffect(() => {
    if (isAutoSaving) {
      setSaveState('saving')
    } else if (autoSaveError) {
      setSaveState('error')
    } else if (saveState === 'saving' && !isAutoSaving) {
      setSaveState('saved')
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => setSaveState('idle'), 2000)
    }
  }, [isAutoSaving, autoSaveError]) // eslint-disable-line react-hooks/exhaustive-deps

  // Notify writing companion of text changes
  useEffect(() => {
    companionOnTextChange(diaryText)
  }, [diaryText]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  const handleSketchChange = async (dataUrl: string | null) => {
    setSketchDataUrl(dataUrl)
    // Auto-upload sketch to storage
    if (dataUrl) {
      uploadSketch.mutate(dataUrl)
    } else {
      deleteSketch.mutate()
    }
  }

  const handleSave = () => {
    cleanupAutoSave() // flush any pending auto-save
    const filteredGratitude = gratitude.filter(g => g.trim())
    const filteredHighlights = highlights.filter(h => h.text.trim())
    onSave({
      mood: selectedMood,
      text: diaryText,
      gratitude: filteredGratitude,
      sketchUrl: sketchDataUrl,
      highlights: filteredHighlights,
      tags,
      templateId: templateId || null,
    })
    exitFocusMode()
  }

  const handleClose = () => {
    cleanupAutoSave()
    exitFocusMode()
    onClose()
  }

  const handlePhotoSelect = () => {
    if (isNative) {
      setShowPhotoSheet(true)
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleNativePhoto = async (source: 'camera' | 'library') => {
    setShowPhotoSheet(false)
    try {
      const file = await pickPhoto(source)
      uploadPhoto.mutate(file)
    } catch {
      // User cancelled or camera error — no action needed
    }
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
    notification('warning')
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
    impact('light')
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const toggleSection = (section: 'gratitude' | 'highlights' | 'tags') => {
    setActiveSection(activeSection === section ? 'none' : section)
  }

  // Shared editor card for freewrite mode
  const editorCard = (
    <WritingAtmosphere mood={selectedMood}>
      <div className="bg-white rounded-2xl shadow-sm border border-dayo-gray-100 p-4 min-h-[300px] md:min-h-[400px] flex flex-col flex-grow relative z-10">
        <div className="flex items-center gap-2 text-dayo-gray-400 mb-4 flex-shrink-0">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{format(date, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-5 h-5 animate-spin text-dayo-gray-400" />
          </div>
        }>
          <DiaryEditor
            initialContent={diaryText}
            onChange={setDiaryText}
            placeholder={diaryPrompts.placeholder}
            sketchDataUrl={sketchDataUrl}
            onSketchChange={handleSketchChange}
            mood={selectedMood}
          />
        </Suspense>
      </div>
    </WritingAtmosphere>
  )

  // Focus mode view
  if (isFocusMode) {
    return (
      <div className="focus-mode-container" style={{ background: `var(--mood-bg, #F8FAFC)` }}>
        <WritingAtmosphere mood={selectedMood} fullscreen>
          <div className="focus-header safe-area-top">
            <button
              onClick={exitFocusMode}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-dayo-gray-600 hover:bg-white/50 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
              Exit Focus
            </button>
            <SaveIndicator state={saveState} />
            <button
              onClick={handleSave}
              disabled={isSaving}
              type="button"
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save & Close
            </button>
          </div>
          <div className="focus-editor">
            <div className="focus-editor-inner">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 min-h-[400px] flex flex-col">
                <Suspense fallback={
                  <div className="flex-1 flex items-center justify-center min-h-[150px]">
                    <Loader2 className="w-5 h-5 animate-spin text-dayo-gray-400" />
                  </div>
                }>
                  <DiaryEditor
                    initialContent={diaryText}
                    onChange={setDiaryText}
                    placeholder={diaryPrompts.placeholder}
                    sketchDataUrl={sketchDataUrl}
                    onSketchChange={handleSketchChange}
                    mood={selectedMood}
                  />
                </Suspense>
              </div>
              {/* Writing Companion in focus mode */}
              {companionVisible && activeSection === 'none' && (
                <WritingCompanion
                  prompt={companionPrompt}
                  mood={selectedMood}
                  isKidsMode={isKidsMode}
                  onDismiss={dismissCompanion}
                  onNewPrompt={requestNewPrompt}
                />
              )}
            </div>
          </div>
        </WritingAtmosphere>
      </div>
    )
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
          className="p-2 -ms-2 text-dayo-gray-600 hover:text-dayo-gray-900 transition-colors"
          type="button"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rtl-flip' : ''}`} />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="font-semibold text-dayo-gray-900">{format(date, 'EEEE')}</p>
            <p className="text-xs text-dayo-gray-500">{format(date, 'MMMM d, yyyy')}</p>
          </div>
          <SaveIndicator state={saveState} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFocusMode}
            type="button"
            className="p-2 text-dayo-gray-500 hover:text-dayo-gray-700 transition-colors"
            aria-label="Toggle focus mode"
            title="Focus mode (Ctrl+Shift+F)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          {stripToPlainText(diaryText).length > 0 && (
            <button
              onClick={() => setShowExportModal(true)}
              type="button"
              className="p-2 text-dayo-gray-500 hover:text-dayo-purple transition-colors"
              aria-label="Share diary entry"
              title="Share diary entry"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            type="button"
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save & Close'}
          </button>
        </div>
      </header>

      {/* Mood Selector */}
      <div className={`flex-shrink-0 px-4 py-4 border-b ${isKidsMode ? 'bg-dayo-kids-yellow/10 border-dayo-kids-yellow/30' : 'bg-white border-dayo-gray-100'}`}>
        <div className="max-w-lg mx-auto flex justify-center gap-2 flex-wrap">
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.id
            return (
              <button
                key={mood.id}
                onClick={() => { setSelectedMood(mood.id); impact('light') }}
                type="button"
                className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
                  isKidsMode ? 'min-w-[70px]' : ''
                } ${
                  isSelected
                    ? isKidsMode
                      ? 'bg-kids-gradient text-white shadow-kids scale-105'
                      : 'bg-emerald-500 text-white shadow-md'
                    : isKidsMode
                      ? 'text-dayo-gray-600 hover:bg-dayo-kids-yellow/30 hover:scale-105'
                      : 'text-dayo-gray-600 hover:bg-dayo-gray-100'
                }`}
              >
                <span className={`mb-1 ${isKidsMode ? 'text-3xl' : 'text-2xl'}`}>{mood.emoji}</span>
                <span className={`font-medium ${isKidsMode ? 'text-[10px]' : 'text-xs'} ${isSelected ? 'text-white' : 'text-dayo-gray-500'}`}>
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

          {/* Diary Text Area / Templated View */}
          {showTemplatedView ? (
            <TemplatedTextarea
              template={activeTemplate}
              initialText={initialText}
              onChange={setDiaryText}
              onChangeTemplate={onChangeTemplate || (() => {})}
            />
          ) : (
            editorCard
          )}

          {/* Writing Companion */}
          {companionVisible && activeSection === 'none' && (
            <WritingCompanion
              prompt={companionPrompt}
              mood={selectedMood}
              isKidsMode={isKidsMode}
              onDismiss={dismissCompanion}
              onNewPrompt={requestNewPrompt}
            />
          )}

          {/* Gratitude Section */}
          {activeSection === 'gratitude' && (
            <div className={`rounded-2xl border p-4 ${isKidsMode ? 'bg-dayo-kids-yellow/20 border-dayo-kids-yellow' : 'bg-orange-50 border-orange-200'}`}>
              <div className={`flex items-center gap-2 mb-4 ${isKidsMode ? 'text-dayo-kids-orange-dark' : 'text-orange-600'}`}>
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{gratitudePrompts[0]}</span>
              </div>
              <div className="space-y-3">
                {gratitude.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={isKidsMode ? 'text-dayo-kids-orange' : 'text-orange-400'}>{index + 1}.</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleGratitudeChange(index, e.target.value)}
                      placeholder={gratitudePrompts[index] || gratitudePrompts[0]}
                      className={`flex-1 bg-white border rounded-xl px-3 py-2 text-sm outline-none transition-colors ${
                        isKidsMode
                          ? 'border-dayo-kids-yellow focus:border-dayo-kids-orange'
                          : 'border-orange-200 focus:border-orange-400'
                      }`}
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

          {/* Tags Section */}
          {activeSection === 'tags' && (
            <TagSelector
              selectedTags={tags}
              onChange={setTags}
            />
          )}
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 bg-white px-4 py-3 border-t border-dayo-gray-100 safe-area-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handlePhotoSelect}
            disabled={initialPhotos.length >= maxPhotos || uploadPhoto.isPending}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dayo-gray-200 text-dayo-gray-600 hover:bg-dayo-gray-50 transition-colors whitespace-nowrap text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadPhoto.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ImagePlus className="w-3.5 h-3.5" />
            )}
            {initialPhotos.length > 0 ? `${initialPhotos.length}` : 'Photo'}
          </button>
          <button
            type="button"
            onClick={() => toggleSection('gratitude')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors whitespace-nowrap text-xs font-medium ${
              activeSection === 'gratitude'
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-orange-50 text-orange-500 border-orange-200 hover:bg-orange-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Gratitude
            {gratitude.some(g => g.trim()) && activeSection !== 'gratitude' && (
              <span className="bg-orange-500 text-white text-[10px] px-1 rounded-full leading-tight">
                {gratitude.filter(g => g.trim()).length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => toggleSection('highlights')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors whitespace-nowrap text-xs font-medium ${
              activeSection === 'highlights'
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-purple-50 text-purple-500 border-purple-200 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Highlights
            {highlights.length > 0 && activeSection !== 'highlights' && (
              <span className="bg-purple-500 text-white text-[10px] px-1 rounded-full leading-tight">
                {highlights.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => toggleSection('tags')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-colors whitespace-nowrap text-xs font-medium ${
              activeSection === 'tags'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            Tags
            {tags.length > 0 && activeSection !== 'tags' && (
              <span className="bg-blue-500 text-white text-[10px] px-1 rounded-full leading-tight">
                {tags.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Native Photo Source Sheet */}
      {showPhotoSheet && (
        <PhotoSourceSheet
          onSelect={handleNativePhoto}
          onClose={() => setShowPhotoSheet(false)}
        />
      )}

      {/* Diary Export Modal */}
      {showExportModal && (
        <DiaryExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={{
            date: dateStr,
            dayOfWeek: format(date, 'EEEE'),
            mood: selectedMood || 'okay',
            moodEmoji: moodEmojis[selectedMood] || '😊',
            diaryText: stripToPlainText(diaryText),
            gratitude: gratitude.filter(g => g.trim()),
            highlights: highlights.filter(h => h.text.trim()),
            tags,
          } satisfies DiaryExportData}
        />
      )}
    </div>
  )
}
