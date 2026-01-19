import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import TodayPage from './pages/TodayPage'
import DiaryPage from './pages/DiaryPage'
import GoalsPage from './pages/GoalsPage'
import HabitsPage from './pages/HabitsPage'
import SettingsPage from './pages/SettingsPage'
import CalendarPage from './pages/CalendarPage'
import AIAssistantPage from './pages/AIAssistantPage'

const queryClient = new QueryClient()

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
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/today" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/today" /> : <SignupPage />}
          />

          {/* Protected routes */}
          <Route
            path="/today"
            element={user ? <TodayPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={user ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/diary"
            element={user ? <DiaryPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/goals"
            element={user ? <GoalsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/habits"
            element={user ? <HabitsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/calendar"
            element={user ? <CalendarPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/ai"
            element={user ? <AIAssistantPage /> : <Navigate to="/login" />}
          />

          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to={user ? "/today" : "/login"} />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
