import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export default function ChatInput({
  onSend,
  isLoading = false,
  placeholder,
}: ChatInputProps) {
  const { t } = useTranslation()
  const defaultPlaceholder = t('ai.inputPlaceholder')
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-end gap-2 p-4 bg-white border-t border-dayo-gray-100">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || defaultPlaceholder}
          disabled={isLoading}
          rows={1}
          className="w-full px-4 py-3 pe-12 bg-dayo-gray-50 border border-dayo-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-dayo-purple/20 focus:border-dayo-purple disabled:opacity-50 text-sm"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!input.trim() || isLoading}
        className="flex-shrink-0 w-11 h-11 bg-dayo-purple text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dayo-purple/90 transition-colors"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
