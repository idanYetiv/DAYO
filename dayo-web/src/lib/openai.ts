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
 * Get a writing companion prompt
 * Uses real API or falls back to local prompt bank
 */
export async function getWritingCompanionPrompt(
  context: import('./writingCompanion').WritingCompanionContext
): Promise<string> {
  const { getLocalWritingPrompt, buildCompanionSystemPrompt } = await import('./writingCompanion')

  if (USE_MOCK) {
    await delay(300 + Math.random() * 200)
    return getLocalWritingPrompt(context)
  }

  // Real API call
  const systemPrompt = buildCompanionSystemPrompt(context)

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
        { role: 'user', content: 'Generate a writing prompt.' },
      ],
      max_tokens: 100,
      temperature: 0.9,
    }),
  })

  if (!response.ok) {
    // Fallback to local on API error
    return getLocalWritingPrompt(context)
  }

  const data: OpenAIResponse = await response.json()
  return data.choices[0]?.message?.content?.trim() || getLocalWritingPrompt(context)
}

/**
 * Check if we're in mock mode
 */
export function isMockMode(): boolean {
  return USE_MOCK
}

// ===== Diary Milestone & Insight Functions =====

export interface MilestoneContext {
  milestoneId: string
  milestoneTitle: string
  milestoneDescription: string
  totalEntries: number
  totalWords: number
  isKidsMode: boolean
}

export interface DailyInsightContext {
  diaryText: string
  mood?: string
  gratitude?: string[]
  highlights?: { emoji: string; text: string }[]
  isKidsMode: boolean
}

// Mock celebration messages for milestones
const mockMilestoneCelebrations: Record<string, { adult: string[]; kids: string[] }> = {
  first_entry: {
    adult: [
      "You've planted the first seed of self-reflection. This journal will become a garden of memories and growth.",
      "The journey of a thousand pages begins with a single entry. Welcome to your story.",
      "You've taken a beautiful first step. Writing is how we make sense of our days and ourselves.",
    ],
    kids: [
      "YAY! You did it! Your very first diary entry! This is the start of an awesome adventure! 🎉",
      "WOW! You're officially a diary writer now! Keep writing about all the cool stuff you do! ⭐",
      "High five! 🖐️ Your first entry is done! Can't wait to see what you write next!",
    ],
  },
  words_100: {
    adult: [
      "100 words may seem small, but each one carries meaning. You're building a habit that will serve you well.",
      "Your voice is getting stronger with every word. Keep going - the best insights often come when we least expect them.",
      "100 words written is 100 moments captured. You're creating something valuable.",
    ],
    kids: [
      "100 words! That's like writing a whole story! You're a word wizard now! 🧙‍♂️",
      "WOW! 100 words! Your brain must be super full of great ideas! Keep 'em coming! 🚀",
      "Amazing! 100 words! You could fill a whole notebook at this rate! 📓✨",
    ],
  },
  words_1000: {
    adult: [
      "1,000 words is a milestone worth celebrating. You've created a meaningful record of your life.",
      "A thousand words of reflection, growth, and self-discovery. This is what intentional living looks like.",
      "You've written the equivalent of several chapters of your life story. What a gift to your future self.",
    ],
    kids: [
      "ONE THOUSAND WORDS! That's like writing a whole book chapter! You're incredible! 📚🌟",
      "1,000 words?! You could be a famous author someday! Keep writing your adventures! ✍️",
      "WHOA! 1,000 words! Your diary is becoming a treasure chest of memories! 💎",
    ],
  },
  words_10000: {
    adult: [
      "10,000 words. You've created something extraordinary - a detailed tapestry of your thoughts, dreams, and growth.",
      "This is the mark of true dedication. Your journal is now a profound record of your journey.",
      "10,000 words of wisdom, reflection, and intentional living. You've built something that will last a lifetime.",
    ],
    kids: [
      "TEN THOUSAND WORDS?! That's like writing TEN whole books! You're a SUPERSTAR writer! 🌟🏆",
      "WOW WOW WOW! 10,000 words! You could fill a whole library! You're amazing! 📚✨",
      "INCREDIBLE! 10,000 words! You're officially a diary CHAMPION! 🎖️🎉",
    ],
  },
}

/**
 * Generate a celebration message for a diary milestone
 */
export async function generateMilestoneCelebration(context: MilestoneContext): Promise<string> {
  const { milestoneId, isKidsMode, totalEntries, totalWords } = context

  if (USE_MOCK) {
    await delay(400 + Math.random() * 300)
    const messages = mockMilestoneCelebrations[milestoneId] || mockMilestoneCelebrations.first_entry
    const pool = isKidsMode ? messages.kids : messages.adult
    return pool[Math.floor(Math.random() * pool.length)]
  }

  // Real API call
  const tone = isKidsMode
    ? 'playful, enthusiastic, with lots of excitement and emojis, suitable for a child aged 8-14'
    : 'warm, thoughtful, and encouraging, like a supportive mentor'

  const systemPrompt = `You are celebrating a user's diary writing milestone. Be ${tone}.
Keep the message to 1-2 sentences. Make it feel personal and special.
User stats: ${totalEntries} total entries, ${totalWords} total words written.`

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
        { role: 'user', content: `Generate a celebration message for achieving the "${context.milestoneTitle}" milestone (${context.milestoneDescription}).` },
      ],
      max_tokens: 100,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    // Fallback to mock on API error
    const messages = mockMilestoneCelebrations[milestoneId] || mockMilestoneCelebrations.first_entry
    const pool = isKidsMode ? messages.kids : messages.adult
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const data: OpenAIResponse = await response.json()
  return data.choices[0]?.message?.content?.trim() || 'Congratulations on your milestone!'
}

