import { useEffect } from 'react'
import { BrowserRouter, MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isNativePlatform } from './lib/platform'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useAuthStore } from './store/authStore'
import { ProfileModeProvider } from './contexts/ProfileModeContext'
import { useProfileMode } from './hooks/useProfileMode'
import { useUserProfile } from './hooks/useUserProfile'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import DashboardPage from './pages/DashboardPage'
import TodayPage from './pages/TodayPage'
import DiaryPage from './pages/DiaryPage'
import GoalsPage from './pages/GoalsPage'
import HabitsPage from './pages/HabitsPage'
import SettingsPage from './pages/SettingsPage'
import CalendarPage from './pages/CalendarPage'
import AIAssistantPage from './pages/AIAssistantPage'
import OnboardingPage from './pages/OnboardingPage'
import LandingPage from './pages/LandingPage'

const queryClient = new QueryClient()

// Component to apply kids-mode class to document
function KidsModeClassApplier({ children }: { children: React.ReactNode }) {
  const { isKidsMode } = useProfileMode()

  useEffect(() => {
    if (isKidsMode) {
      document.documentElement.classList.add('kids-mode')
    } else {
      document.documentElement.classList.remove('kids-mode')
    }
    return () => {
      document.documentElement.classList.remove('kids-mode')
    }
  }, [isKidsMode])

  return <>{children}</>
}

// Component to apply dark mode class to document
function DarkModeApplier({ children }: { children: React.ReactNode }) {
  const { data: profile } = useUserProfile()

  useEffect(() => {
    if (profile?.dark_mode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [profile?.dark_mode])

  return <>{children}</>
}

// Component to apply custom background
function BackgroundApplier({ children }: { children: React.ReactNode }) {
  const { data: profile } = useUserProfile()

  useEffect(() => {
    if (profile?.background_image) {
      const bg = profile.background_image
      // Add class to enable transparent page backgrounds
      document.documentElement.classList.add('has-custom-bg')

      if (bg.startsWith('data:') || bg.startsWith('http')) {
        document.body.style.backgroundImage = `url(${bg})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundAttachment = 'fixed'
      } else if (bg.startsWith('linear-gradient')) {
        document.body.style.backgroundImage = bg
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundAttachment = 'fixed'
      }
    } else {
      document.documentElement.classList.remove('has-custom-bg')
      document.body.style.backgroundImage = ''
      document.body.style.backgroundSize = ''
      document.body.style.backgroundPosition = ''
      document.body.style.backgroundAttachment = ''
    }
    return () => {
      document.documentElement.classList.remove('has-custom-bg')
      document.body.style.backgroundImage = ''
      document.body.style.backgroundSize = ''
      document.body.style.backgroundPosition = ''
      document.body.style.backgroundAttachment = ''
    }
  }, [profile?.background_image])

  return <>{children}</>
}

// Component to check onboarding status and redirect if needed
function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { onboardingCompleted, isLoading } = useProfileMode()
  const location = useLocation()

  // If still loading, don't redirect yet
  if (isLoading) {
    return <>{children}</>
  }

  // If on onboarding page, always allow
  if (location.pathname === '/onboarding') {
    return <>{children}</>
  }

  // If onboarding not completed, redirect to onboarding
  if (!onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

function PasswordRecoveryRedirect({ children }: { children: React.ReactNode }) {
  const { isPasswordRecovery } = useAuthStore()
  const location = useLocation()

  if (isPasswordRecovery && location.pathname !== '/reset-password') {
    return <Navigate to="/reset-password" replace />
  }

  return <>{children}</>
}

function AuthenticatedRoutes() {
  return (
    <PasswordRecoveryRedirect>
      <ProfileModeProvider>
        <DarkModeApplier>
          <BackgroundApplier>
            <KidsModeClassApplier>
              <OnboardingGuard>
            <Routes>
              {/* Onboarding */}
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Password reset (authenticated via email link) */}
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected routes */}
              <Route path="/today" element={<TodayPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/diary" element={<DiaryPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/ai" element={<AIAssistantPage />} />

              {/* Redirect authenticated users from public routes */}
              <Route path="/" element={<Navigate to="/today" />} />
              <Route path="/login" element={<Navigate to="/today" />} />
              <Route path="/signup" element={<Navigate to="/today" />} />
            </Routes>
              </OnboardingGuard>
            </KidsModeClassApplier>
          </BackgroundApplier>
        </DarkModeApplier>
      </ProfileModeProvider>
    </PasswordRecoveryRedirect>
  )
}

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      {/* Redirect to login for any protected route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dayo-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-dayo-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <p className="text-dayo-gray-500">Loading DAYO...</p>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 3000,
        }}
      />
      {isNativePlatform() ? (
        <MemoryRouter initialEntries={[user ? '/today' : '/login']}>
          {user ? <AuthenticatedRoutes /> : <PublicRoutes />}
        </MemoryRouter>
      ) : (
        <BrowserRouter>
          {user ? <AuthenticatedRoutes /> : <PublicRoutes />}
        </BrowserRouter>
      )}
    </QueryClientProvider>
  )
}

export default App
