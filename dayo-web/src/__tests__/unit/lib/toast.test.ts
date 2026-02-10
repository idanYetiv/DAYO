import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'
import { taskToast, diaryToast, streakToast, appToast } from '../../../lib/toast'

// Mock sonner
vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  }),
}))

// Mock i18n - the toast module uses i18n.t() which returns the translation key in tests
vi.mock('../../../i18n', () => ({
  default: {
    t: (key: string, options?: Record<string, unknown>) => {
      // Return the translation key (or interpolated value for streak messages)
      if (options && 'days' in options) {
        // Handle streak messages with interpolation
        if (key === 'toast.streak.continued' || key === 'toast.streak.continuedKids') {
          return `${options.days} day streak!`
        }
        if (key === 'toast.streak.milestone') {
          return `Amazing! ${options.days} day streak!`
        }
      }
      // Map translation keys to expected English values for tests
      const translations: Record<string, string> = {
        'toast.task.created.adult': 'Task added',
        'toast.task.completed.adult': 'Great job!',
        'toast.task.deleted.adult': 'Task removed',
        'toast.task.error': 'Failed to update task',
        'toast.diary.saved.adult': 'Entry saved',
        'toast.diary.moodUpdated': 'Mood updated',
        'toast.diary.error': 'Failed to save diary',
        'toast.streak.broken': 'Streak reset. Start fresh today!',
      }
      return translations[key] || key
    },
  },
}))

describe('Toast Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('taskToast', () => {
    it('should show success toast when task created', () => {
      taskToast.created()
      expect(toast.success).toHaveBeenCalledWith('Task added')
    })

    it('should show success toast when task completed', () => {
      taskToast.completed()
      expect(toast.success).toHaveBeenCalledWith('Great job!')
    })

    it('should show toast when task deleted', () => {
      taskToast.deleted()
      expect(toast).toHaveBeenCalledWith('Task removed')
    })

    it('should show error toast with default message', () => {
      taskToast.error()
      expect(toast.error).toHaveBeenCalledWith('Failed to update task')
    })

    it('should show error toast with custom message', () => {
      taskToast.error('Custom error')
      expect(toast.error).toHaveBeenCalledWith('Custom error')
    })
  })

  describe('diaryToast', () => {
    it('should show success toast when diary saved', () => {
      diaryToast.saved()
      expect(toast.success).toHaveBeenCalledWith('Entry saved')
    })

    it('should show success toast when mood updated', () => {
      diaryToast.moodUpdated()
      expect(toast.success).toHaveBeenCalledWith('Mood updated')
    })

    it('should show error toast with default message', () => {
      diaryToast.error()
      expect(toast.error).toHaveBeenCalledWith('Failed to save diary')
    })
  })

  describe('streakToast', () => {
    it('should show streak continued toast with day count', () => {
      streakToast.continued(5)
      expect(toast.success).toHaveBeenCalledWith('5 day streak!', { icon: '🔥' })
    })

    it('should show milestone toast with longer duration', () => {
      streakToast.milestone(30)
      expect(toast.success).toHaveBeenCalledWith('Amazing! 30 day streak!', {
        icon: '🎉',
        duration: 5000,
      })
    })

    it('should show broken streak toast', () => {
      streakToast.broken()
      expect(toast).toHaveBeenCalledWith('Streak reset. Start fresh today!', {
        icon: '💪',
      })
    })
  })

  describe('appToast', () => {
    it('should show success toast', () => {
      appToast.success('Success message')
      expect(toast.success).toHaveBeenCalledWith('Success message')
    })

    it('should show error toast', () => {
      appToast.error('Error message')
      expect(toast.error).toHaveBeenCalledWith('Error message')
    })

    it('should show info toast', () => {
      appToast.info('Info message')
      expect(toast).toHaveBeenCalledWith('Info message')
    })

    it('should show loading toast', () => {
      appToast.loading('Loading...')
      expect(toast.loading).toHaveBeenCalledWith('Loading...')
    })
  })
})
