import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface ThemedHeaderProps {
  title?: string
  children?: ReactNode
  showLogo?: boolean
  /** @deprecated Use startContent instead */
  leftContent?: ReactNode
  /** @deprecated Use endContent instead */
  rightContent?: ReactNode
  /** Content at the start of the header (left in LTR, right in RTL) */
  startContent?: ReactNode
  /** Content at the end of the header (right in LTR, left in RTL) */
  endContent?: ReactNode
  className?: string
}

export default function ThemedHeader({
  title,
  children,
  showLogo = true,
  leftContent,
  rightContent,
  startContent,
  endContent,
  className = ''
}: ThemedHeaderProps) {
  const { t } = useTranslation()

  // Support both old and new prop names for backwards compatibility
  const resolvedStartContent = startContent ?? leftContent
  const resolvedEndContent = endContent ?? rightContent

  return (
    <header className={`themed-header px-4 py-3 ${className}`}>
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {resolvedStartContent}
          {showLogo && (
            <>
              <img
                src="/logo.png"
                alt={t('appName')}
                className="w-8 h-8 rounded-lg shadow-sm flex-shrink-0"
              />
              <span className="themed-header-title text-xl font-bold truncate">
                {title || t('appName')}
              </span>
            </>
          )}
          {!showLogo && title && (
            <h1 className="themed-header-title text-xl font-bold truncate">{title}</h1>
          )}
          {children}
        </div>
        {resolvedEndContent && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {resolvedEndContent}
          </div>
        )}
      </div>
    </header>
  )
}
