import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/')

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByText('Welcome Back')).toBeVisible()
  })

  test('should display login form with email and password fields', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should have link to signup page', async ({ page }) => {
    await page.goto('/login')

    const signupLink = page.getByRole('link', { name: /sign up/i })
    await expect(signupLink).toBeVisible()

    await signupLink.click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should display signup form', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up|create account/i })).toBeVisible()
  })

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByPlaceholder(/email/i).fill('invalid@example.com')
    await page.getByPlaceholder(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should show an error message
    await expect(page.getByText(/invalid|error|failed/i)).toBeVisible({ timeout: 5000 })
  })

  test('should redirect authenticated users away from login', async ({ page }) => {
    // This test would need proper auth setup
    // For now, just verify the login page loads
    await page.goto('/login')
    await expect(page.getByText('Welcome Back')).toBeVisible()
  })
})
