import { useProfileModeContext, type ProfileType } from '../contexts/ProfileModeContext'

export function useProfileMode() {
  const context = useProfileModeContext()
  return context
}

export function useOnboardingStatus() {
  const { onboardingCompleted, isLoading } = useProfileModeContext()
  return { onboardingCompleted, isLoading }
}

export type { ProfileType }
