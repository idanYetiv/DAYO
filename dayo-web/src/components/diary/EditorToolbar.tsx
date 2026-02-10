import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, PenTool } from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { useProfileMode } from '../../hooks/useProfileMode'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const { isKidsMode } = useProfileMode()

  if (!editor) return null

  const buttons: ToolbarButton[] = [
    {
      icon: <Bold className="w-4 h-4" />,
      label: t('toolbar.bold'),
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: <Italic className="w-4 h-4" />,
      label: t('toolbar.italic'),
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: <Underline className="w-4 h-4" />,
      label: t('toolbar.underline'),
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
    {
      icon: <Heading2 className="w-4 h-4" />,
      label: t('toolbar.heading2'),
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      icon: <Heading3 className="w-4 h-4" />,
      label: t('toolbar.heading3'),
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 }),
    },
    {
      icon: <List className="w-4 h-4" />,
      label: t('toolbar.bulletList'),
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: <ListOrdered className="w-4 h-4" />,
      label: t('toolbar.orderedList'),
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
            aria-label={isKidsMode ? t('toolbar.draw.kids') : t('toolbar.draw.adult')}
            aria-pressed={isSketchOpen}
            title={isKidsMode ? t('toolbar.drawHint.kids') : t('toolbar.drawHint.adult')}
          >
            <PenTool className="w-4 h-4" />
            {/* Indicator dot when sketch exists */}
            {hasSketch && !isSketchOpen && (
              <span className="absolute -top-0.5 -end-0.5 w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>
        </>
      )}
    </div>
  )
}
