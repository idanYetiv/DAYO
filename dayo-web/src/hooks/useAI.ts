import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { sendMessage, getDailySummary, isMockMode, type ChatMessage, type AIContext } from '../lib/openai'

export type { ChatMessage, AIContext }

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/**
 * Hook for managing AI chat state and interactions
 */
export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMutation = useMutation({
    mutationFn: async ({
      userMessage,
      context,
    }: {
      userMessage: string
      context?: AIContext
    }) => {
      // Build chat history for context
      const chatHistory: ChatMessage[] = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      // Add the new user message
      chatHistory.push({ role: 'user', content: userMessage })

      // Get AI response
      const response = await sendMessage(chatHistory, context)
      return response
    },
    onMutate: async ({ userMessage }) => {
      // Optimistically add user message
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
    },
    onSuccess: (response) => {
      // Add AI response
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    },
    onError: (error) => {
      // Add error message
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    },
  })

  const send = useCallback(
    (message: string, context?: AIContext) => {
      if (!message.trim()) return
      sendMutation.mutate({ userMessage: message.trim(), context })
    },
    [sendMutation]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const addWelcomeMessage = useCallback(() => {
    const welcomeMsg: Message = {
      id: 'welcome',
      role: 'assistant',
      content: isMockMode()
        ? "Hi! I'm your DAYO assistant. I can help you plan your day, reflect on your progress, and set goals. What would you like to focus on? (Running in demo mode)"
        : "Hi! I'm your DAYO assistant. I can help you plan your day, reflect on your progress, and set goals. What would you like to focus on?",
      timestamp: new Date(),
    }
    setMessages([welcomeMsg])
  }, [])

  return {
    messages,
    send,
    clearMessages,
    addWelcomeMessage,
    isLoading: sendMutation.isPending,
    error: sendMutation.error,
    isMockMode: isMockMode(),
  }
}

/**
 * Hook for getting daily AI summaries
 */
export function useDailySummary() {
  return useMutation({
    mutationFn: async (context: AIContext) => {
      return getDailySummary(context)
    },
  })
}

/**
 * Quick action prompts for the AI
 */
export const quickActions = [
  {
    id: 'summary',
    label: 'Summarize my day',
    prompt: 'Give me a summary of my day so far.',
    icon: '📊',
  },
  {
    id: 'plan',
    label: 'Help me plan tomorrow',
    prompt: 'Help me plan my tasks for tomorrow.',
    icon: '📅',
  },
  {
    id: 'motivate',
    label: 'Motivate me',
    prompt: 'I need some motivation to keep going.',
    icon: '💪',
  },
  {
    id: 'reflect',
    label: 'Reflection prompt',
    prompt: 'Give me a thoughtful journaling prompt for today.',
    icon: '✨',
  },
]
