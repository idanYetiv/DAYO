import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login')

  // Fill in credentials from environment variables
  const email = process.env.TEST_USER_EMAIL || 'test@dayo.app'
  const password = process.env.TEST_USER_PASSWORD || 'testpassword123'

  // Fill login form
  await page.getByPlaceholder(/email/i).fill(email)
  await page.getByPlaceholder(/password/i).fill(password)

  // Click sign in button
  await page.getByRole('button', { name: /sign in/i }).click()

  // Wait for navigation to today page (authenticated state)
  await page.waitForURL('/today', { timeout: 10000 })

  // Verify we're authenticated
  await expect(page.getByRole('heading', { name: /today/i })).toBeVisible()

  // Save authentication state
  await page.context().storageState({ path: authFile })
})
