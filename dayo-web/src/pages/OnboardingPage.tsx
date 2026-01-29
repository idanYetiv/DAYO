import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useUpdateUserProfile } from '../hooks/useUserProfile'
import ProfileTypeSelector from '../components/onboarding/ProfileTypeSelector'
import type { ProfileType } from '../hooks/useProfileMode'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const updateProfile = useUpdateUserProfile()
  const [selectedType, setSelectedType] = useState<ProfileType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    if (!selectedType) return

    setIsSubmitting(true)
    try {
      await updateProfile.mutateAsync({
        profile_type: selectedType,
        onboarding_completed: true,
      })
      navigate('/today')
    } catch (error) {
      console.error('Failed to save profile type:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dayo-gray-50 to-dayo-purple/5 flex flex-col">
      {/* Header */}
      <header className="px-6 py-8 text-center">
        <div className="w-16 h-16 bg-dayo-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-dayo">
          <span className="text-white font-bold text-2xl">D</span>
        </div>
        <h1 className="text-3xl font-bold text-dayo-gray-900 mb-2">
          Welcome to DAYO
        </h1>
        <p className="text-dayo-gray-500 max-w-md mx-auto">
          Choose your experience. You can always change this later in settings.
        </p>
      </header>

      {/* Profile Type Selection */}
      <main className="flex-1 px-6 pb-8 flex flex-col items-center justify-center">
        <ProfileTypeSelector
          selectedType={selectedType}
          onSelect={setSelectedType}
        />
      </main>

      {/* Footer with Continue button */}
      <footer className="px-6 pb-8 pt-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedType || isSubmitting}
            className={`
              w-full py-4 rounded-2xl font-semibold text-lg
              transition-all duration-300 flex items-center justify-center gap-2
              ${selectedType
                ? 'bg-dayo-gradient text-white shadow-dayo hover:shadow-dayo-lg hover:scale-[1.02]'
                : 'bg-dayo-gray-200 text-dayo-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Setting up...
              </>
            ) : (
              "Let's Go!"
            )}
          </button>

          {/* Skip option */}
          <button
            onClick={() => {
              updateProfile.mutate({ onboarding_completed: true })
              navigate('/today')
            }}
            className="w-full mt-3 py-2 text-sm text-dayo-gray-400 hover:text-dayo-gray-600 transition-colors"
          >
            Skip for now (default to Adults mode)
          </button>
        </div>
      </footer>
    </div>
  )
}
