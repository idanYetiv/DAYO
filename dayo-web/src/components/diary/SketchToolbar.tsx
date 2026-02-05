import { Undo2, Trash2, Pencil, Eraser } from 'lucide-react'
import { useProfileMode } from '../../hooks/useProfileMode'

interface SketchToolbarProps {
  tool: 'pen' | 'eraser'
  onToolChange: (tool: 'pen' | 'eraser') => void
  strokeColor: string
  onColorChange: (color: string) => void
  strokeWidth: number
  onStrokeWidthChange: (width: number) => void
  onUndo: () => void
  onClear: () => void
  canUndo: boolean
}

const COLORS = [
  { id: 'black', value: '#1F2937', label: 'Black' },
  { id: 'white', value: '#F9FAFB', label: 'White' },
  { id: 'red', value: '#EF4444', label: 'Red' },
  { id: 'orange', value: '#F97316', label: 'Orange' },
  { id: 'yellow', value: '#EAB308', label: 'Yellow' },
  { id: 'green', value: '#22C55E', label: 'Green' },
  { id: 'blue', value: '#3B82F6', label: 'Blue' },
  { id: 'purple', value: '#8B5CF6', label: 'Purple' },
]

const KIDS_COLORS = [
  { id: 'red', value: '#EF4444', label: 'Red' },
  { id: 'orange', value: '#F97316', label: 'Orange' },
  { id: 'yellow', value: '#EAB308', label: 'Yellow' },
  { id: 'green', value: '#22C55E', label: 'Green' },
  { id: 'blue', value: '#3B82F6', label: 'Blue' },
  { id: 'purple', value: '#8B5CF6', label: 'Purple' },
  { id: 'pink', value: '#EC4899', label: 'Pink' },
  { id: 'black', value: '#1F2937', label: 'Black' },
]

const STROKE_WIDTHS = [
  { value: 2, label: 'S' },
  { value: 4, label: 'M' },
  { value: 8, label: 'L' },
  { value: 16, label: 'XL' },
]

const KIDS_STROKE_WIDTHS = [
  { value: 4, label: 'Small' },
  { value: 8, label: 'Medium' },
  { value: 16, label: 'BIG!' },
]

export default function SketchToolbar({
  tool,
  onToolChange,
  strokeColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  onUndo,
  onClear,
  canUndo,
}: SketchToolbarProps) {
  const { isKidsMode } = useProfileMode()
  const colors = isKidsMode ? KIDS_COLORS : COLORS
  const strokeWidths = isKidsMode ? KIDS_STROKE_WIDTHS : STROKE_WIDTHS

  return (
    <div className={`flex flex-wrap items-center gap-3 mt-3 ${isKidsMode ? 'gap-4' : ''}`}>
      {/* Tool Toggle */}
      <div className="flex gap-1 bg-white rounded-lg p-1 border border-pink-200">
        <button
          type="button"
          onClick={() => onToolChange('pen')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tool === 'pen'
              ? 'bg-pink-500 text-white'
              : 'text-pink-600 hover:bg-pink-50'
          }`}
          aria-label={isKidsMode ? 'Crayon' : 'Pen'}
        >
          <Pencil className="w-4 h-4" />
          {isKidsMode ? 'Crayon' : 'Pen'}
        </button>
        <button
          type="button"
          onClick={() => onToolChange('eraser')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tool === 'eraser'
              ? 'bg-pink-500 text-white'
              : 'text-pink-600 hover:bg-pink-50'
          }`}
          aria-label={isKidsMode ? 'Magic Eraser' : 'Eraser'}
        >
          <Eraser className="w-4 h-4" />
          {isKidsMode ? 'Magic' : 'Eraser'}
        </button>
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-pink-200" />

      {/* Color Palette */}
      <div className="flex gap-1.5">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`rounded-full transition-all ${
              isKidsMode ? 'w-8 h-8' : 'w-6 h-6'
            } ${
              strokeColor === color.value
                ? 'ring-2 ring-pink-500 ring-offset-2 scale-110'
                : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: color.value,
              border: color.id === 'white' ? '1px solid #E5E7EB' : 'none',
            }}
            aria-label={color.label}
            title={color.label}
          />
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-pink-200" />

      {/* Stroke Width */}
      <div className="flex gap-1">
        {strokeWidths.map((size) => (
          <button
            key={size.value}
            type="button"
            onClick={() => onStrokeWidthChange(size.value)}
            className={`flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
              isKidsMode ? 'px-3 py-1.5' : 'px-2 py-1'
            } ${
              strokeWidth === size.value
                ? 'bg-pink-100 text-pink-700 ring-1 ring-pink-300'
                : 'text-pink-500 hover:bg-pink-50'
            }`}
            aria-label={`Brush size ${size.label}`}
          >
            {size.label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-pink-200" />

      {/* Actions */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            canUndo
              ? 'text-pink-600 hover:bg-pink-50'
              : 'text-pink-300 cursor-not-allowed'
          }`}
          aria-label={isKidsMode ? 'Oops!' : 'Undo'}
        >
          <Undo2 className="w-4 h-4" />
          {isKidsMode ? 'Oops!' : 'Undo'}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors"
          aria-label={isKidsMode ? 'Start Over' : 'Clear'}
        >
          <Trash2 className="w-4 h-4" />
          {isKidsMode ? 'Start Over' : 'Clear'}
        </button>
      </div>
    </div>
  )
}
