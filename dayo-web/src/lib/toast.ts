import { toast } from 'sonner'

// Task notifications
export const taskToast = {
  created: () => toast.success('Task added'),
  completed: () => toast.success('Task completed!'),
  deleted: () => toast('Task deleted'),
  error: (message?: string) => toast.error(message || 'Failed to update task'),
}

// Diary notifications
export const diaryToast = {
  saved: () => toast.success('Diary saved'),
  moodUpdated: () => toast.success('Mood updated'),
  error: (message?: string) => toast.error(message || 'Failed to save diary'),
}

// Streak notifications
export const streakToast = {
  continued: (days: number) => toast.success(`${days} day streak!`, {
    icon: '🔥',
  }),
  milestone: (days: number) => toast.success(`Amazing! ${days} day streak!`, {
    icon: '🎉',
    duration: 5000,
  }),
  broken: () => toast('Streak reset. Start fresh today!', {
    icon: '💪',
  }),
}

// General notifications
export const appToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast(message),
  loading: (message: string) => toast.loading(message),
}
