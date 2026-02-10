import { useUserProfile } from '../../hooks/useUserProfile'
import type { VisualThemeId } from '../../data/visualThemes'

export default function ThemeDecorations() {
  const { data: profile } = useUserProfile()
  const themeId = (profile?.visual_theme || 'default') as VisualThemeId

  if (themeId === 'default' || themeId === 'private-notebook') {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      {themeId === 'night-ritual' && <NightRitualDecorations />}
      {themeId === 'diary' && <DiaryDecorations />}
      {themeId === 'cosmic-calm' && <CosmicCalmDecorations />}
    </div>
  )
}

// Pre-generate star positions to avoid re-rendering
const nightStars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  width: Math.random() * 2.5 + 0.5,
  top: Math.random() * 50,
  left: Math.random() * 100,
  opacity: Math.random() * 0.6 + 0.2,
  delay: Math.random() * 3,
  duration: Math.random() * 2 + 2,
}))

function NightRitualDecorations() {
  return (
    <>
      {/* Stars */}
      <div className="absolute inset-0">
        {nightStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width + 'px',
              height: star.width + 'px',
              top: star.top + '%',
              left: star.left + '%',
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Large Moon with glow */}
      <div className="absolute top-20 right-4 sm:right-8 md:right-12 lg:right-20">
        <div className="relative">
          {/* Outer glow */}
          <div className="absolute -inset-12 bg-amber-300/15 rounded-full blur-3xl" />
          <div className="absolute -inset-8 bg-yellow-200/25 rounded-full blur-2xl" />
          <div className="absolute -inset-4 bg-yellow-100/35 rounded-full blur-xl" />

          {/* Moon body */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-200 rounded-full relative overflow-hidden">
            {/* Moon surface texture */}
            <div className="absolute top-3 left-4 w-4 h-4 bg-amber-200/50 rounded-full blur-sm" />
            <div className="absolute top-8 right-5 w-3 h-3 bg-yellow-300/40 rounded-full blur-sm" />
            <div className="absolute bottom-6 left-8 w-5 h-5 bg-orange-200/30 rounded-full blur-sm" />
            <div className="absolute top-12 left-3 w-2 h-2 bg-amber-200/40 rounded-full" />
          </div>

          {/* Crescent shadow - creates the crescent moon effect */}
          <div
            className="absolute top-0 -right-2 w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, #0f0c29, #1a1a2e, #302b63)',
              transform: 'translateX(8px)'
            }}
          />
        </div>
      </div>

      {/* Clouds - larger and more prominent */}
      <div className="absolute bottom-40 -left-16 opacity-50">
        <svg width="280" height="100" viewBox="0 0 280 100" fill="none">
          <ellipse cx="70" cy="60" rx="60" ry="30" fill="url(#cloudGrad1)" />
          <ellipse cx="130" cy="55" rx="55" ry="28" fill="url(#cloudGrad1)" />
          <ellipse cx="190" cy="62" rx="50" ry="25" fill="url(#cloudGrad1)" />
          <ellipse cx="240" cy="58" rx="45" ry="24" fill="url(#cloudGrad1)" />
          <defs>
            <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#312e81" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-24 right-0 opacity-40 translate-x-8">
        <svg width="240" height="90" viewBox="0 0 240 90" fill="none">
          <ellipse cx="60" cy="50" rx="50" ry="26" fill="url(#cloudGrad2)" />
          <ellipse cx="120" cy="45" rx="45" ry="24" fill="url(#cloudGrad2)" />
          <ellipse cx="175" cy="52" rx="48" ry="25" fill="url(#cloudGrad2)" />
          <defs>
            <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4338ca" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Additional small cloud near moon */}
      <div className="absolute top-48 right-20 opacity-30">
        <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
          <ellipse cx="35" cy="28" rx="30" ry="15" fill="url(#cloudGrad3)" />
          <ellipse cx="70" cy="25" rx="28" ry="14" fill="url(#cloudGrad3)" />
          <ellipse cx="95" cy="28" rx="22" ry="12" fill="url(#cloudGrad3)" />
          <defs>
            <linearGradient id="cloudGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  )
}

