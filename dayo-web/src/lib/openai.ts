/**
 * OpenAI Integration for DAYO
 * Supports both real API and mock mode for development
 */

// Configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''
const USE_MOCK = !OPENAI_API_KEY || import.meta.env.VITE_AI_MOCK_MODE === 'true'

// Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIContext {
  tasks?: { title: string; completed: boolean }[]
  diary?: string
  mood?: string
  streak?: number
  date?: string
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

// Mock responses for development
const mockResponses: Record<string, string[]> = {
  summary: [
    "Based on your day, you've made solid progress! You completed {tasksCompleted} out of {totalTasks} tasks. {moodMessage} Keep up the momentum!",
    "Today was productive! With {tasksCompleted} tasks done and a {streak}-day streak going, you're building great habits. {diaryInsight}",
    "Looking at your day: {tasksCompleted}/{totalTasks} tasks completed. {moodMessage} Your {streak}-day streak shows real commitment!",
  ],
  planning: [
    "For tomorrow, I'd suggest focusing on your most important task first thing in the morning when your energy is highest. What's the one thing that would make tomorrow a success?",
    "Based on your patterns, you tend to be most productive in the morning. Try scheduling your challenging tasks early. What's on your mind for tomorrow?",
    "Let's plan tomorrow! Start by identifying your top 3 priorities. What matters most to you right now?",
  ],
  motivation: [
    "You're on a {streak}-day streak! That's amazing consistency. Every day you show up is a vote for the person you want to become.",
    "Remember: progress isn't always linear, but showing up every day matters. You've got this!",
    "Your {streak}-day streak shows dedication. Small daily actions compound into big results over time.",
  ],
  goals: [
    "To break down your goal, let's start with the end in mind. What does success look like? Then we can work backwards to create actionable steps.",
    "Great goal! Let's make it SMART - Specific, Measurable, Achievable, Relevant, and Time-bound. What's the first milestone you want to hit?",
    "I can help you create a roadmap for that goal. What's your timeline, and what resources do you have available?",
  ],
  default: [
    "I'm here to help you plan, reflect, and grow. What would you like to focus on today?",
    "That's a great question! Let me think about how I can help you with that.",
    "I'd love to help! Could you tell me a bit more about what you're looking for?",
  ],
}

// Helper to get random mock response
function getMockResponse(category: string, context: AIContext): string {
  const responses = mockResponses[category] || mockResponses.default
  let response = responses[Math.floor(Math.random() * responses.length)]

  // Replace placeholders with context
  const tasksCompleted = context.tasks?.filter(t => t.completed).length || 0
  const totalTasks = context.tasks?.length || 0
  const streak = context.streak || 0
  const mood = context.mood || 'okay'

  const moodMessages: Record<string, string> = {
    amazing: "You're feeling amazing today - that positive energy is contagious!",
    happy: "Your happy mood is a great foundation for the day!",
    okay: "Even on okay days, you're showing up - that counts!",
    sad: "I notice you're feeling a bit down. Be gentle with yourself today.",
    stressed: "Feeling stressed is valid. Let's focus on what you can control.",
  }

  const diaryInsight = context.diary
    ? "Your reflection shows thoughtful self-awareness."
    : "Consider jotting down a quick reflection to capture today's moments."

  response = response
    .replace('{tasksCompleted}', String(tasksCompleted))
    .replace('{totalTasks}', String(totalTasks))
    .replace('{streak}', String(streak))
    .replace('{moodMessage}', moodMessages[mood] || '')
    .replace('{diaryInsight}', diaryInsight)

  return response
}

// Detect intent from user message
function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('summary') || lowerMessage.includes('how was') || lowerMessage.includes('my day')) {
    return 'summary'
  }
  if (lowerMessage.includes('plan') || lowerMessage.includes('tomorrow') || lowerMessage.includes('schedule')) {
    return 'planning'
  }
  if (lowerMessage.includes('motivat') || lowerMessage.includes('encourage') || lowerMessage.includes('inspire')) {
    return 'motivation'
  }
  if (lowerMessage.includes('goal') || lowerMessage.includes('achieve') || lowerMessage.includes('milestone')) {
    return 'goals'
  }

  return 'default'
}

// Build system prompt with context
function buildSystemPrompt(context: AIContext): string {
  const parts = [
    "You are DAYO's AI assistant - a warm, supportive personal guide helping users plan their days, reflect on their experiences, and grow.",
    "Be concise but thoughtful. Use a friendly, encouraging tone.",
    "Focus on actionable advice and positive reinforcement.",
    "",
    "Current user context:",
  ]

  if (context.date) {
    parts.push(`- Date: ${context.date}`)
  }
  if (context.streak !== undefined) {
    parts.push(`- Current streak: ${context.streak} days`)
  }
  if (context.tasks && context.tasks.length > 0) {
    const completed = context.tasks.filter(t => t.completed).length
    parts.push(`- Tasks: ${completed}/${context.tasks.length} completed`)
    parts.push(`- Task list: ${context.tasks.map(t => `${t.completed ? '✓' : '○'} ${t.title}`).join(', ')}`)
  }
  if (context.mood) {
    parts.push(`- Mood: ${context.mood}`)
  }
  if (context.diary) {
    parts.push(`- Diary entry: "${context.diary.substring(0, 200)}${context.diary.length > 200 ? '...' : ''}"`)
  }

  return parts.join('\n')
}

// Simulate typing delay for mock responses
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Send a message to the AI and get a response
 */
export async function sendMessage(
  messages: ChatMessage[],
  context: AIContext = {}
): Promise<string> {
  const userMessage = messages[messages.length - 1]?.content || ''

  if (USE_MOCK) {
    // Mock mode - simulate API delay
    await delay(800 + Math.random() * 700)

    const intent = detectIntent(userMessage)
    return getMockResponse(intent, context)
  }

  // Real API call
  const systemPrompt = buildSystemPrompt(context)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Failed to get AI response')
  }

  const data: OpenAIResponse = await response.json()
  return data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.'
}

/**
 * Get a daily summary from the AI
 */
export async function getDailySummary(context: AIContext): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'user', content: 'Give me a brief summary of my day and any insights.' }
  ]
  return sendMessage(messages, context)
}

/**
 * Get goal breakdown suggestions
 */
export async function suggestGoalSteps(goal: string, context: AIContext = {}): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'user', content: `Help me break down this goal into actionable steps: "${goal}"` }
  ]
  return sendMessage(messages, context)
}

/**
 * Check if we're in mock mode
 */
export function isMockMode(): boolean {
  return USE_MOCK
}
