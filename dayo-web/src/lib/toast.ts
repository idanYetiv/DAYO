import { toast } from 'sonner'
import i18n from '../i18n'

// Helper to get translations
const t = (key: string, options?: Record<string, unknown>) => {
  return i18n.t(key, { ns: 'common', ...options })
}

// Check if kids mode is active
const isKidsMode = () => {
  return document.documentElement.classList.contains('kids-mode')
}

// Task notifications
export const taskToast = {
  created: () => toast.success(t(isKidsMode() ? 'toast.task.created.kids' : 'toast.task.created.adult')),
  completed: () => toast.success(t(isKidsMode() ? 'toast.task.completed.kids' : 'toast.task.completed.adult')),
  deleted: () => toast(t(isKidsMode() ? 'toast.task.deleted.kids' : 'toast.task.deleted.adult')),
  error: (message?: string) => toast.error(message || t('toast.task.error')),
}

// Diary notifications
export const diaryToast = {
  saved: () => toast.success(t(isKidsMode() ? 'toast.diary.saved.kids' : 'toast.diary.saved.adult')),
  moodUpdated: () => toast.success(t('toast.diary.moodUpdated')),
  error: (message?: string) => toast.error(message || t('toast.diary.error')),
}

// Streak notifications
export const streakToast = {
  continued: (days: number) => toast.success(
    t(isKidsMode() ? 'toast.streak.continuedKids' : 'toast.streak.continued', { days }),
    { icon: '🔥' }
  ),
  milestone: (days: number) => toast.success(
    t('toast.streak.milestone', { days }),
    { icon: '🎉', duration: 5000 }
  ),
  broken: () => toast(t('toast.streak.broken'), { icon: '💪' }),
}

// General notifications
export const appToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message),
  loading: (message: string) => toast.loading(message),
}
