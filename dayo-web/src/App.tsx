import { useEffect } from 'react'
import { BrowserRouter, MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isNativePlatform } from './lib/platform'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useAuthStore } from './store/authStore'
import { ProfileModeProvider } from './contexts/ProfileModeContext'
import { useProfileMode } from './hooks/useProfileMode'
import { useUserProfile } from './hooks/useUserProfile'
import { useDirection } from './hooks/useDirection'
import { visualThemes, type VisualThemeId } from './data/visualThemes'
import ThemeDecorations from './components/ui/ThemeDecorations'
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
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import SubscriptionPage from './pages/SubscriptionPage'
import { initializeRevenueCat } from './lib/revenuecat'

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

// Component to apply text direction for RTL languages
function DirectionApplier({ children }: { children: React.ReactNode }) {
  const { dir } = useDirection()
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', i18n.language)
  }, [dir, i18n.language])

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

// Theme color mapping
const themeColorMap: Record<string, { primary: string; gradient: string }> = {
  purple: { primary: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' },
  blue: { primary: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)' },
  green: { primary: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)' },
  orange: { primary: '#F97316', gradient: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)' },
  pink: { primary: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' },
}

// Component to apply theme color
function ThemeColorApplier({ children }: { children: React.ReactNode }) {
  const { data: profile } = useUserProfile()

  useEffect(() => {
    const themeColor = profile?.theme_color || 'purple'
    const colors = themeColorMap[themeColor] || themeColorMap.purple

    document.documentElement.style.setProperty('--dayo-primary', colors.primary)
    document.documentElement.style.setProperty('--dayo-gradient', colors.gradient)
    document.documentElement.setAttribute('data-theme', themeColor)

    return () => {
      document.documentElement.style.removeProperty('--dayo-primary')
      document.documentElement.style.removeProperty('--dayo-gradient')
      document.documentElement.removeAttribute('data-theme')
    }
  }, [profile?.theme_color])

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

// Component to apply visual theme
function VisualThemeApplier({ children }: { children: React.ReactNode }) {
  const { data: profile } = useUserProfile()

  useEffect(() => {
    const themeId = (profile?.visual_theme || 'default') as VisualThemeId
    const theme = visualThemes[themeId]
    if (!theme) return

    const root = document.documentElement

    // Apply CSS variables
    root.style.setProperty('--visual-theme-primary', theme.colors.primary)
    root.style.setProperty('--visual-theme-gradient', theme.colors.gradient)
    root.style.setProperty('--visual-theme-bg', theme.colors.background)
    root.style.setProperty('--visual-theme-card-bg', theme.colors.cardBg)
    root.style.setProperty('--visual-theme-text', theme.colors.textPrimary)
    root.style.setProperty('--visual-theme-text-secondary', theme.colors.textSecondary)

    // Apply dark class for dark themes (unless user has explicit dark mode setting)
    if (theme.isDark && themeId !== 'default') {
      root.classList.add('dark')
    }

    // Apply theme-specific class
    root.setAttribute('data-visual-theme', themeId)

    // Apply background image if theme has one and user doesn't have custom background
    if (theme.backgroundImage && !profile?.background_image) {
      document.body.style.backgroundImage = theme.backgroundImage
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundAttachment = 'fixed'
    }

    return () => {
      root.removeAttribute('data-visual-theme')
      root.style.removeProperty('--visual-theme-primary')
      root.style.removeProperty('--visual-theme-gradient')
      root.style.removeProperty('--visual-theme-bg')
      root.style.removeProperty('--visual-theme-card-bg')
      root.style.removeProperty('--visual-theme-text')
      root.style.removeProperty('--visual-theme-text-secondary')
      // Only clear background if it was set by visual theme
      if (theme.backgroundImage && !profile?.background_image) {
        document.body.style.backgroundImage = ''
        document.body.style.backgroundSize = ''
        document.body.style.backgroundAttachment = ''
      }
    }
  }, [profile?.visual_theme, profile?.background_image])

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
        <ThemeColorApplier>
          <DarkModeApplier>
            <VisualThemeApplier>
              <BackgroundApplier>
                <KidsModeClassApplier>
                  <OnboardingGuard>
                    <ThemeDecorations />
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
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />

              {/* Redirect authenticated users from public routes */}
              <Route path="/" element={<Navigate to="/today" />} />
              <Route path="/login" element={<Navigate to="/today" />} />
              <Route path="/signup" element={<Navigate to="/today" />} />
            </Routes>
                  </OnboardingGuard>
                </KidsModeClassApplier>
              </BackgroundApplier>
            </VisualThemeApplier>
          </DarkModeApplier>
        </ThemeColorApplier>
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
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      {/* Redirect to login for any protected route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

function App() {
  const { user, loading, initialize } = useAuthStore()
  const { t } = useTranslation()

  useEffect(() => {
    initialize()
    initializeRevenueCat()
  }, [initialize])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dayo-gray-50">
        <div className="text-center">
          <img src="/logo.png" alt="DAYO" className="w-12 h-12 rounded-2xl mx-auto mb-4" />
          <p className="text-dayo-gray-500">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionApplier>
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
      </DirectionApplier>
    </QueryClientProvider>
  )
}

export default App
