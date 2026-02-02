/**
 * Mood-to-visual atmosphere mapping
 * Provides gradient backgrounds, glow colors, and accent colors per mood
 */

export interface MoodAtmosphereConfig {
  gradient: string      // CSS gradient for background
  glowColor: string     // Glow color with opacity
  accentColor: string   // Solid accent color for borders/companion
  cssVariable: string   // For focus mode background
}

const moodAtmosphereMap: Record<string, MoodAtmosphereConfig> = {
  amazing: {
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(245,158,11,0.05) 100%)',
    glowColor: 'rgba(251,191,36,0.15)',
    accentColor: '#F59E0B',
    cssVariable: '#FFFBEB',
  },
  happy: {
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(52,211,153,0.05) 100%)',
    glowColor: 'rgba(16,185,129,0.15)',
    accentColor: '#10B981',
    cssVariable: '#ECFDF5',
  },
  okay: {
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(96,165,250,0.05) 100%)',
    glowColor: 'rgba(59,130,246,0.12)',
    accentColor: '#3B82F6',
    cssVariable: '#EFF6FF',
  },
  sad: {
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(129,140,248,0.05) 100%)',
    glowColor: 'rgba(99,102,241,0.12)',
    accentColor: '#6366F1',
    cssVariable: '#EEF2FF',
  },
  stressed: {
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(251,113,133,0.05) 100%)',
    glowColor: 'rgba(244,63,94,0.12)',
    accentColor: '#F43F5E',
    cssVariable: '#FFF1F2',
  },
  tired: {
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(167,139,250,0.05) 100%)',
    glowColor: 'rgba(139,92,246,0.12)',
    accentColor: '#8B5CF6',
    cssVariable: '#F5F3FF',
  },
}

// Kids mode overrides — warmer saturation
const kidsOverrides: Partial<Record<string, Partial<MoodAtmosphereConfig>>> = {
  amazing: {
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(251,146,60,0.08) 100%)',
    glowColor: 'rgba(251,191,36,0.2)',
  },
  happy: {
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(110,231,183,0.08) 100%)',
    glowColor: 'rgba(52,211,153,0.2)',
  },
  okay: {
    gradient: 'linear-gradient(135deg, rgba(96,165,250,0.12) 0%, rgba(147,197,253,0.08) 100%)',
    glowColor: 'rgba(96,165,250,0.18)',
  },
  sad: {
    gradient: 'linear-gradient(135deg, rgba(129,140,248,0.12) 0%, rgba(165,180,252,0.08) 100%)',
    glowColor: 'rgba(129,140,248,0.18)',
  },
  stressed: {
    gradient: 'linear-gradient(135deg, rgba(251,113,133,0.12) 0%, rgba(253,164,175,0.08) 100%)',
    glowColor: 'rgba(251,113,133,0.18)',
  },
  tired: {
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(196,181,253,0.08) 100%)',
    glowColor: 'rgba(167,139,250,0.18)',
  },
}

const defaultAtmosphere: MoodAtmosphereConfig = {
  gradient: 'none',
  glowColor: 'transparent',
  accentColor: '#8B5CF6',
  cssVariable: '#F8FAFC',
}

export function getMoodAtmosphere(mood: string | null, isKidsMode = false): MoodAtmosphereConfig {
  if (!mood) return defaultAtmosphere

  const base = moodAtmosphereMap[mood] || defaultAtmosphere
  if (!isKidsMode) return base

  const overrides = kidsOverrides[mood]
  if (!overrides) return base

  return { ...base, ...overrides }
}
