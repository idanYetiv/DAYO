import { Loader2, Check, AlertCircle } from 'lucide-react'

interface SaveIndicatorProps {
  state: 'idle' | 'saving' | 'saved' | 'error'
}

export default function SaveIndicator({ state }: SaveIndicatorProps) {
  return (
    <div className={`save-indicator is-${state}`} aria-live="polite">
      {state === 'saving' && (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {state === 'saved' && (
        <>
          <Check className="w-3 h-3" />
          <span>Saved</span>
        </>
      )}
      {state === 'error' && (
        <>
          <AlertCircle className="w-3 h-3" />
          <span>Save failed</span>
        </>
      )}
    </div>
  )
}
