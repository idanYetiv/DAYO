import { useEffect } from 'react'
import { format } from 'date-fns'
import { Bot, Sparkles, Trash2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAIChat, quickActions, type AIContext } from '../hooks/useAI'
import { useTasks } from '../hooks/useTasks'
import { useDayEntry } from '../hooks/useDiary'
import { useUserStats } from '../hooks/useUserStats'
import ChatWindow from '../components/ai/ChatWindow'
import BottomNavigation from '../components/ui/BottomNavigation'
import ThemedHeader from '../components/ui/ThemedHeader'

export default function AIAssistantPage() {
  const { user } = useAuthStore()
  const today = format(new Date(), 'yyyy-MM-dd')

  // Fetch user data for context
  const { data: tasks = [] } = useTasks(today)
  const { data: dayEntry } = useDayEntry(today)
  const { data: userStats } = useUserStats(user?.id || '')

  // AI chat state
  const {
    messages,
    send,
    clearMessages,
    addWelcomeMessage,
    isLoading,
    isMockMode,
  } = useAIChat()

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      addWelcomeMessage()
    }
  }, [messages.length, addWelcomeMessage])

  // Build AI context from user data
  const context: AIContext = {
    date: today,
    tasks: tasks.map((t) => ({ title: t.title, completed: t.completed })),
    diary: dayEntry?.diary_text || undefined,
    mood: dayEntry?.mood || undefined,
    streak: userStats?.current_streak || 0,
  }

  const handleSend = (message: string) => {
    send(message, context)
  }

  return (
    <div className="min-h-screen bg-dayo-gray-50 pb-20 flex flex-col">
      <ThemedHeader
        showLogo={false}
        leftContent={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dayo-gradient rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="themed-header-title text-lg font-bold flex items-center gap-2">
                AI Assistant
                <Sparkles className="w-4 h-4 text-dayo-orange" />
              </h1>
              <p className="text-xs themed-text-secondary">
                {isMockMode ? 'Demo mode' : 'Powered by GPT-4o'}
              </p>
            </div>
          </div>
        }
        rightContent={
          <button
            onClick={clearMessages}
            className="p-2 themed-header-icon rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        }
      />

      {/* Context Banner */}
      <div className="bg-dayo-purple/5 px-4 py-2 border-b border-dayo-purple/10">
        <div className="max-w-lg mx-auto">
          <p className="text-xs text-dayo-purple">
            Context: {tasks.length} tasks today
            {dayEntry?.mood && ` · Mood: ${dayEntry.mood}`}
            {userStats?.current_streak ? ` · ${userStats.current_streak}-day streak` : ''}
          </p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 max-w-lg mx-auto w-full flex flex-col">
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          isLoading={isLoading}
          quickActions={quickActions}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
