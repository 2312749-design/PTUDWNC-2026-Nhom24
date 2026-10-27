import { test, expect } from '@playwright/test'

const preferencesKey = 'culinary:cosmic-preferences'
const cookingLinks = [
  ['/recipes', 'Công thức'],
  ['/categories', 'Danh mục'],
  ['/cook-mode', 'Nấu cùng tôi'],
  ['/fridge', 'Tủ lạnh'],
  ['/flexible-recipe', 'Khẩu phần'],
  ['/journal', 'Nhật ký'],
  ['/cookbook', 'Sổ tay'],
  ['/planner', 'Thực đơn tuần'],
]

test.beforeEach(async ({ page }) => {
  // Public data is deliberately empty so these checks exercise presentation
  // independently of the user's database, credentials and demo content.
  await page.route('**/api/v1/**', route => route.fulfill({ json: { data: [] } }))
})

test('cosmic controls persist across navigation and respect the effects switch', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const browserErrors = []
  page.on('pageerror', error => browserErrors.push(error.message))
  await page.goto('/community')

  const soundSwitch = page.getByRole('switch', { name: 'Âm thanh', exact: true })
  const effectsSwitch = page.getByRole('switch', { name: 'Hiệu ứng 3D', exact: true })
  await expect(page.locator('html')).toHaveAttribute('data-cosmic-theme', 'true')
  await expect(effectsSwitch).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('canvas.cosmic-canvas')).toHaveCount(1)
  await soundSwitch.click()
  await effectsSwitch.click()
  await expect(soundSwitch).toHaveAttribute('aria-checked', 'false')
  await expect(effectsSwitch).toHaveAttribute('aria-checked', 'false')
  await expect(page.locator('html')).toHaveAttribute('data-cosmic-effects', 'off')
  await expect(page.locator('canvas.cosmic-canvas')).toHaveCount(0)

  await page.locator('.community-nav').getByRole('link', { name: 'Trang chủ', exact: true }).click()
  await expect(soundSwitch).toHaveAttribute('aria-checked', 'false')
  await expect(effectsSwitch).toHaveAttribute('aria-checked', 'false')
  await page.reload()
  await expect(soundSwitch).toHaveAttribute('aria-checked', 'false')
  await expect(effectsSwitch).toHaveAttribute('aria-checked', 'false')
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), preferencesKey)).toMatchObject({ soundEnabled: false, effectsEnabled: false })

  await effectsSwitch.click()
  await expect(page.locator('canvas.cosmic-canvas')).toHaveCount(1)
  expect(browserErrors).toEqual([])
})

test('food content and all cooking menu destinations are retained', async ({ page }) => {
  await page.goto('/community')
  await expect(page.locator('.feed-hero')).toContainText('Mâm cơm Việt: giữ vị quen, thêm một chút mới')
  await expect(page.getByRole('button', { name: 'Dành cho bạn', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Đang theo dõi', exact: true })).toBeVisible()
  await expect(page.locator('.guest-invite')).toContainText('Bếp vui hơn khi có bạn.')
  await expect(page.getByRole('heading', { name: 'Chuyện trong bếp', exact: true })).toBeVisible()

  const cookingMenu = page.locator('.community-nav-group').filter({ has: page.locator('summary', { hasText: 'Nấu ăn' }) })
  await cookingMenu.locator('summary').click()
  for (const [href, name] of cookingLinks) {
    const link = cookingMenu.getByRole('link', { name, exact: true })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', href)
  }
  await page.keyboard.press('Escape')
  await expect(cookingMenu).not.toHaveAttribute('open', '')
})

test('reduced motion starts without the animated canvas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/community')
  await expect(page.getByRole('switch', { name: 'Hiệu ứng 3D', exact: true })).toBeVisible()
  await expect(page.locator('canvas.cosmic-canvas')).toHaveCount(0)
})

test('cosmic header and dropdown fit a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/community')
  await expect(page.getByRole('switch', { name: 'Âm thanh', exact: true })).toBeVisible()
  await expect(page.getByRole('switch', { name: 'Hiệu ứng 3D', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)

  const cookingMenu = page.locator('.community-nav-group').filter({ has: page.locator('summary', { hasText: 'Nấu ăn' }) })
  await cookingMenu.locator('summary').click()
  const bounds = await cookingMenu.locator('.community-nav-group-links').boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds.x).toBeGreaterThanOrEqual(0)
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(391)
})

test('API failure appears as a dismissible HUD toast', async ({ page }) => {
  await page.route('**/api/v1/community/feed?*', route => route.abort('failed'))
  await page.goto('/community')
  const notification = page.locator('.Toastify__toast').filter({ hasText: /fetch|kết nối|máy chủ/i }).first()
  await expect(notification).toBeVisible()
  await expect(notification.locator('.Toastify__close-button')).toBeVisible()
  await notification.locator('.Toastify__close-button').click()
  await expect(notification).toHaveCount(0)
})

test('the sound switch gates synthesized interface tones', async ({ page }) => {
  await page.addInitScript(() => {
    window.__cosmicToneCount = 0
    const Context = window.AudioContext || window.webkitAudioContext
    if (!Context) return
    const createOscillator = Context.prototype.createOscillator
    Context.prototype.createOscillator = function (...args) {
      window.__cosmicToneCount += 1
      return createOscillator.apply(this, args)
    }
  })
  await page.goto('/community')
  const soundSwitch = page.getByRole('switch', { name: 'Âm thanh', exact: true })
  await soundSwitch.click()
  await expect(soundSwitch).toHaveAttribute('aria-checked', 'false')
  const mutedCount = await page.evaluate(() => window.__cosmicToneCount)
  const cookingSummary = page.locator('.community-nav-group summary').filter({ hasText: 'Nấu ăn' })
  await cookingSummary.click()
  // Check after the event loop has painted so a delayed click listener cannot
  // produce an unheard oscillator after the muted assertion.
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  expect(await page.evaluate(() => window.__cosmicToneCount)).toBe(mutedCount)

  await soundSwitch.click()
  await expect(soundSwitch).toHaveAttribute('aria-checked', 'true')
  await cookingSummary.click()
  await expect.poll(() => page.evaluate(() => window.__cosmicToneCount)).toBeGreaterThan(mutedCount)
})

test('the existing music audio element survives internal navigation', async ({ page }) => {
  await page.goto('/home')
  await expect(page.locator('audio')).toHaveCount(1)
  await page.evaluate(() => { window.__cosmicMusicElement = document.querySelector('audio') })
  await page.locator('.community-nav').getByRole('link', { name: 'Bảng tin', exact: true }).click()
  await expect(page).toHaveURL(/\/community$/)
  await expect(page.locator('audio')).toHaveCount(1)
  expect(await page.evaluate(() => window.__cosmicMusicElement === document.querySelector('audio'))).toBe(true)
})
