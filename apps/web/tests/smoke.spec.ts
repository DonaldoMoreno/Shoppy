import { test, expect } from '@playwright/test'

test('landing page has sign in', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('text=Sign in')).toBeVisible()
})
