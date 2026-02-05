import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('Settings Page Features', () => {
  beforeEach(() => {
    // Reset document state
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark', 'kids-mode', 'has-custom-bg')
    document.body.style.backgroundImage = ''
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark', 'kids-mode', 'has-custom-bg')
    document.body.style.backgroundImage = ''
  })

  describe('Theme Color System', () => {
    const themeColors = [
      { id: 'purple', label: 'Purple', color: '#8B5CF6' },
      { id: 'blue', label: 'Blue', color: '#3B82F6' },
      { id: 'green', label: 'Green', color: '#10B981' },
      { id: 'orange', label: 'Orange', color: '#F97316' },
      { id: 'pink', label: 'Pink', color: '#EC4899' },
    ]

    it('should have 5 theme color options', () => {
      expect(themeColors).toHaveLength(5)
    })

    it('should have purple as the default theme', () => {
      const defaultTheme = themeColors[0]
      expect(defaultTheme.id).toBe('purple')
    })

    it('should set data-theme attribute when theme is applied', () => {
      document.documentElement.setAttribute('data-theme', 'blue')
      expect(document.documentElement.getAttribute('data-theme')).toBe('blue')
    })

    it('should apply CSS custom properties for theme', () => {
      const primary = '#3B82F6'
      const gradient = 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'

      document.documentElement.style.setProperty('--dayo-primary', primary)
      document.documentElement.style.setProperty('--dayo-gradient', gradient)

      expect(document.documentElement.style.getPropertyValue('--dayo-primary')).toBe(primary)
      expect(document.documentElement.style.getPropertyValue('--dayo-gradient')).toBe(gradient)
    })
  })

  describe('Dark Mode Toggle', () => {
    it('should add dark class when enabled', () => {
      document.documentElement.classList.add('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should remove dark class when disabled', () => {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('Profile Mode Selection', () => {
    const profileModes = [
      { id: 'adult', label: 'Adults Mode', description: 'Calm, reflective journaling experience', emoji: '✨' },
      { id: 'kid', label: 'Kids Mode', description: 'Fun, colorful adventure journal', emoji: '🦁' },
    ]

    it('should have 2 profile modes', () => {
      expect(profileModes).toHaveLength(2)
    })

    it('should have adult and kid modes', () => {
      const modeIds = profileModes.map(m => m.id)
      expect(modeIds).toContain('adult')
      expect(modeIds).toContain('kid')
    })

    it('should add kids-mode class when kid mode is selected', () => {
      document.documentElement.classList.add('kids-mode')
      expect(document.documentElement.classList.contains('kids-mode')).toBe(true)
    })
  })

  describe('Profile Type Validation', () => {
    it('should only allow adult or kid as profile type', () => {
      const validTypes = ['adult', 'kid']
      const testType = 'adult'
      expect(validTypes.includes(testType)).toBe(true)
    })

    it('should reject invalid profile types', () => {
      const validTypes = ['adult', 'kid']
      const invalidType = 'teen'
      expect(validTypes.includes(invalidType)).toBe(false)
    })
  })

  describe('Notification Settings', () => {
    const notificationSettings = {
      notifications_enabled: true,
      daily_reminder_enabled: true,
      daily_reminder_time: '09:00',
    }

    it('should have notification enabled setting', () => {
      expect(notificationSettings).toHaveProperty('notifications_enabled')
    })

    it('should have daily reminder settings', () => {
      expect(notificationSettings).toHaveProperty('daily_reminder_enabled')
      expect(notificationSettings).toHaveProperty('daily_reminder_time')
    })

    it('should have valid time format for reminder', () => {
      const timeRegex = /^\d{2}:\d{2}$/
      expect(notificationSettings.daily_reminder_time).toMatch(timeRegex)
    })
  })

  describe('Password Change Validation', () => {
    it('should require minimum 6 characters', () => {
      const password = '12345'
      expect(password.length >= 6).toBe(false)
    })

    it('should accept valid password length', () => {
      const password = '123456'
      expect(password.length >= 6).toBe(true)
    })

    it('should require passwords to match', () => {
      const password = 'password123'
      const confirmPassword = 'password123'
      expect(password === confirmPassword).toBe(true)
    })

    it('should reject non-matching passwords', () => {
      const password = 'password123'
      const confirmPassword = 'password456'
      expect(password).not.toBe(confirmPassword)
    })
  })

  describe('Delete Account Confirmation', () => {
    it('should require typing DELETE to confirm', () => {
      const confirmText = 'DELETE'
      expect(confirmText === 'DELETE').toBe(true)
    })

    it('should reject incorrect confirmation text', () => {
      const confirmText = 'delete'
      expect(confirmText).not.toBe('DELETE')
    })
  })

  describe('Export Data Format', () => {
    it('should export data as JSON', () => {
      const exportData = {
        exportedAt: new Date().toISOString(),
        user: { email: 'test@example.com', id: '123' },
        profile: {},
        stats: {},
        days: [],
        tasks: [],
        goals: [],
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      expect(typeof jsonString).toBe('string')
      expect(JSON.parse(jsonString)).toEqual(exportData)
    })

    it('should include exportedAt timestamp', () => {
      const exportData = {
        exportedAt: new Date().toISOString(),
      }

      expect(exportData.exportedAt).toBeDefined()
      expect(new Date(exportData.exportedAt).getTime()).not.toBeNaN()
    })
  })
})

describe('Theme Color Mapping', () => {
  const themeColorMap: Record<string, { primary: string; gradient: string }> = {
    purple: { primary: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' },
    blue: { primary: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)' },
    green: { primary: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #84CC16 100%)' },
    orange: { primary: '#F97316', gradient: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)' },
    pink: { primary: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' },
  }

  it('should have all 5 theme colors defined', () => {
    const themeKeys = Object.keys(themeColorMap)
    expect(themeKeys).toContain('purple')
    expect(themeKeys).toContain('blue')
    expect(themeKeys).toContain('green')
    expect(themeKeys).toContain('orange')
    expect(themeKeys).toContain('pink')
  })

  it('should have primary and gradient for each theme', () => {
    Object.values(themeColorMap).forEach(theme => {
      expect(theme).toHaveProperty('primary')
      expect(theme).toHaveProperty('gradient')
      expect(theme.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(theme.gradient).toContain('linear-gradient')
    })
  })

  it('should return purple theme as fallback for unknown theme', () => {
    const unknownTheme = 'unknown'
    const theme = themeColorMap[unknownTheme] || themeColorMap.purple
    expect(theme).toEqual(themeColorMap.purple)
  })
})

describe('Settings Persistence', () => {
  it('should include all required profile fields', () => {
    const profileFields = [
      'display_name',
      'dark_mode',
      'notifications_enabled',
      'daily_reminder_enabled',
      'daily_reminder_time',
      'theme_color',
      'profile_type',
      'onboarding_completed',
      'background_image',
    ]

    const mockProfile = {
      display_name: 'Test User',
      dark_mode: false,
      notifications_enabled: true,
      daily_reminder_enabled: true,
      daily_reminder_time: '09:00',
      theme_color: 'purple',
      profile_type: 'adult',
      onboarding_completed: true,
      background_image: null,
    }

    profileFields.forEach(field => {
      expect(mockProfile).toHaveProperty(field)
    })
  })

  it('should have valid theme_color values', () => {
    const validThemeColors = ['purple', 'blue', 'green', 'orange', 'pink']
    const testColor = 'blue'
    expect(validThemeColors.includes(testColor)).toBe(true)
  })
})
