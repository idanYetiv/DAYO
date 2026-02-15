import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { identifyUser, logoutUser } from '../lib/revenuecat'

interface AuthState {
  user: User | null
  loading: boolean
  isPasswordRecovery: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  clearPasswordRecovery: () => void
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isPasswordRecovery: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  clearPasswordRecovery: () => set({ isPasswordRecovery: false }),
  signOut: async () => {
    await logoutUser()
    await supabase.auth.signOut()
    set({ user: null, isPasswordRecovery: false })
  },
  initialize: async () => {
    set({ loading: true })
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })
    if (session?.user) {
      identifyUser(session.user.id)
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        set({ user: session?.user ?? null, isPasswordRecovery: true })
      } else {
        set({ user: session?.user ?? null })
      }
      if (session?.user) {
        identifyUser(session.user.id)
      }
    })
  },
}))
