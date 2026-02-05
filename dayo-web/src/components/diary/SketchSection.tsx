import { useState, useRef, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import SketchCanvas, { type SketchCanvasHandle } from './SketchCanvas'
import SketchToolbar from './SketchToolbar'
import { useProfileMode } from '../../hooks/useProfileMode'

interface SketchSectionProps {
  isOpen: boolean
  initialSketchUrl?: string | null  // Reserved for future use when loading existing sketches
  onSketchChange: (dataUrl: string | null) => void
  onClose: () => void
  mood?: string
}


export default function SketchSection({
  isOpen,
  initialSketchUrl: _initialSketchUrl, // Reserved for future use
  onSketchChange,
  onClose,
  mood,
}: SketchSectionProps) {
  const { isKidsMode } = useProfileMode()
  const canvasRef = useRef<SketchCanvasHandle>(null)

  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [strokeColor, setStrokeColor] = useState('#1F2937')
  const [strokeWidth, setStrokeWidth] = useState(4)
  const [hasStrokes, setHasStrokes] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Export and save sketch when section closes or periodically
  const exportAndSave = useCallback(async () => {
    if (!canvasRef.current || isExporting) return

    const pathsCount = canvasRef.current.getPathsCount()
    if (pathsCount === 0) {
      // No strokes, clear sketch
      onSketchChange(null)
      return
    }

    setIsExporting(true)
    try {
      const dataUrl = await canvasRef.current.exportImage()
      if (dataUrl) {
        onSketchChange(dataUrl)
      }
    } catch (error) {
      console.error('Failed to export sketch:', error)
    } finally {
      setIsExporting(false)
    }
  }, [onSketchChange, isExporting])

  // Auto-save when closing
  useEffect(() => {
    if (!isOpen && hasStrokes) {
      exportAndSave()
    }
  }, [isOpen, hasStrokes, exportAndSave])

  // Debounced auto-save while drawing
  useEffect(() => {
    if (!isOpen || !hasStrokes) return

    const timer = setTimeout(() => {
      exportAndSave()
    }, 2000) // Auto-save every 2 seconds of inactivity

    return () => clearTimeout(timer)
  }, [hasStrokes, isOpen, exportAndSave])

  const handlePathsChange = (count: number) => {
    setHasStrokes(count > 0)
  }

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas()
      setHasStrokes(false)
      onSketchChange(null)
    }
  }

  const handleUndo = () => {
    canvasRef.current?.undo()
    // Update paths count after undo
    setTimeout(() => {
      const count = canvasRef.current?.getPathsCount() || 0
      setHasStrokes(count > 0)
    }, 100)
  }

  if (!isOpen) return null

  return (
    <div
      className={`mt-4 rounded-2xl p-4 ${
        isKidsMode
          ? 'bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200'
          : 'bg-pink-50/50 border border-pink-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-sm font-medium ${
            isKidsMode ? 'text-pink-600' : 'text-pink-700'
          }`}
        >
          {isKidsMode ? '🎨 Draw your adventure!' : '✏️ Sketch your thoughts'}
        </span>
        <button
          type="button"
          onClick={() => {
            exportAndSave()
            onClose()
          }}
          className="p-1.5 text-pink-400 hover:text-pink-600 hover:bg-pink-100 rounded-lg transition-colors"
          aria-label="Close sketch"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <SketchCanvas
        ref={canvasRef}
        tool={tool}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        onPathsChange={handlePathsChange}
        mood={mood}
      />

      {/* Toolbar */}
      <SketchToolbar
        tool={tool}
        onToolChange={setTool}
        strokeColor={strokeColor}
        onColorChange={setStrokeColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        onUndo={handleUndo}
        onClear={handleClear}
        canUndo={hasStrokes}
      />

      {/* Saving indicator */}
      {isExporting && (
        <div className="mt-2 text-xs text-pink-500 text-center">
          Saving sketch...
        </div>
      )}
    </div>
  )
}