// Mock daily insight messages based on mood
const mockDailyInsights: Record<string, { adult: string[]; kids: string[] }> = {
  amazing: {
    adult: [
      "Your energy today is contagious. Hold onto this feeling - it's fuel for the challenging days.",
      "What a wonderful day to capture. These bright moments are the highlights of our journey.",
      "Your positivity shines through your words. This is exactly what journaling is for.",
    ],
    kids: [
      "What an AWESOME day! Your happy vibes are super contagious! 😊☀️",
      "WOW, sounds like today was the BEST! Keep spreading that sunshine! 🌈",
      "Your day sounds AMAZING! I bet tomorrow will be great too! ⭐",
    ],
  },
  happy: {
    adult: [
      "It's clear you found joy today. Noticing these moments is what makes life rich.",
      "Your contentment comes through in your writing. These are the days we remember.",
      "Happiness captured in words becomes happiness preserved. Well done.",
    ],
    kids: [
      "Sounds like a really happy day! That makes me smile too! 😄",
      "Yay for happy days! Your writing makes me feel happy too! 🎈",
      "Happy days are the best days! Thanks for sharing yours! 💛",
    ],
  },
  okay: {
    adult: [
      "Not every day needs to be extraordinary. Your consistency in showing up matters most.",
      "Ordinary days hold quiet beauty. Thank you for capturing this one.",
      "Even okay days are worth remembering. You're building a complete picture of your life.",
    ],
    kids: [
      "Hey, okay days are still good days! Tomorrow might be even better! 👍",
      "Every day is worth writing about! You're doing great! 📝",
      "Okay days are like stepping stones to awesome days! Keep going! 🌟",
    ],
  },
  sad: {
    adult: [
      "Thank you for being honest about how you feel. Writing through difficult emotions takes courage.",
      "Sadness is part of the human experience. You're processing it beautifully by writing.",
      "Some days are harder than others. Your honesty here is a form of self-care.",
    ],
    kids: [
      "It's okay to feel sad sometimes. Tomorrow is a brand new day! 💙",
      "Hugs! 🤗 Writing about sad feelings can help them feel smaller.",
      "Even superheroes have sad days. You're brave for writing about yours! 💪",
    ],
  },
  stressed: {
    adult: [
      "Acknowledging stress is the first step to managing it. You're doing important work here.",
      "Writing about stress helps release it. Take a breath - you've got this.",
      "Stressful days remind us what matters. Rest well tonight.",
    ],
    kids: [
      "Sounds like a busy day! Remember to take deep breaths! 🌬️",
      "When things feel stressful, writing helps! You did the right thing! 💪",
      "Even on tough days, you're doing great! Be proud of yourself! 🌈",
    ],
  },
  default: {
    adult: [
      "Every entry you write is a gift to your future self. Keep going.",
      "Your words today will be treasured memories tomorrow.",
      "Thank you for taking time to reflect. This practice will serve you well.",
    ],
    kids: [
      "Great job writing today! Every word counts! ✨",
      "You're becoming such a good writer! Keep it up! 📖",
      "Another awesome entry! You should be proud! 🎉",
    ],
  },
}

/**
 * Generate a daily insight based on diary entry
 */
export async function generateDailyInsight(context: DailyInsightContext): Promise<string> {
  const { diaryText, mood, gratitude, highlights, isKidsMode } = context

  // Don't generate insights for very short entries
  if (!diaryText || diaryText.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length < 20) {
    return ''
  }

  if (USE_MOCK) {
    await delay(500 + Math.random() * 400)
    const moodKey = mood || 'default'
    const messages = mockDailyInsights[moodKey] || mockDailyInsights.default
    const pool = isKidsMode ? messages.kids : messages.adult
    return pool[Math.floor(Math.random() * pool.length)]
  }

  // Real API call
  const tone = isKidsMode
    ? 'playful and encouraging, with emojis, suitable for a child aged 8-14'
    : 'warm and thoughtful, like a supportive friend noticing something meaningful'

  let contextInfo = `Diary entry: "${diaryText.substring(0, 500)}"`
  if (mood) contextInfo += `\nMood: ${mood}`
  if (gratitude && gratitude.length > 0) contextInfo += `\nGratitude items: ${gratitude.join(', ')}`
  if (highlights && highlights.length > 0) {
    contextInfo += `\nHighlights: ${highlights.map(h => `${h.emoji} ${h.text}`).join(', ')}`
  }

  const systemPrompt = `You are providing a brief, personalized insight after someone saves their diary entry.
Be ${tone}. Keep your response to 1-2 short sentences.
Reference something specific from their entry to make it feel personal.
Do NOT be generic or robotic. Do NOT start with "Great job" or "Well done".
Focus on a theme, emotion, or specific detail that stands out.`

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
        { role: 'user', content: contextInfo },
      ],
      max_tokens: 80,
      temperature: 0.85,
    }),
  })

  if (!response.ok) {
    // Fallback to mock on API error
    const moodKey = mood || 'default'
    const messages = mockDailyInsights[moodKey] || mockDailyInsights.default
    const pool = isKidsMode ? messages.kids : messages.adult
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const data: OpenAIResponse = await response.json()
  return data.choices[0]?.message?.content?.trim() || ''
}
