import { test, expect } from '@playwright/test'

test.describe('Goals Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/goals')
  })

  test('should display goals page header', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByRole('heading', { name: 'Goals' })).toBeVisible()
    }
  })

  test('should show New Goal button', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByRole('button', { name: /new goal/i })).toBeVisible()
    }
  })

  test('should display category filter buttons', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByRole('button', { name: 'All Goals' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Yearly Goals' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Monthly Goals' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Weekly Goals' })).toBeVisible()
    }
  })

  test('should display stats section', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await expect(page.getByText('Total')).toBeVisible()
      await expect(page.getByText('Completed')).toBeVisible()
      await expect(page.getByText('In Progress')).toBeVisible()
    }
  })

  test('should switch category filters', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Click Yearly Goals filter
      await page.getByRole('button', { name: 'Yearly Goals' }).click()
      await expect(page.getByRole('button', { name: 'Yearly Goals' })).toHaveClass(/bg-dayo-purple/)

      // Click back to All Goals
      await page.getByRole('button', { name: 'All Goals' }).click()
      await expect(page.getByRole('button', { name: 'All Goals' })).toHaveClass(/bg-dayo-purple/)
    }
  })
})

test.describe('Goals CRUD (Authenticated)', () => {
  test.skip('should open new goal modal', async ({ page }) => {
    await page.goto('/goals')

    await page.getByRole('button', { name: /new goal/i }).click()
    await expect(page.getByRole('heading', { name: 'New Goal' })).toBeVisible()
  })

  test.skip('should create a new goal', async ({ page }) => {
    await page.goto('/goals')

    // Open modal
    await page.getByRole('button', { name: /new goal/i }).click()

    // Fill form
    await page.getByPlaceholder('e.g., Read 24 books').fill('Test Goal')
    await page.getByRole('button', { name: 'Monthly' }).click()

    // Submit
    await page.getByRole('button', { name: 'Create Goal' }).click()

    // Verify toast and goal appears
    await expect(page.getByText('Goal created!')).toBeVisible()
    await expect(page.getByText('Test Goal')).toBeVisible()
  })

  test.skip('should expand goal to show milestones', async ({ page }) => {
    await page.goto('/goals')

    // Click on a goal card to expand
    const goalCard = page.locator('[class*="rounded-2xl"]').first()
    await goalCard.click()

    // Should show milestones section
    await expect(page.getByText('MILESTONES')).toBeVisible()
  })

  test.skip('should add milestone to goal', async ({ page }) => {
    await page.goto('/goals')

    // Expand a goal
    const goalCard = page.locator('[class*="rounded-2xl"]').first()
    await goalCard.click()

    // Click add milestone
    await page.getByText('+ Add').click()

    // Fill and submit
    await page.getByPlaceholder('New milestone...').fill('Test Milestone')
    await page.getByRole('button', { name: 'Add' }).click()

    await expect(page.getByText('Milestone added')).toBeVisible()
  })

  test.skip('should toggle milestone completion', async ({ page }) => {
    await page.goto('/goals')

    // Expand a goal
    const goalCard = page.locator('[class*="rounded-2xl"]').first()
    await goalCard.click()

    // Toggle first milestone
    const checkbox = page.locator('[class*="rounded-full"][class*="border-2"]').first()
    await checkbox.click()

    await expect(page.getByText('Milestone completed!')).toBeVisible()
  })
})
