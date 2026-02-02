import type { ReactNode } from 'react'
import { getMoodAtmosphere } from '../../lib/moodAtmosphere'
import { useProfileMode } from '../../hooks/useProfileMode'

interface WritingAtmosphereProps {
  mood: string
  children: ReactNode
  fullscreen?: boolean
}

export default function WritingAtmosphere({ mood, children, fullscreen = false }: WritingAtmosphereProps) {
  const { isKidsMode } = useProfileMode()
  const atmosphere = getMoodAtmosphere(mood || null, isKidsMode)

  if (fullscreen) {
    return (
      <div
        className="flex-1 flex flex-col relative"
        style={{
          background: atmosphere.gradient,
          '--mood-bg': atmosphere.cssVariable,
        } as React.CSSProperties}
      >
        {/* Breathing glow */}
        {mood && (
          <div
            className="diary-glow"
            style={{ boxShadow: `0 0 80px 40px ${atmosphere.glowColor}` }}
          />
        )}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      className="mood-atmosphere relative"
      style={{ background: atmosphere.gradient }}
    >
      {/* Breathing glow */}
      {mood && (
        <div
          className="diary-glow"
          style={{ boxShadow: `0 0 60px 30px ${atmosphere.glowColor}` }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
