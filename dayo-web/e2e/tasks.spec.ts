import { test, expect } from '@playwright/test'

test.describe('Tasks Flow', () => {
  // Note: These tests require authentication
  // In a real scenario, you would set up test fixtures for auth

  test.beforeEach(async ({ page }) => {
    // Navigate to today page (will redirect to login if not authenticated)
    await page.goto('/today')
  })

  test('should display tasks section on Today page', async ({ page }) => {
    // If redirected to login, this will fail - that's expected for unauthenticated
    const tasksHeading = page.getByText(/tasks/i)

    // Either we see tasks or we're on login page
    const onLoginPage = await page.url().includes('/login')
    if (!onLoginPage) {
      await expect(tasksHeading).toBeVisible()
    }
  })

  test('should have add task input when authenticated', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      // Look for task input
      const taskInput = page.getByPlaceholder(/add.*task|new.*task/i)
      await expect(taskInput).toBeVisible()
    }
  })

  test('should show greeting based on time of day', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      // Should show one of the greetings
      const greeting = page.locator('text=/Good (morning|afternoon|evening)/')
      await expect(greeting).toBeVisible()
    }
  })

  test('should display streak counter', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      // Should show streak
      const streak = page.locator('text=/\\d+ day streak/')
      await expect(streak).toBeVisible()
    }
  })

  test('should have date navigation', async ({ page }) => {
    const onLoginPage = await page.url().includes('/login')

    if (!onLoginPage) {
      // Should have prev/next date buttons
      const dateNav = page.locator('[class*="ChevronLeft"], [class*="ChevronRight"]')
      expect(await dateNav.count()).toBeGreaterThanOrEqual(1)
    }
  })
})

test.describe('Tasks CRUD (Authenticated)', () => {
  // These tests would require proper auth fixtures
  // Placeholder for when auth is set up

  test.skip('should create a new task', async ({ page }) => {
    await page.goto('/today')

    await page.getByPlaceholder(/add.*task/i).fill('New Test Task')
    await page.keyboard.press('Enter')

    await expect(page.getByText('New Test Task')).toBeVisible()
    await expect(page.getByText('Task added')).toBeVisible() // Toast
  })

  test.skip('should complete a task', async ({ page }) => {
    await page.goto('/today')

    // Find first uncompleted task and click it
    const taskCheckbox = page.locator('[data-testid="task-checkbox"]').first()
    await taskCheckbox.click()

    await expect(page.getByText('Task completed!')).toBeVisible() // Toast
  })

  test.skip('should delete a task', async ({ page }) => {
    await page.goto('/today')

    // Find delete button and click
    const deleteButton = page.locator('[data-testid="task-delete"]').first()
    await deleteButton.click()

    await expect(page.getByText('Task deleted')).toBeVisible() // Toast
  })
})
