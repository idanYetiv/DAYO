import { useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { ReactSketchCanvas, type ReactSketchCanvasRef } from 'react-sketch-canvas'
import { useProfileMode } from '../../hooks/useProfileMode'

export interface SketchCanvasHandle {
  exportImage: () => Promise<string>
  clearCanvas: () => void
  undo: () => void
  loadPaths: (dataUrl: string) => Promise<void>
  getPathsCount: () => number
}

interface SketchCanvasProps {
  tool: 'pen' | 'eraser'
  strokeColor: string
  strokeWidth: number
  onPathsChange?: (count: number) => void
  mood?: string
}

const SketchCanvas = forwardRef<SketchCanvasHandle, SketchCanvasProps>(
  ({ tool, strokeColor, strokeWidth, onPathsChange, mood }, ref) => {
    const canvasRef = useRef<ReactSketchCanvasRef>(null)
    const { isKidsMode } = useProfileMode()
    const [pathsCount, setPathsCount] = useState(0)

    // Get mood-based background tint
    const getMoodBackground = () => {
      if (!mood) return isKidsMode ? '#FEF9E7' : '#FFF5F5'

      const moodColors: Record<string, string> = {
        amazing: '#FFFBEB',
        happy: '#ECFDF5',
        okay: '#EFF6FF',
        sad: '#EEF2FF',
        stressed: '#FEF2F2',
        tired: '#FAF5FF',
        // Kids moods
        awesome: '#FFFBEB',
        good: '#ECFDF5',
        meh: '#EFF6FF',
        grumpy: '#FEF2F2',
        sleepy: '#FAF5FF',
      }

      return moodColors[mood] || (isKidsMode ? '#FEF9E7' : '#FFF5F5')
    }

    useImperativeHandle(ref, () => ({
      exportImage: async () => {
        if (!canvasRef.current) return ''
        const dataUrl = await canvasRef.current.exportImage('png')
        return dataUrl
      },
      clearCanvas: () => {
        canvasRef.current?.clearCanvas()
        setPathsCount(0)
        onPathsChange?.(0)
      },
      undo: () => {
        canvasRef.current?.undo()
      },
      loadPaths: async () => {
        // react-sketch-canvas doesn't support loading from image directly
        // We'll handle this by storing paths in localStorage as backup
        // For now, just clear and let user redraw
        console.log('Load paths not fully supported yet')
      },
      getPathsCount: () => pathsCount,
    }))

    // Track when strokes change
    const handleStroke = () => {
      // Small delay to ensure paths are updated
      setTimeout(async () => {
        if (canvasRef.current) {
          const paths = await canvasRef.current.exportPaths()
          const count = paths.length
          setPathsCount(count)
          onPathsChange?.(count)
        }
      }, 50)
    }

    return (
      <div
        className={`relative rounded-xl overflow-hidden ${
          isKidsMode
            ? 'border-4 border-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 p-[3px]'
            : 'border border-pink-200'
        }`}
      >
        <div className={`${isKidsMode ? 'rounded-lg overflow-hidden' : ''}`}>
          <ReactSketchCanvas
            ref={canvasRef}
            width="100%"
            height="250px"
            strokeWidth={strokeWidth}
            strokeColor={tool === 'eraser' ? getMoodBackground() : strokeColor}
            canvasColor={getMoodBackground()}
            style={{
              borderRadius: isKidsMode ? '0.5rem' : '0.75rem',
            }}
            onStroke={handleStroke}
          />
        </div>
      </div>
    )
  }
)

SketchCanvas.displayName = 'SketchCanvas'

export default SketchCanvas
