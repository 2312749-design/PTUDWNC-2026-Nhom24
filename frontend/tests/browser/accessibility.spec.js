import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: [] }),
  }))
})

for (const path of ['/', '/recipes', '/categories', '/auth/login']) {
  test(`${path} has no serious WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    const serious = result.violations.filter(item => ['serious', 'critical'].includes(item.impact))
    expect(serious, serious.map(item => `${item.id}: ${item.help}`).join('\n')).toEqual([])
  })
}
