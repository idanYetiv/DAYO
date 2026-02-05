import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import UnderlineExt from '@tiptap/extension-underline'
import { markdownToHtml, htmlToMarkdown } from '../../lib/markdownConverter'
import { useProfileMode } from '../../hooks/useProfileMode'
import EditorToolbar from './EditorToolbar'
import SketchSection from './SketchSection'

interface DiaryEditorProps {
  initialContent: string
  onChange: (markdown: string) => void
  placeholder?: string
  className?: string
  sketchDataUrl?: string | null
  onSketchChange?: (dataUrl: string | null) => void
  mood?: string
}

export default function DiaryEditor({
  initialContent,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  sketchDataUrl,
  onSketchChange,
  mood,
}: DiaryEditorProps) {
  const { isKidsMode } = useProfileMode()
  const isInternalUpdate = useRef(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [isSketchOpen, setIsSketchOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        bulletList: {},
        orderedList: {},
        bold: {},
        italic: {},
        strike: {},
        blockquote: {},
        horizontalRule: false,
        code: false,
        codeBlock: false,
      }),
      UnderlineExt,
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: markdownToHtml(initialContent),
    onUpdate: ({ editor }) => {
      if (isInternalUpdate.current) return
      const html = editor.getHTML()
      const md = htmlToMarkdown(html)
      onChangeRef.current(md)
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror outline-none min-h-[150px]',
      },
    },
  })

  // Sync external content changes (e.g. template switch)
  useEffect(() => {
    if (!editor) return
    const currentMd = htmlToMarkdown(editor.getHTML())
    if (currentMd !== initialContent) {
      isInternalUpdate.current = true
      editor.commands.setContent(markdownToHtml(initialContent))
      isInternalUpdate.current = false
    }
  }, [initialContent, editor])

  const wordCount = editor?.storage.characterCount?.words() ?? 0
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const hasSketch = Boolean(sketchDataUrl)

  const handleToggleSketch = () => {
    setIsSketchOpen(!isSketchOpen)
  }

  const handleSketchChange = (dataUrl: string | null) => {
    onSketchChange?.(dataUrl)
  }

  return (
    <div className={`${isKidsMode ? 'diary-editor-kids' : ''} ${className}`}>
      {/* Desktop: Toolbar above editor */}
      {editor && !isMobile && (
        <div className="mb-2 pb-2 border-b border-dayo-gray-100">
          <EditorToolbar
            editor={editor}
            isSketchOpen={isSketchOpen}
            onToggleSketch={onSketchChange ? handleToggleSketch : undefined}
            hasSketch={hasSketch}
          />
        </div>
      )}

      <EditorContent editor={editor} />

      {/* Sketch thumbnail when collapsed */}
      {hasSketch && !isSketchOpen && sketchDataUrl && (
        <button
          type="button"
          onClick={() => setIsSketchOpen(true)}
          className="mt-3 group relative"
        >
          <img
            src={sketchDataUrl}
            alt="Sketch preview"
            className="w-20 h-14 object-cover rounded-lg border border-pink-200 hover:border-pink-400 transition-colors"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors">
            <span className="text-xs text-transparent group-hover:text-pink-600 font-medium">
              Edit
            </span>
          </span>
        </button>
      )}

      {/* Sketch section (inline) */}
      {onSketchChange && (
        <SketchSection
          isOpen={isSketchOpen}
          initialSketchUrl={sketchDataUrl}
          onSketchChange={handleSketchChange}
          onClose={() => setIsSketchOpen(false)}
          mood={mood}
        />
      )}

      {/* Mobile: Sticky toolbar */}
      {isMobile && editor && (
        <div className="editor-mobile-toolbar">
          <EditorToolbar
            editor={editor}
            isSketchOpen={isSketchOpen}
            onToggleSketch={onSketchChange ? handleToggleSketch : undefined}
            hasSketch={hasSketch}
          />
        </div>
      )}

      {/* Word count */}
      <div className="diary-word-count">
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>
    </div>
  )
}
