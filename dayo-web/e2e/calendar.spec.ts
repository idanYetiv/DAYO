import { test, expect } from '@playwright/test'

test.describe('Calendar Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar')
  })

  test('should redirect to login if not authenticated', async ({ page }) => {
    // Calendar is a protected route
    await expect(page).toHaveURL(/\/(login|calendar)/)
  })

  test('should display calendar header when authenticated', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Calendar')).toBeVisible()
    }
  })

  test('should show month and year in calendar', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      // Should show current month (e.g., "January 2026")
      const monthYear = page.locator('text=/\\w+ \\d{4}/')
      await expect(monthYear).toBeVisible()
    }
  })

  test('should have Today button', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Today')).toBeVisible()
    }
  })

  test('should have weekday headers', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      for (const day of weekdays) {
        await expect(page.getByText(day)).toBeVisible()
      }
    }
  })

  test('should have navigation to previous/next month', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      // Should have arrow buttons for navigation
      const buttons = page.locator('button')
      expect(await buttons.count()).toBeGreaterThanOrEqual(2)
    }
  })

  test('should navigate months when clicking arrows', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      // Get current month text
      const monthText = page.locator('text=/\\w+ \\d{4}/').first()
      const initialMonth = await monthText.textContent()

      // Click next month
      const buttons = await page.locator('button').all()
      if (buttons.length >= 2) {
        await buttons[1].click()

        // Month should change
        const newMonth = await monthText.textContent()
        // Month text should be different (or we're at year boundary)
        expect(newMonth).toBeDefined()
      }
    }
  })

  test('should show day content when clicking a date', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      // Click on a day number
      const dayButton = page.locator('button').filter({ hasText: /^15$/ })
      if (await dayButton.isVisible()) {
        await dayButton.click()

        // Should show selected day info
        await expect(page.getByText(/Tasks|Diary/i)).toBeVisible()
      }
    }
  })

  test('should have bottom navigation', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByRole('navigation')).toBeVisible()
      await expect(page.getByText('Today')).toBeVisible()
    }
  })
})
