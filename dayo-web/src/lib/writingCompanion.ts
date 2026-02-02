/**
 * Writing Companion — prompt generation brain
 * Provides contextual writing prompts based on mood, section, word count, and mode
 */

export interface WritingCompanionContext {
  mood: string
  currentText: string
  currentSection?: string
  templateName?: string
  wordCount: number
  isKidsMode: boolean
}

type Stage = 'start' | 'going' | 'reflecting'

function getStage(wordCount: number): Stage {
  if (wordCount <= 10) return 'start'
  if (wordCount <= 50) return 'going'
  return 'reflecting'
}

// ---- Mock prompt bank (~40 curated prompts) ----

const adultPrompts: Record<string, Record<Stage, string[]>> = {
  amazing: {
    start: [
      "What made today feel so special?",
      "Describe the moment that filled you with joy.",
    ],
    going: [
      "What would you tell your past self about today?",
      "Who contributed to making this day great?",
    ],
    reflecting: [
      "How can you carry this feeling into tomorrow?",
      "What does this day reveal about what matters most to you?",
    ],
  },
  happy: {
    start: [
      "What put a smile on your face today?",
      "What are you most grateful for right now?",
    ],
    going: [
      "What small moment surprised you with happiness?",
      "How did you make someone else happy today?",
    ],
    reflecting: [
      "What pattern do you notice in your happy days?",
      "How has your definition of happiness evolved?",
    ],
  },
  okay: {
    start: [
      "What was the most interesting part of today?",
      "If you could change one thing about today, what would it be?",
    ],
    going: [
      "What's something you noticed that others might have missed?",
      "What quiet moment stood out to you?",
    ],
    reflecting: [
      "What would make tomorrow feel more fulfilling?",
      "What are you learning about yourself during average days?",
    ],
  },
  sad: {
    start: [
      "What's weighing on your mind right now?",
      "Take a breath. What feels most important to express?",
    ],
    going: [
      "What would comfort look like for you right now?",
      "Is there something unspoken that needs space here?",
    ],
    reflecting: [
      "What strength have you shown by writing through this?",
      "What would you say to a friend feeling this way?",
    ],
  },
  stressed: {
    start: [
      "What's creating the most pressure right now?",
      "Let it out — what's on your mind?",
    ],
    going: [
      "What's one thing within your control right now?",
      "When did you last feel calm? What was different?",
    ],
    reflecting: [
      "What can you release that isn't serving you?",
      'What would "good enough" look like today?',
    ],
  },
  tired: {
    start: [
      "What drained your energy today?",
      "Even tired, you showed up. What pushed you?",
    ],
    going: [
      "What would recharge you right now?",
      "What's one kind thing you can do for yourself tonight?",
    ],
    reflecting: [
      "What boundaries might help you protect your energy?",
      "Rest is productive. What did your body teach you today?",
    ],
  },
}

