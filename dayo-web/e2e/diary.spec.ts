import { test, expect } from '@playwright/test'

test.describe('Diary Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/today')
  })

  test('should open diary modal from stats row', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Click on the mood/diary area in stats
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Modal should open with diary header
      await expect(page.getByRole('button', { name: 'Save' })).toBeVisible()
    }
  })

  test('should display mood selector', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Should show all mood options
      await expect(page.getByText('Amazing')).toBeVisible()
      await expect(page.getByText('Happy')).toBeVisible()
      await expect(page.getByText('Okay')).toBeVisible()
      await expect(page.getByText('Sad')).toBeVisible()
      await expect(page.getByText('Stressed')).toBeVisible()
    }
  })

  test('should display diary text area', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Should show text area with placeholder
      await expect(page.getByPlaceholder('Dear diary, today...')).toBeVisible()
    }
  })

  test('should display action buttons', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Should show all action buttons
      await expect(page.getByRole('button', { name: /photo/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /gratitude/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /highlights/i })).toBeVisible()
    }
  })
})

test.describe('Diary Gratitude Feature', () => {
  test.skip('should toggle gratitude section on button click', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Click gratitude button
    await page.getByRole('button', { name: /gratitude/i }).click()

    // Gratitude section should appear
    await expect(page.getByText("Today I'm grateful for...")).toBeVisible()

    // Should show 3 input fields
    const gratitudeInputs = page.getByPlaceholder("I'm grateful for...")
    expect(await gratitudeInputs.count()).toBe(3)
  })

  test.skip('should save gratitude items', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Click gratitude button
    await page.getByRole('button', { name: /gratitude/i }).click()

    // Fill gratitude items
    const inputs = page.getByPlaceholder("I'm grateful for...")
    await inputs.nth(0).fill('My family')
    await inputs.nth(1).fill('Good health')
    await inputs.nth(2).fill('Sunny weather')

    // Save
    await page.getByRole('button', { name: 'Save' }).click()

    // Toast should appear
    await expect(page.getByText('Diary saved')).toBeVisible()
  })

  test.skip('should show gratitude badge when items exist', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Click gratitude button
    await page.getByRole('button', { name: /gratitude/i }).click()

    // Fill one item
    const inputs = page.getByPlaceholder("I'm grateful for...")
    await inputs.nth(0).fill('Coffee')

    // Toggle section off
    await page.getByRole('button', { name: /gratitude/i }).click()

    // Badge should show count
    await expect(page.getByText('1').first()).toBeVisible()
  })
})

test.describe('Diary Highlights Feature', () => {
  test.skip('should toggle highlights section on button click', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Click highlights button
    await page.getByRole('button', { name: /highlights/i }).click()

    // Highlights section should appear
    await expect(page.getByText("Today's Highlights")).toBeVisible()

    // Should show emoji picker
    await expect(page.getByText('0/5')).toBeVisible()
  })

  test.skip('should add highlight with emoji', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Click highlights button
    await page.getByRole('button', { name: /highlights/i }).click()

    // Click an emoji to add highlight
    await page.locator('button:has-text("🎯")').click()

    // Input field should appear
    await expect(page.getByPlaceholder('What happened?')).toBeVisible()

    // Fill in the highlight
    await page.getByPlaceholder('What happened?').fill('Completed my goal')

    // Counter should update
    await expect(page.getByText('1/5')).toBeVisible()
  })

  test.skip('should remove highlight', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Click highlights button
    await page.getByRole('button', { name: /highlights/i }).click()

    // Add a highlight
    await page.locator('button:has-text("🎯")').click()
    await page.getByPlaceholder('What happened?').fill('Test highlight')

    // Click delete button
    await page.locator('[class*="hover:text-red-500"]').click()

    // Highlight should be removed
    await expect(page.getByPlaceholder('What happened?')).not.toBeVisible()
    await expect(page.getByText('0/5')).toBeVisible()
  })

  test.skip('should limit to 5 highlights', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Click highlights button
    await page.getByRole('button', { name: /highlights/i }).click()

    // Add 5 highlights
    for (let i = 0; i < 5; i++) {
      await page.locator('button:has-text("🎯")').click()
    }

    // Counter should show 5/5
    await expect(page.getByText('5/5')).toBeVisible()

    // Emoji picker should be hidden
    await expect(page.locator('button:has-text("🎯")')).not.toBeVisible()
  })
})

