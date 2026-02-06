import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSwipeNavigation } from '../../../hooks/useSwipeNavigation'

describe('useSwipeNavigation Hook', () => {
  const createTouchEvent = (clientX: number, clientY: number) => ({
    touches: [{ clientX, clientY }],
  } as unknown as React.TouchEvent)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSwipeNavigation())

    expect(result.current.isSwiping).toBe(false)
    expect(result.current.swipeDirection).toBe(null)
    expect(result.current.swipeProgress).toBe(0)
    expect(result.current.handlers).toBeDefined()
    expect(result.current.handlers.onTouchStart).toBeDefined()
    expect(result.current.handlers.onTouchMove).toBeDefined()
    expect(result.current.handlers.onTouchEnd).toBeDefined()
  })

  it('should detect swipe right and call onSwipeRight', () => {
    const onSwipeRight = vi.fn()
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipeRight, threshold: 50 })
    )

    // Start touch
    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100, 100))
    })

    // Move right (swipe right)
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(160, 100))
    })

    expect(result.current.isSwiping).toBe(true)
    expect(result.current.swipeDirection).toBe('right')

    // End touch
    act(() => {
      result.current.handlers.onTouchEnd(createTouchEvent(160, 100))
    })

    expect(onSwipeRight).toHaveBeenCalledTimes(1)
    expect(result.current.isSwiping).toBe(false)
  })

  it('should detect swipe left and call onSwipeLeft', () => {
    const onSwipeLeft = vi.fn()
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipeLeft, threshold: 50 })
    )

    // Start touch
    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(200, 100))
    })

    // Move left (swipe left)
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(140, 100))
    })

    expect(result.current.isSwiping).toBe(true)
    expect(result.current.swipeDirection).toBe('left')

    // End touch
    act(() => {
      result.current.handlers.onTouchEnd(createTouchEvent(140, 100))
    })

    expect(onSwipeLeft).toHaveBeenCalledTimes(1)
  })

  it('should not trigger swipe if below threshold', () => {
    const onSwipeRight = vi.fn()
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipeRight, threshold: 50 })
    )

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100, 100))
    })

    // Move less than threshold
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(130, 100))
    })

    act(() => {
      result.current.handlers.onTouchEnd(createTouchEvent(130, 100))
    })

    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('should cancel swipe if vertical movement exceeds threshold', () => {
    const onSwipeRight = vi.fn()
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipeRight, verticalCancelThreshold: 75 })
    )

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100, 100))
    })

    // Move with excessive vertical movement
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(200, 200))
    })

    expect(result.current.isSwiping).toBe(false)

    act(() => {
      result.current.handlers.onTouchEnd(createTouchEvent(200, 200))
    })

    expect(onSwipeRight).not.toHaveBeenCalled()
  })

  it('should not trigger when disabled', () => {
    const onSwipeRight = vi.fn()
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipeRight, enabled: false })
    )

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100, 100))
    })

    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(200, 100))
    })

    act(() => {
      result.current.handlers.onTouchEnd(createTouchEvent(200, 100))
    })

    expect(onSwipeRight).not.toHaveBeenCalled()
    expect(result.current.isSwiping).toBe(false)
  })

  it('should calculate swipe progress correctly', () => {
    const { result } = renderHook(() =>
      useSwipeNavigation({ threshold: 100 })
    )

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100, 100))
    })

    // Move 50px right (50% progress)
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(150, 100))
    })

    expect(result.current.swipeProgress).toBe(0.5)

    // Move to 100% (at threshold)
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(200, 100))
    })

    expect(result.current.swipeProgress).toBe(1)

    // Progress should cap at 1
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(250, 100))
    })

    expect(result.current.swipeProgress).toBe(1)
  })
})
