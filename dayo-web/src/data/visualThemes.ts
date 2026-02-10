export type VisualThemeId = 'default' | 'night-ritual' | 'diary' | 'private-notebook' | 'cosmic-calm'

export interface VisualTheme {
  id: VisualThemeId
  name: string
  description: string
  colors: {
    primary: string
    gradient: string
    background: string
    cardBg: string
    textPrimary: string
    textSecondary: string
  }
  backgroundImage?: string
  backgroundCss?: string // Additional CSS for complex backgrounds
  isDark: boolean
}

export const visualThemes: Record<VisualThemeId, VisualTheme> = {
  'default': {
    id: 'default',
    name: 'Default',
    description: 'Clean and minimal',
    colors: {
      primary: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      background: '#F9FAFB',
      cardBg: '#FFFFFF',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
    },
    isDark: false,
  },
  'night-ritual': {
    id: 'night-ritual',
    name: 'Night Ritual',
    description: 'Peaceful evening reflection',
    colors: {
      primary: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      background: '#1a1a2e',
      cardBg: 'rgba(251, 191, 36, 0.15)',
      textPrimary: '#FFFFFF',
      textSecondary: '#E5E7EB',
    },
    backgroundImage: 'linear-gradient(to bottom, #0f0c29 0%, #1a1a2e 30%, #302b63 70%, #24243e 100%)',
    isDark: true,
  },
  'diary': {
    id: 'diary',
    name: 'Diary',
    description: 'Warm sunset vibes',
    colors: {
      primary: '#EA580C',
      gradient: 'linear-gradient(135deg, #EA580C 0%, #F59E0B 100%)',
      background: '#FFF7ED',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#1C1917',
      textSecondary: '#78716C',
    },
    backgroundImage: 'linear-gradient(to bottom, #1e3a5f 0%, #2d4a6f 20%, #c2410c 50%, #ea580c 70%, #fb923c 85%, #fed7aa 100%)',
    isDark: false,
  },
  'private-notebook': {
    id: 'private-notebook',
    name: 'Private Notebook',
    description: 'Clean and focused',
    colors: {
      primary: '#78716C',
      gradient: 'linear-gradient(135deg, #A8A29E 0%, #D6D3D1 100%)',
      background: '#FAFAF9',
      cardBg: '#FFFFFF',
      textPrimary: '#1C1917',
      textSecondary: '#78716C',
    },
    backgroundImage: 'linear-gradient(to bottom, #FAFAF9 0%, #F5F5F4 100%)',
    isDark: false,
  },
  'cosmic-calm': {
    id: 'cosmic-calm',
    name: 'Cosmic Calm',
    description: 'Deep space serenity',
    colors: {
      primary: '#A78BFA',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
      background: '#0f0a1f',
      cardBg: 'rgba(139, 92, 246, 0.12)',
      textPrimary: '#F3F4F6',
      textSecondary: '#C4B5FD',
    },
    backgroundImage: 'linear-gradient(to bottom, #0f0a1f 0%, #1e1145 30%, #2e1f5e 60%, #1a1040 100%)',
    isDark: true,
  },
}

export const visualThemesList = Object.values(visualThemes)
