import type { ReactNode } from 'react'

interface ThemedHeaderProps {
  title?: string
  children?: ReactNode
  showLogo?: boolean
  leftContent?: ReactNode
  rightContent?: ReactNode
  className?: string
}

export default function ThemedHeader({
  title,
  children,
  showLogo = true,
  leftContent,
  rightContent,
  className = ''
}: ThemedHeaderProps) {
  return (
    <header className={`themed-header px-4 py-3 ${className}`}>
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {leftContent}
          {showLogo && (
            <>
              <img
                src="/logo.png"
                alt="DAYO"
                className="w-8 h-8 rounded-lg shadow-sm"
              />
              <span className="themed-header-title text-xl font-bold">
                {title || 'DAYO'}
              </span>
            </>
          )}
          {!showLogo && title && (
            <h1 className="themed-header-title text-xl font-bold">{title}</h1>
          )}
          {children}
        </div>
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  )
}
