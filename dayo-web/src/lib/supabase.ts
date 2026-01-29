import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Custom types for diary features
export interface DiaryHighlight {
  emoji: string
  text: string
}

// Database Types (will be auto-generated later)
export type Database = {
  public: {
    Tables: {
      days: {
        Row: {
          id: string
          user_id: string
          date: string
          mood: string | null
          diary_text: string | null
          photos: string[]
          gratitude: string[]
          highlights: DiaryHighlight[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          mood?: string | null
          diary_text?: string | null
          photos?: string[]
          gratitude?: string[]
          highlights?: DiaryHighlight[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          mood?: string | null
          diary_text?: string | null
          photos?: string[]
          gratitude?: string[]
          highlights?: DiaryHighlight[]
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          date: string
          title: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          title: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          title?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_stats: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: 'yearly' | 'monthly' | 'weekly'
          color: string
          icon: string
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category: 'yearly' | 'monthly' | 'weekly'
          color?: string
          icon?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category?: 'yearly' | 'monthly' | 'weekly'
          color?: string
          icon?: string
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          goal_id: string
          user_id: string
          title: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          user_id: string
          title: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          user_id?: string
          title?: string
          completed?: boolean
          created_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          icon: string
          color: string
          frequency: 'daily' | 'weekly'
          target_per_week: number
          time_of_day: 'morning' | 'afternoon' | 'evening' | 'anytime'
          archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          icon?: string
          color?: string
          frequency: 'daily' | 'weekly'
          target_per_week?: number
          time_of_day?: 'morning' | 'afternoon' | 'evening' | 'anytime'
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          icon?: string
          color?: string
          frequency?: 'daily' | 'weekly'
          target_per_week?: number
          time_of_day?: 'morning' | 'afternoon' | 'evening' | 'anytime'
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          date?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          user_id: string
          display_name: string | null
          avatar_url: string | null
          dark_mode: boolean
          notifications_enabled: boolean
          daily_reminder_enabled: boolean
          daily_reminder_time: string
          theme_color: 'purple' | 'blue' | 'green' | 'orange' | 'pink'
          profile_type: 'adult' | 'kid'
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          dark_mode?: boolean
          notifications_enabled?: boolean
          daily_reminder_enabled?: boolean
          daily_reminder_time?: string
          theme_color?: 'purple' | 'blue' | 'green' | 'orange' | 'pink'
          profile_type?: 'adult' | 'kid'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          dark_mode?: boolean
          notifications_enabled?: boolean
          daily_reminder_enabled?: boolean
          daily_reminder_time?: string
          theme_color?: 'purple' | 'blue' | 'green' | 'orange' | 'pink'
          profile_type?: 'adult' | 'kid'
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
