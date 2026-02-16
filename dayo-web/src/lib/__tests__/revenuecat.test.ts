import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock platform to control isNativePlatform
vi.mock('../platform', () => ({
  isNativePlatform: vi.fn(() => false),
}))

import { initializeRevenueCat, identifyUser, logoutUser } from '../revenuecat'
import { isNativePlatform } from '../platform'

const mockIsNative = vi.mocked(isNativePlatform)

describe('revenuecat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsNative.mockReturnValue(false)
  })

  describe('initializeRevenueCat', () => {
    it('should do nothing on web', async () => {
      mockIsNative.mockReturnValue(false)
      await expect(initializeRevenueCat()).resolves.toBeUndefined()
    })
  })

  describe('identifyUser', () => {
    it('should do nothing on web', async () => {
      mockIsNative.mockReturnValue(false)
      await expect(identifyUser('user-123')).resolves.toBeUndefined()
    })
  })

  describe('logoutUser', () => {
    it('should do nothing on web', async () => {
      mockIsNative.mockReturnValue(false)
      await expect(logoutUser()).resolves.toBeUndefined()
    })
  })
})
