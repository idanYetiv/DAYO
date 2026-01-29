import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useUserProfile, useUpdateUserProfile } from '../hooks/useUserProfile'

export type ProfileType = 'adult' | 'kid'

interface ProfileModeContextType {
  profileType: ProfileType
  setProfileType: (type: ProfileType) => void
  isKidsMode: boolean
  isLoading: boolean
  onboardingCompleted: boolean
}

const ProfileModeContext = createContext<ProfileModeContextType | undefined>(undefined)

interface ProfileModeProviderProps {
  children: ReactNode
}

export function ProfileModeProvider({ children }: ProfileModeProviderProps) {
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  const updateProfile = useUpdateUserProfile()
  const [localProfileType, setLocalProfileType] = useState<ProfileType>('adult')

  // Sync with profile data when it loads
  useEffect(() => {
    if (profile?.profile_type) {
      setLocalProfileType(profile.profile_type)
    }
  }, [profile?.profile_type])

  const setProfileType = (type: ProfileType) => {
    setLocalProfileType(type)
    updateProfile.mutate({ profile_type: type })
  }

  const value: ProfileModeContextType = {
    profileType: localProfileType,
    setProfileType,
    isKidsMode: localProfileType === 'kid',
    isLoading: profileLoading,
    onboardingCompleted: profile?.onboarding_completed ?? true, // Default to true for existing users
  }

  return (
    <ProfileModeContext.Provider value={value}>
      {children}
    </ProfileModeContext.Provider>
  )
}

export function useProfileModeContext() {
  const context = useContext(ProfileModeContext)
  if (context === undefined) {
    throw new Error('useProfileModeContext must be used within a ProfileModeProvider')
  }
  return context
}
