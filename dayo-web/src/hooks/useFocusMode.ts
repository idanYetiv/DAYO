import { useState, useEffect, useCallback } from 'react'

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false)

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => !prev)
  }, [])

  const exitFocusMode = useCallback(() => {
    setIsFocusMode(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+Shift+F to toggle
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        toggleFocusMode()
      }
      // Escape to exit
      if (e.key === 'Escape' && isFocusMode) {
        e.preventDefault()
        exitFocusMode()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFocusMode, toggleFocusMode, exitFocusMode])

  return { isFocusMode, toggleFocusMode, exitFocusMode }
}
