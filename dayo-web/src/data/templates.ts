export interface TemplateSection {
  id: string
  label: string
  prompt: string
  type: 'text' | 'list'
  placeholder: string
}

export interface DiaryTemplate {
  id: string
  name: string
  icon: string
  description: string
  sections: TemplateSection[]
  mode: 'adult' | 'kid' | 'both'
}

export const adultTemplates: DiaryTemplate[] = [
  {
    id: 'morning-intention',
    name: 'Morning Intention',
    icon: '\u{1F305}',
    description: 'Set your intentions for the day',
    sections: [
      {
        id: 'focus',
        label: 'Main Focus',
        prompt: 'What is your #1 priority today?',
        type: 'text',
        placeholder: 'Today I want to...',
      },
      {
        id: 'morning-gratitude',
        label: 'Morning Gratitude',
        prompt: 'What are you grateful for this morning?',
        type: 'list',
        placeholder: 'I am grateful for...',
      },
      {
        id: 'intention',
        label: 'Intention',
        prompt: 'How do you want to show up today?',
        type: 'text',
        placeholder: 'Today I intend to...',
      },
    ],
    mode: 'adult',
  },
  {
    id: 'evening-reflection',
    name: 'Evening Reflection',
    icon: '\u{1F319}',
    description: 'Reflect on your day',
    sections: [
      {
        id: 'best-moment',
        label: 'Best Moment',
        prompt: 'What was the best part of today?',
        type: 'text',
        placeholder: 'The best part of today was...',
      },
      {
        id: 'learned',
        label: 'What I Learned',
        prompt: 'What did you learn or realize today?',
        type: 'text',
        placeholder: 'Today I learned...',
      },
      {
        id: 'tomorrow',
        label: 'Tomorrow',
        prompt: 'What would you like to do differently tomorrow?',
        type: 'text',
        placeholder: 'Tomorrow I will...',
      },
    ],
    mode: 'adult',
  },
  {
    id: 'gratitude-deep-dive',
    name: 'Gratitude Deep Dive',
    icon: '\u{1F64F}',
    description: 'Go deeper into thankfulness',
    sections: [
      {
        id: 'people',
        label: 'People',
        prompt: 'Who made a difference in your life recently?',
        type: 'text',
        placeholder: 'I appreciate...',
      },
      {
        id: 'simple-things',
        label: 'Simple Things',
        prompt: 'What small things brought you joy?',
        type: 'list',
        placeholder: 'A small joy...',
      },
      {
        id: 'growth',
        label: 'Growth',
        prompt: 'What challenge are you grateful for?',
        type: 'text',
        placeholder: 'I grew because...',
      },
    ],
    mode: 'adult',
  },
  {
    id: 'weekly-review',
    name: 'Weekly Review',
    icon: '\u{1F4CA}',
    description: 'Review your week and plan ahead',
    sections: [
      {
        id: 'wins',
        label: 'This Week\'s Wins',
        prompt: 'What went well this week?',
        type: 'list',
        placeholder: 'A win this week...',
      },
      {
        id: 'challenges',
        label: 'Challenges',
        prompt: 'What was difficult and how did you handle it?',
        type: 'text',
        placeholder: 'A challenge I faced...',
      },
      {
        id: 'next-week',
        label: 'Next Week',
        prompt: 'What are your top priorities for next week?',
        type: 'list',
        placeholder: 'Next week I will...',
      },
    ],
    mode: 'adult',
  },
  {
    id: 'freewrite',
    name: 'Freewrite',
    icon: '\u{270D}\u{FE0F}',
    description: 'Just write freely',
    sections: [],
    mode: 'both',
  },
]

export const kidsTemplates: DiaryTemplate[] = [
  {
    id: 'adventure-log',
    name: 'Adventure Log',
    icon: '\u{1F5FA}\u{FE0F}',
    description: 'Write about your adventures!',
    sections: [
      {
        id: 'adventure',
        label: 'My Adventure',
        prompt: 'What cool thing happened today?',
        type: 'text',
        placeholder: 'Today I went on an adventure...',
      },
      {
        id: 'favorite-part',
        label: 'Favorite Part',
        prompt: 'What was the BEST part?',
        type: 'text',
        placeholder: 'My favorite part was...',
      },
      {
        id: 'friends',
        label: 'Who Was There',
        prompt: 'Who did you hang out with?',
        type: 'text',
        placeholder: 'I was with...',
      },
    ],
    mode: 'kid',
  },
  {
    id: 'super-day-report',
    name: 'Super Day Report',
    icon: '\u{1F9B8}',
    description: 'Report on your super day!',
    sections: [
      {
        id: 'superpower',
        label: 'Today\'s Superpower',
        prompt: 'What superpower did you use today?',
        type: 'text',
        placeholder: 'My superpower today was...',
      },
      {
        id: 'mission',
        label: 'Mission Accomplished',
        prompt: 'What mission did you complete?',
        type: 'list',
        placeholder: 'I completed...',
      },
      {
        id: 'sidekick',
        label: 'Sidekick of the Day',
        prompt: 'Who was your sidekick today?',
        type: 'text',
        placeholder: 'My sidekick was...',
      },
    ],
    mode: 'kid',
  },
  {
    id: 'freewrite-kids',
    name: 'Free Write',
    icon: '\u{270F}\u{FE0F}',
    description: 'Write whatever you want!',
    sections: [],
    mode: 'kid',
  },
]

export function getTemplatesForMode(isKidsMode: boolean): DiaryTemplate[] {
  if (isKidsMode) {
    return kidsTemplates
  }
  return adultTemplates
}

export function getTemplateById(id: string): DiaryTemplate | undefined {
  return [...adultTemplates, ...kidsTemplates].find(t => t.id === id)
}

export function isFrewriteTemplate(id: string): boolean {
  return id === 'freewrite' || id === 'freewrite-kids'
}
