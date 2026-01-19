import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import type { Message } from '../../hooks/useAI'

interface QuickAction {
  id: string
  label: string
  prompt: string
  icon: string
}

interface ChatWindowProps {
  messages: Message[]
  onSend: (message: string) => void
  isLoading?: boolean
  quickActions?: QuickAction[]
}

export default function ChatWindow({
  messages,
  onSend,
  isLoading = false,
  quickActions = [],
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const showQuickActions = messages.length <= 1 && quickActions.length > 0

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dayo-gradient flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-white shadow-sm border border-dayo-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-dayo-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-dayo-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-dayo-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      {showQuickActions && (
        <div className="px-4 pb-2">
          <p className="text-xs text-dayo-gray-400 mb-2">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onSend(action.prompt)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-dayo-gray-200 rounded-full text-sm text-dayo-gray-700 hover:border-dayo-purple hover:text-dayo-purple transition-colors disabled:opacity-50"
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  )
}
