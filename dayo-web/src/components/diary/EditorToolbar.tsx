import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, PenTool } from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { useProfileMode } from '../../hooks/useProfileMode'

interface EditorToolbarProps {
  editor: Editor | null
  isSketchOpen?: boolean
  onToggleSketch?: () => void
  hasSketch?: boolean
}

interface ToolbarButton {
  icon: React.ReactNode
  label: string
  action: () => void
  isActive: () => boolean
}

export default function EditorToolbar({
  editor,
  isSketchOpen,
  onToggleSketch,
  hasSketch,
}: EditorToolbarProps) {
  const { isKidsMode } = useProfileMode()

  if (!editor) return null

  const buttons: ToolbarButton[] = [
    {
      icon: <Bold className="w-4 h-4" />,
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: <Underline className="w-4 h-4" />,
      label: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      label: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      label: 'Heading 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <List className="w-4 h-4" />,
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      label: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
  ]

  return (
    <div
      className={`flex items-center gap-0.5 ${isKidsMode ? 'diary-editor-kids' : ''}`}
      role="toolbar"
      aria-label="Text formatting"
    >
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={`editor-toolbar-btn ${btn.isActive() ? 'is-active' : ''}`}
          aria-label={btn.label}
          aria-pressed={btn.isActive()}
          title={btn.label}
        >
          {btn.icon}
        </button>
      ))}

      {/* Separator and Sketch button */}
      {onToggleSketch && (
        <>
          <div className="w-px h-5 bg-dayo-gray-200 mx-1.5" />
          <button
            type="button"
            onClick={onToggleSketch}
            className={`editor-toolbar-btn relative ${isSketchOpen ? 'is-active' : ''}`}
            aria-label={isKidsMode ? 'Draw' : 'Sketch'}
            aria-pressed={isSketchOpen}
            title={isKidsMode ? 'Draw something!' : 'Add sketch'}
          >
            <PenTool className="w-4 h-4" />
            {/* Indicator dot when sketch exists */}
            {hasSketch && !isSketchOpen && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>
        </>
      )}
    </div>
  )
}
