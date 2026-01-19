import { format } from 'date-fns'
import { Bot, User } from 'lucide-react'
import type { Message } from '../../hooks/useAI'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-dayo-purple text-white'
            : 'bg-dayo-gradient text-white'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[80%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-dayo-purple text-white rounded-tr-sm'
              : 'bg-white text-dayo-gray-900 shadow-sm border border-dayo-gray-100 rounded-tl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
        <p
          className={`text-[10px] text-dayo-gray-400 mt-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {format(message.timestamp, 'h:mm a')}
        </p>
      </div>
    </div>
  )
}
