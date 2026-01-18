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
      expect(toast.success).toHaveBeenCalledWith('Task completed!')
    })

    it('should show toast when task deleted', () => {
      taskToast.deleted()
      expect(toast).toHaveBeenCalledWith('Task deleted')
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
      expect(toast.success).toHaveBeenCalledWith('Diary saved')
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