const kidsPrompts: Record<string, Record<Stage, string[]>> = {
  amazing: {
    start: [
      "\u{1F31F} What was the BEST part of today?",
      "\u{1F389} Tell me about something super cool that happened!",
    ],
    going: [
      "\u{1F9B8} If today was a movie, what would the title be?",
      "\u{2728} Who was your hero today?",
    ],
    reflecting: [
      "\u{1F308} What would you tell your best friend about today?",
      "\u{1F3A8} Draw today with words \u2014 what colors would you use?",
    ],
  },
  happy: {
    start: [
      "\u{1F60A} What made you smile the biggest today?",
      "\u{1F3AE} What was the most fun thing you did?",
    ],
    going: [
      "\u{1F355} What was the yummiest or most fun part of your day?",
      "\u{1F436} Did anything cute or funny happen?",
    ],
    reflecting: [
      "\u{2B50} You sound happy! What would make tomorrow even better?",
      "\u{1F3B5} If your day was a song, what kind would it be?",
    ],
  },
  okay: {
    start: [
      "\u{1F422} Sometimes days are just okay \u2014 and that's cool! What happened?",
      "\u{1F4DD} What was something interesting today?",
    ],
    going: [
      "\u{1F50D} Was there a hidden awesome moment you almost missed?",
      "\u{1F3B2} What game or activity did you enjoy most?",
    ],
    reflecting: [
      "\u{1F680} What would make tomorrow more exciting?",
      "\u{1F4A1} What's one new thing you learned today?",
    ],
  },
  sad: {
    start: [
      "\u{1FAC2} It's okay to feel sad. Want to write about what happened?",
      "\u{1F499} Even superheroes have tough days. What's on your mind?",
    ],
    going: [
      "\u{1F9F8} What would make you feel a little bit better?",
      "\u{1F33B} Can you think of one tiny good thing from today?",
    ],
    reflecting: [
      "\u{1F4AA} You're brave for writing this! What helps when you're sad?",
      "\u{1F31F} Tomorrow is a brand new adventure. What do you hope for?",
    ],
  },
  stressed: {
    start: [
      "\u{1F624} Sounds like a big day! What's making things tough?",
      "\u{1F30A} Take a deep breath. Ready to write it out?",
    ],
    going: [
      "\u{1F3AF} What's the one thing bugging you the most?",
      "\u{1F3D6}\u{FE0F} If you could be anywhere right now, where would you go?",
    ],
    reflecting: [
      "\u{1F981} You're braver than you think! What helped you get through today?",
      "\u{26FA} What's your favorite way to relax?",
    ],
  },
  tired: {
    start: [
      "\u{1F634} Tired days happen! What used up your energy?",
      "\u{1F6CF}\u{FE0F} Almost bedtime energy \u2014 what was your day like?",
    ],
    going: [
      "\u{1F36B} What would be your perfect cozy evening?",
      "\u{1F4DA} Did you do anything that made you proud today?",
    ],
    reflecting: [
      "\u{1F319} Rest is important! What are you looking forward to tomorrow?",
      "\u{1F4A4} Your brain worked hard today. What did you accomplish?",
    ],
  },
}

// Default prompts for unknown moods
const defaultAdult: Record<Stage, string[]> = {
  start: [
    "What's on your mind today?",
    "Take a moment to check in with yourself.",
  ],
  going: [
    "What stood out to you today?",
    "What are you thinking about right now?",
  ],
  reflecting: [
    "What will you take with you from today?",
    "What does today teach you about yourself?",
  ],
}

const defaultKids: Record<Stage, string[]> = {
  start: [
    "\u{1F4DD} Ready to write about your day?",
    "\u{1F31F} What happened today?",
  ],
  going: [
    "\u{1F3A8} Tell me more! What else happened?",
    "\u{1F50D} What was the coolest thing?",
  ],
  reflecting: [
    "\u{2B50} Great writing! Anything else to add?",
    "\u{1F308} You did awesome today!",
  ],
}

// Track recently shown to avoid repeats
const recentlyShown = new Set<string>()
const MAX_RECENT = 8

function pickPrompt(prompts: string[]): string {
  const available = prompts.filter(p => !recentlyShown.has(p))
  const pool = available.length > 0 ? available : prompts

  const picked = pool[Math.floor(Math.random() * pool.length)]

  recentlyShown.add(picked)
  if (recentlyShown.size > MAX_RECENT) {
    const first = recentlyShown.values().next().value
    if (first) recentlyShown.delete(first)
  }

  return picked
}

/**
 * Get a writing prompt from the local prompt bank (mock mode)
 */
export function getLocalWritingPrompt(context: WritingCompanionContext): string {
  const stage = getStage(context.wordCount)
  const bank = context.isKidsMode ? kidsPrompts : adultPrompts
  const defaults = context.isKidsMode ? defaultKids : defaultAdult

  const moodPrompts = bank[context.mood]
  const stagePrompts = moodPrompts?.[stage] ?? defaults[stage]

  return pickPrompt(stagePrompts)
}

/**
 * Build the system prompt for real API calls
 */
export function buildCompanionSystemPrompt(context: WritingCompanionContext): string {
  const mode = context.isKidsMode
    ? 'The user is a child (8-14). Use simple, fun language with an emoji.'
    : 'The user is an adult. Be gentle and thoughtful.'

  return [
    'You are a gentle writing companion in a diary app.',
    'Help the user reflect through ONE short question (1-2 sentences max).',
    'Mirror their emotional tone. Never give advice. Never be preachy.',
    mode,
    '',
    `Context: mood=${context.mood}, section=${context.currentSection || 'freewrite'}, words=${context.wordCount}`,
    context.currentText
      ? `Recent text: "${context.currentText.slice(-300)}"`
      : 'The user hasn\'t started writing yet.',
    '',
    'Respond with ONLY the prompt text. No labels, no quotes.',
  ].join('\n')
}
