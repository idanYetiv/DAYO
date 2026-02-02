import { useState, useRef, useCallback, useEffect } from 'react'
import { getLocalWritingPrompt, type WritingCompanionContext } from '../lib/writingCompanion'
import { getWritingCompanionPrompt } from '../lib/openai'

interface UseWritingCompanionOptions {
  mood: string
  isKidsMode: boolean
  activeSection: string
  pauseDelay?: number
}

export function useWritingCompanion({
  mood,
  isKidsMode,
  activeSection,
  pauseDelay = 6000,
}: UseWritingCompanionOptions) {
  const [prompt, setPrompt] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textRef = useRef('')
  const wordCountRef = useRef(0)
  const modalOpenedRef = useRef(Date.now())

  // Reset on modal open
  useEffect(() => {
    modalOpenedRef.current = Date.now()
    setIsVisible(false)
    setIsDismissed(false)
    setPrompt('')
  }, [])

  const generatePrompt = useCallback(async () => {
    // Don't show in first 3 seconds after modal opens
    if (Date.now() - modalOpenedRef.current < 3000) return
    // Don't show in non-diary sections
    if (activeSection !== 'none') return

    const context: WritingCompanionContext = {
      mood: mood || 'okay',
      currentText: textRef.current,
      wordCount: wordCountRef.current,
      isKidsMode,
    }

    try {
      const newPrompt = await getWritingCompanionPrompt(context)
      setPrompt(newPrompt)
      setIsVisible(true)
      setIsDismissed(false)
    } catch {
      // Fallback to local prompt
      const fallback = getLocalWritingPrompt(context)
      setPrompt(fallback)
      setIsVisible(true)
      setIsDismissed(false)
    }
  }, [mood, isKidsMode, activeSection])

  const onTextChange = useCallback((text: string) => {
    textRef.current = text
    wordCountRef.current = text.trim().split(/\s+/).filter(Boolean).length

    // User is typing — hide companion and reset dismissed state
    setIsVisible(false)
    setIsDismissed(false)

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Set new pause detection timer
    timerRef.current = setTimeout(() => {
      generatePrompt()
    }, pauseDelay)
  }, [pauseDelay, generatePrompt])

  const dismiss = useCallback(() => {
    setIsVisible(false)
    setIsDismissed(true)
  }, [])

  const requestNewPrompt = useCallback(() => {
    generatePrompt()
  }, [generatePrompt])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    prompt,
    isVisible: isVisible && !isDismissed,
    onTextChange,
    dismiss,
    requestNewPrompt,
  }
}
