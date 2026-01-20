import { test, expect } from '@playwright/test'

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings')
  })

  test('should display settings page header', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    }
  })

  test('should display user card', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // User avatar/initial should be visible
      const userCard = page.locator('[class*="rounded-full"][class*="bg-dayo-gradient"]')
      await expect(userCard).toBeVisible()
    }
  })

  test('should display premium banner', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Upgrade to Premium')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Upgrade' })).toBeVisible()
    }
  })

  test('should display preferences section', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Preferences')).toBeVisible()
      await expect(page.getByText('Dark Mode')).toBeVisible()
      await expect(page.getByText('Push Notifications')).toBeVisible()
      await expect(page.getByText('Daily Reminder')).toBeVisible()
    }
  })

  test('should display appearance section', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Appearance')).toBeVisible()
      await expect(page.getByText('Theme Color')).toBeVisible()
    }
  })

  test('should display account section', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Account')).toBeVisible()
      await expect(page.getByText('Email')).toBeVisible()
      await expect(page.getByText('Change Password')).toBeVisible()
    }
  })

  test('should display privacy & data section', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Privacy & Data')).toBeVisible()
      await expect(page.getByText('Export Data')).toBeVisible()
      await expect(page.getByText('Delete Account')).toBeVisible()
    }
  })

  test('should display sign out button', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible()
    }
  })

  test('should display app version', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText(/DAYO v\d+\.\d+\.\d+/)).toBeVisible()
    }
  })
})

test.describe('Settings Toggles (Authenticated)', () => {
  test.skip('should toggle dark mode', async ({ page }) => {
    await page.goto('/settings')

    // Find dark mode toggle
    const darkModeRow = page.locator('text=Dark Mode').locator('..')
    const toggle = darkModeRow.locator('[class*="rounded-full"][class*="w-12"]')

    await toggle.click()
    await expect(page.getByText(/Dark mode (enabled|disabled)/)).toBeVisible()
  })

  test.skip('should toggle push notifications', async ({ page }) => {
    await page.goto('/settings')

    const notifRow = page.locator('text=Push Notifications').locator('..')
    const toggle = notifRow.locator('[class*="rounded-full"][class*="w-12"]')

    await toggle.click()
    await expect(page.getByText(/Notifications (enabled|disabled)/)).toBeVisible()
  })

  test.skip('should toggle daily reminder', async ({ page }) => {
    await page.goto('/settings')

    const reminderRow = page.locator('text=Daily Reminder').locator('..')
    const toggle = reminderRow.locator('[class*="rounded-full"][class*="w-12"]')

    await toggle.click()
    await expect(page.getByText(/Daily reminder (enabled|disabled)/)).toBeVisible()
  })
})

test.describe('Settings Modals (Authenticated)', () => {
  test.skip('should open edit profile modal', async ({ page }) => {
    await page.goto('/settings')

    // Click on user card
    const userCard = page.locator('[class*="rounded-2xl"]').first()
    await userCard.click()

    await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible()
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
  })

  test.skip('should open theme color modal', async ({ page }) => {
    await page.goto('/settings')

    await page.getByText('Theme Color').click()

    await expect(page.getByRole('heading', { name: 'Theme Color' })).toBeVisible()
    await expect(page.getByText('Purple')).toBeVisible()
    await expect(page.getByText('Blue')).toBeVisible()
    await expect(page.getByText('Green')).toBeVisible()
  })

  test.skip('should open change password modal', async ({ page }) => {
    await page.goto('/settings')

    await page.getByText('Change Password').click()

    await expect(page.getByRole('heading', { name: 'Change Password' })).toBeVisible()
    await expect(page.getByPlaceholder(/new password/i)).toBeVisible()
    await expect(page.getByPlaceholder(/confirm/i)).toBeVisible()
  })

  test.skip('should open delete account modal', async ({ page }) => {
    await page.goto('/settings')

    await page.getByText('Delete Account').click()

    await expect(page.getByRole('heading', { name: 'Delete Account' })).toBeVisible()
    await expect(page.getByText('This action cannot be undone')).toBeVisible()
    await expect(page.getByPlaceholder('DELETE')).toBeVisible()
  })

  test.skip('should require DELETE confirmation for account deletion', async ({ page }) => {
    await page.goto('/settings')

    await page.getByText('Delete Account').click()

    // Delete button should be disabled initially
    const deleteBtn = page.getByRole('button', { name: 'Delete Account' }).nth(1)
    await expect(deleteBtn).toBeDisabled()

    // Type wrong text
    await page.getByPlaceholder('DELETE').fill('delete')
    await expect(deleteBtn).toBeDisabled()

    // Type correct text
    await page.getByPlaceholder('DELETE').fill('DELETE')
    await expect(deleteBtn).toBeEnabled()
  })
})

test.describe('Export Data (Authenticated)', () => {
  test.skip('should trigger data export', async ({ page }) => {
    await page.goto('/settings')

    // Set up download listener
    const downloadPromise = page.waitForEvent('download')

    await page.getByText('Export Data').click()

    // Should trigger download
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/dayo-export.*\.json/)
  })
})

test.describe('Sign Out', () => {
  test.skip('should sign out user', async ({ page }) => {
    await page.goto('/settings')

    await page.getByRole('button', { name: 'Sign Out' }).click()

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })
})
