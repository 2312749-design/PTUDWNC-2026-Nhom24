import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/api/v1/**', route => route.fulfill({ json: { data: [] } }))
})

test('a visitor can explicitly enable 3D despite the OS reduced-motion default', async ({ page }) => {
  await page.goto('/community')
  const toggle = page.getByRole('switch', { name: 'Hiệu ứng 3D', exact: true })
  await expect(toggle).toBeEnabled()
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
  await expect(page.locator('.cosmic-canvas')).toHaveCount(0)
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-cosmic-effects', 'on')
  await expect(page.locator('.cosmic-canvas')).toHaveCount(1)
  await page.reload()
  await expect(toggle).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('.cosmic-canvas')).toHaveCount(1)
  await toggle.click()
  await expect(page.locator('.cosmic-canvas')).toHaveCount(0)
})

test('the notification close button removes the toast with reduced motion enabled', async ({ page }) => {
  await page.route('**/api/v1/community/feed?*', route => route.abort('failed'))
  await page.goto('/community')
  const notification = page.locator('.Toastify__toast').first()
  await expect(notification).toBeVisible()
  await notification.locator('.Toastify__close-button').click()
  await expect(notification).toHaveCount(0, { timeout: 1500 })
})

test('a toast expires after five seconds even while hovered and after window blur', async ({ page }) => {
  await page.route('**/api/v1/community/feed?*', route => route.abort('failed'))
  await page.goto('/community')
  const notification = page.locator('.Toastify__toast').first()
  await expect(notification).toBeVisible()
  await notification.hover()
  await page.evaluate(() => window.dispatchEvent(new Event('blur')))
  const startedAt = Date.now()
  await expect(notification).toHaveCount(0, { timeout: 6500 })
  expect(Date.now() - startedAt).toBeLessThan(6500)
})

test('the standalone error HUD also expires after five seconds', async ({ page }) => {
  await page.route('**/api/v1/categories', route => route.abort('failed'))
  await page.goto('/')
  const hud = page.locator('.cosmic-error-hud')
  await expect(hud).toBeVisible()
  await expect(hud).toHaveCount(0, { timeout: 6500 })
})