function DiaryDecorations() {
  return (
    <>
      {/* Sun - large and prominent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
        <div className="relative">
          {/* Outer glow rings */}
          <div className="absolute -inset-24 bg-orange-400/10 rounded-full blur-3xl" />
          <div className="absolute -inset-16 bg-yellow-400/15 rounded-full blur-2xl" />
          <div className="absolute -inset-10 bg-amber-300/25 rounded-full blur-xl" />
          <div className="absolute -inset-6 bg-yellow-200/35 rounded-full blur-lg" />

          {/* Sun body */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-b from-yellow-100 via-amber-200 to-orange-400 rounded-full opacity-95">
            {/* Inner highlight */}
            <div className="absolute top-2 left-1/4 w-8 h-8 bg-white/30 rounded-full blur-md" />
          </div>
        </div>
      </div>

      {/* Horizon / water effect */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5 overflow-hidden">
        {/* Water gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-600/5 to-blue-900/30" />

        {/* Sun reflection on water */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-32 bg-gradient-to-b from-orange-400/40 via-yellow-400/20 to-transparent blur-sm" />

        {/* Water shimmer lines */}
        <div className="absolute top-8 left-1/3 w-40 h-0.5 bg-gradient-to-r from-transparent via-yellow-300/50 to-transparent" />
        <div className="absolute top-16 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />
        <div className="absolute top-24 right-1/3 w-28 h-0.5 bg-gradient-to-r from-transparent via-amber-200/35 to-transparent" />
        <div className="absolute top-32 left-2/5 w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent" />
        <div className="absolute top-40 right-1/4 w-36 h-0.5 bg-gradient-to-r from-transparent via-orange-200/25 to-transparent" />
      </div>

      {/* Birds silhouette */}
      <div className="absolute top-32 left-1/4 opacity-30">
        <svg width="80" height="30" viewBox="0 0 80 30" fill="none" stroke="#1c1917" strokeWidth="2">
          <path d="M5 15 Q12 8 20 15 Q28 8 35 15" />
          <path d="M50 12 Q56 6 63 12 Q70 6 77 12" />
        </svg>
      </div>
      <div className="absolute top-40 right-1/3 opacity-20">
        <svg width="50" height="20" viewBox="0 0 50 20" fill="none" stroke="#1c1917" strokeWidth="1.5">
          <path d="M5 10 Q10 5 15 10 Q20 5 25 10" />
          <path d="M30 8 Q35 4 40 8 Q45 4 50 8" />
        </svg>
      </div>
    </>
  )
}

// Pre-generate cosmic stars
const cosmicStars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  width: Math.random() * 2.5 + 0.5,
  top: Math.random() * 100,
  left: Math.random() * 100,
  opacity: Math.random() * 0.7 + 0.2,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
  color: ['#fff', '#c4b5fd', '#a78bfa', '#818cf8', '#e9d5ff'][Math.floor(Math.random() * 5)],
}))

function CosmicCalmDecorations() {
  return (
    <>
      {/* Stars */}
      <div className="absolute inset-0">
        {cosmicStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: star.width + 'px',
              height: star.width + 'px',
              top: star.top + '%',
              left: star.left + '%',
              opacity: star.opacity,
              backgroundColor: star.color,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Nebula glows - larger and more colorful */}
      <div className="absolute top-16 right-8 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
      <div className="absolute top-1/4 -left-10 w-64 h-64 bg-indigo-600/12 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-fuchsia-600/8 rounded-full blur-3xl" />

      {/* Bright stars */}
      <div className="absolute top-24 left-1/4">
        <div className="w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50" />
      </div>
      <div className="absolute top-40 right-1/3">
        <div className="w-1.5 h-1.5 bg-purple-200 rounded-full shadow-md shadow-purple-300/50" />
      </div>
      <div className="absolute bottom-1/3 left-1/5">
        <div className="w-2 h-2 bg-indigo-200 rounded-full shadow-lg shadow-indigo-300/50" />
      </div>

      {/* Shooting stars */}
      <div className="absolute top-28 left-1/3 opacity-60">
        <div className="w-20 h-0.5 bg-gradient-to-r from-white via-purple-200 to-transparent rotate-[30deg]" style={{ animation: 'shootingStar 4s ease-out infinite' }} />
      </div>
      <div className="absolute top-1/2 right-1/4 opacity-40">
        <div className="w-16 h-0.5 bg-gradient-to-r from-white via-indigo-200 to-transparent rotate-[45deg]" style={{ animation: 'shootingStar 6s ease-out 2s infinite' }} />
      </div>
    </>
  )
}
