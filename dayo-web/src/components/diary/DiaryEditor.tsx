import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import UnderlineExt from '@tiptap/extension-underline'
import { markdownToHtml, htmlToMarkdown } from '../../lib/markdownConverter'
import { useProfileMode } from '../../hooks/useProfileMode'
import EditorToolbar from './EditorToolbar'

interface DiaryEditorProps {
  initialContent: string
  onChange: (markdown: string) => void
  placeholder?: string
  className?: string
}

export default function DiaryEditor({
  initialContent,
  onChange,
  placeholder = 'Start writing...',
  className = '',
}: DiaryEditorProps) {
  const { isKidsMode } = useProfileMode()
  const isInternalUpdate = useRef(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

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

  return (
    <div className={`${isKidsMode ? 'diary-editor-kids' : ''} ${className}`}>
      {/* Desktop: Toolbar above editor */}
      {editor && !isMobile && (
        <div className="mb-2 pb-2 border-b border-dayo-gray-100">
          <EditorToolbar editor={editor} />
        </div>
      )}

      <EditorContent editor={editor} />

      {/* Mobile: Sticky toolbar */}
      {isMobile && editor && (
        <div className="editor-mobile-toolbar">
          <EditorToolbar editor={editor} />
        </div>
      )}

      {/* Word count */}
      <div className="diary-word-count">
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </div>
    </div>
  )
}