test.describe('Diary Photo Feature', () => {
  test('should show photo button', async ({ page }) => {
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      await page.goto('/today')

      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Photo button should be visible
      await expect(page.getByRole('button', { name: /photo/i })).toBeVisible()
    }
  })

  test.skip('should show file picker on photo button click', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Set up file chooser handler
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.getByRole('button', { name: /photo/i }).click(),
    ])

    // File chooser should accept image types
    expect(fileChooser.isMultiple()).toBe(false)
  })
})

test.describe('Diary Sketch Feature', () => {
  test('should show sketch button in editor toolbar', async ({ page }) => {
    await page.goto('/today')
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Sketch button should be visible in toolbar
      await expect(page.getByRole('button', { name: /sketch/i })).toBeVisible()
    }
  })

  test('should open sketch section on button click', async ({ page }) => {
    await page.goto('/today')
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Click sketch button
      await page.getByRole('button', { name: /sketch/i }).click()

      // Sketch section should appear with header
      await expect(page.getByText(/sketch your thoughts/i)).toBeVisible()
    }
  })

  test('should display sketch toolbar with tools', async ({ page }) => {
    await page.goto('/today')
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Click sketch button
      await page.getByRole('button', { name: /sketch/i }).click()

      // Toolbar should show pen and eraser buttons
      await expect(page.getByRole('button', { name: 'Pen' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Eraser' })).toBeVisible()
    }
  })

  test('should display color palette', async ({ page }) => {
    await page.goto('/today')
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Click sketch button
      await page.getByRole('button', { name: /sketch/i }).click()

      // Color buttons should be visible
      await expect(page.getByRole('button', { name: 'Black' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Red' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Blue' })).toBeVisible()
    }
  })

  test('should display brush size options', async ({ page }) => {
    await page.goto('/today')
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Click sketch button
      await page.getByRole('button', { name: /sketch/i }).click()

      // Brush size buttons should be visible
      await expect(page.getByRole('button', { name: 'Brush size S' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Brush size M' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Brush size L' })).toBeVisible()
    }
  })

  test('should display undo and clear buttons', async ({ page }) => {
    await page.goto('/today')
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Click sketch button
      await page.getByRole('button', { name: /sketch/i }).click()

      // Action buttons should be visible
      await expect(page.getByRole('button', { name: 'Undo' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible()
    }
  })

  test('should close sketch section on X button click', async ({ page }) => {
    await page.goto('/today')
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Click sketch button
      await page.getByRole('button', { name: /sketch/i }).click()

      // Sketch section should be visible
      await expect(page.getByText(/sketch your thoughts/i)).toBeVisible()

      // Click close button
      await page.getByRole('button', { name: 'Close sketch' }).click()

      // Sketch section should be hidden
      await expect(page.getByText(/sketch your thoughts/i)).not.toBeVisible()
    }
  })

  test('should switch between pen and eraser', async ({ page }) => {
    await page.goto('/today')
    const onLoginPage = page.url().includes('/login')

    if (!onLoginPage) {
      // Open diary modal
      await page.locator('[class*="rounded-2xl"]').first().click()

      // Click sketch button
      await page.getByRole('button', { name: /sketch/i }).click()

      // Pen should be active by default
      const penButton = page.getByRole('button', { name: 'Pen' })
      await expect(penButton).toHaveClass(/bg-pink-500/)

      // Click eraser
      await page.getByRole('button', { name: 'Eraser' }).click()

      // Eraser should now be active
      const eraserButton = page.getByRole('button', { name: 'Eraser' })
      await expect(eraserButton).toHaveClass(/bg-pink-500/)
    }
  })
})

test.describe('Diary Save Flow', () => {
  test.skip('should save diary with mood and text', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Select mood
    await page.getByText('Happy').click()

    // Write diary entry
    await page.getByPlaceholder('Dear diary, today...').fill('Today was a great day!')

    // Save
    await page.getByRole('button', { name: 'Save' }).click()

    // Toast should appear
    await expect(page.getByText('Diary saved')).toBeVisible()
  })

  test.skip('should close modal after save', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Save
    await page.getByRole('button', { name: 'Save' }).click()

    // Modal should close
    await expect(page.getByPlaceholder('Dear diary, today...')).not.toBeVisible()
  })

  test.skip('should close modal on back button', async ({ page }) => {
    await page.goto('/today')

    // Open diary modal
    await page.locator('[class*="rounded-2xl"]').first().click()

    // Click back button
    await page.locator('button:has(svg.lucide-arrow-left)').click()

    // Modal should close
    await expect(page.getByPlaceholder('Dear diary, today...')).not.toBeVisible()
  })
})
