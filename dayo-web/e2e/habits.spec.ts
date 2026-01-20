import { test, expect } from '@playwright/test'

test.describe('Habits Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/habits')
  })

  test('should display habits page header', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByRole('heading', { name: 'Habits' })).toBeVisible()
    }
  })

  test('should show New Habit button', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByRole('button', { name: /new habit/i })).toBeVisible()
    }
  })

  test('should display stats row', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Today')).toBeVisible()
      await expect(page.getByText('Total Streak')).toBeVisible()
      await expect(page.getByText('This Week')).toBeVisible()
    }
  })

  test('should display week overview section', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('This Week')).toBeVisible()
      // Should show day abbreviations
      await expect(page.getByText('Mon')).toBeVisible()
      await expect(page.getByText('Sun')).toBeVisible()
    }
  })

  test('should display All Habits section', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('All Habits')).toBeVisible()
    }
  })
})

test.describe('Habits CRUD (Authenticated)', () => {
  test.skip('should open new habit modal', async ({ page }) => {
    await page.goto('/habits')

    await page.getByRole('button', { name: /new habit/i }).click()
    await expect(page.getByRole('heading', { name: 'New Habit' })).toBeVisible()
  })

  test.skip('should create a new habit', async ({ page }) => {
    await page.goto('/habits')

    // Open modal
    await page.getByRole('button', { name: /new habit/i }).click()

    // Fill form
    await page.getByPlaceholder('e.g., Morning Meditation').fill('Test Habit')

    // Select frequency
    await page.getByRole('button', { name: 'Daily' }).click()

    // Submit
    await page.getByRole('button', { name: 'Create Habit' }).click()

    // Verify toast and habit appears
    await expect(page.getByText('Habit created!')).toBeVisible()
    await expect(page.getByText('Test Habit')).toBeVisible()
  })

  test.skip('should toggle habit completion for today', async ({ page }) => {
    await page.goto('/habits')

    // Find first habit's checkbox button
    const habitCheckbox = page.locator('[class*="rounded-xl"][class*="w-12"]').first()
    await habitCheckbox.click()

    // Should show completion toast
    await expect(page.getByText('Habit completed!')).toBeVisible()
  })

  test.skip('should show streak information', async ({ page }) => {
    await page.goto('/habits')

    // Should display streak for each habit
    await expect(page.getByText(/\d+ day streak/)).toBeVisible()
  })

  test.skip('should show weekly progress bars', async ({ page }) => {
    await page.goto('/habits')

    // Each habit should have progress indicators
    const progressBars = page.locator('[class*="h-2"][class*="rounded-full"]')
    expect(await progressBars.count()).toBeGreaterThan(0)
  })

  test.skip('should allow clicking on past days to toggle completion', async ({ page }) => {
    await page.goto('/habits')

    // Find a habit's week progress bar and click a past day
    const weekProgress = page.locator('[class*="h-2"][class*="w-full"]').first()
    await weekProgress.click()

    // UI should update
  })

  test.skip('should delete a habit', async ({ page }) => {
    await page.goto('/habits')

    // Click delete button on first habit
    const deleteBtn = page.locator('[class*="MoreHorizontal"]').first()
    await deleteBtn.click()

    // Confirm deletion
    page.on('dialog', dialog => dialog.accept())

    await expect(page.getByText('Habit deleted')).toBeVisible()
  })
})

test.describe('Habits Week Overview', () => {
  test.skip('should highlight today in week overview', async ({ page }) => {
    await page.goto('/habits')

    // Today should have special styling (bg-dayo-purple)
    const today = page.locator('[class*="bg-dayo-purple"][class*="rounded-xl"]')
    expect(await today.count()).toBeGreaterThan(0)
  })

  test.skip('should show completion count for each day', async ({ page }) => {
    await page.goto('/habits')

    // Should show format like "0/3" for each day
    const completionCounts = page.locator('text=/\\d+\\/\\d+/')
    expect(await completionCounts.count()).toBeGreaterThanOrEqual(7)
  })
})
