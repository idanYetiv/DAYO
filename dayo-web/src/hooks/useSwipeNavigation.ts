import { useState, useCallback, useRef } from 'react'

export type SwipeDirection = 'left' | 'right' | null

interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
}

interface UseSwipeNavigationOptions {
  /** Minimum horizontal distance to trigger swipe (default: 50px) */
  threshold?: number
  /** Maximum vertical distance before canceling swipe (default: 75px) */
  verticalCancelThreshold?: number
  /** Callback when swiping left (next day) */
  onSwipeLeft?: () => void
  /** Callback when swiping right (previous day) */
  onSwipeRight?: () => void
  /** Whether swipe navigation is enabled (default: true) */
  enabled?: boolean
}

interface UseSwipeNavigationReturn {
  /** Touch event handlers to spread on the container element */
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: (e: React.TouchEvent) => void
  }
  /** Whether a swipe is currently in progress */
  isSwiping: boolean
  /** Current swipe direction during swipe */
  swipeDirection: SwipeDirection
  /** Swipe progress as a value between -1 (right) and 1 (left) */
  swipeProgress: number
}

export function useSwipeNavigation({
  threshold = 50,
  verticalCancelThreshold = 75,
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
}: UseSwipeNavigationOptions = {}): UseSwipeNavigationReturn {
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null)
  const [swipeProgress, setSwipeProgress] = useState(0)

  const swipeState = useRef<SwipeState | null>(null)
  const isCanceled = useRef(false)

  const resetState = useCallback(() => {
    swipeState.current = null
    isCanceled.current = false
    setIsSwiping(false)
    setSwipeDirection(null)
    setSwipeProgress(0)
  }, [])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled) return

    const touch = e.touches[0]
    swipeState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
    }
    isCanceled.current = false
  }, [enabled])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!enabled || !swipeState.current || isCanceled.current) return

    const touch = e.touches[0]
    const { startX, startY } = swipeState.current

    swipeState.current.currentX = touch.clientX
    swipeState.current.currentY = touch.clientY

    const deltaX = touch.clientX - startX
    const deltaY = touch.clientY - startY
    const absDeltaY = Math.abs(deltaY)

    // Cancel if vertical scroll exceeds threshold
    if (absDeltaY > verticalCancelThreshold) {
      isCanceled.current = true
      resetState()
      return
    }

    const absDeltaX = Math.abs(deltaX)

    // Only start tracking swipe if horizontal movement is significant
    if (absDeltaX > 10) {
      setIsSwiping(true)

      // Calculate direction
      if (deltaX > 0) {
        setSwipeDirection('right')
      } else if (deltaX < 0) {
        setSwipeDirection('left')
      }

      // Calculate progress (-1 to 1, normalized by threshold)
      const normalizedProgress = Math.max(-1, Math.min(1, deltaX / threshold))
      setSwipeProgress(normalizedProgress)
    }
  }, [enabled, verticalCancelThreshold, threshold, resetState])

  const onTouchEnd = useCallback(() => {
    if (!enabled || !swipeState.current || isCanceled.current) {
      resetState()
      return
    }

    const { startX, currentX } = swipeState.current
    const deltaX = currentX - startX
    const absDeltaX = Math.abs(deltaX)

    // Check if swipe threshold was met
    if (absDeltaX >= threshold) {
      if (deltaX > 0 && onSwipeRight) {
        // Swiped right -> previous day
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        // Swiped left -> next day
        onSwipeLeft()
      }
    }

    resetState()
  }, [enabled, threshold, onSwipeLeft, onSwipeRight, resetState])

  return {
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
    isSwiping,
    swipeDirection,
    swipeProgress,
  }
}
