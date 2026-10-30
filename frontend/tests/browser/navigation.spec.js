import { test, expect } from '@playwright/test'

test('public routes render without browser exceptions and unknown pages return 404', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const route of ['/community', '/recipes', '/categories', '/members', '/fridge', '/cook-mode', '/planner']) {
    const response = await page.goto(route)
    expect(response.status()).toBe(200)
    await expect(page.locator('.community-nav')).toBeVisible()
    await expect(page.locator('body')).not.toContainText('Application error')
  }
  expect((await page.goto('/this-page-does-not-exist')).status()).toBe(404)
  expect(errors).toEqual([])
})

test('admin dashboard handles forbidden access without leaking data', async ({ page }) => {
  await page.route('**/api/v1/admin/overview', route => route.fulfill({ status: 403, contentType: 'application/problem+json', body: '{"status":403}' }))
  await page.goto('/admin')
  await expect(page.locator('.admin-error')).toContainText('không có quyền quản trị')
  await expect(page.locator('.admin-stats')).toHaveCount(0)
})

test('admin dashboard displays API totals and resolves a report', async ({ page }) => {
  let resolved = false
  await page.route('**/api/v1/admin/overview', route => route.fulfill({ json: { data: { users: 25, recipes: 12, categories: 3, posts: 8, pendingReports: resolved ? 0 : 1 } } }))
  await page.route('**/api/v1/admin/users?*', route => route.fulfill({ json: { data: [], meta: { page: 1, totalPages: 1 } } }))
  await page.route('**/api/v1/admin/reports?*', route => route.fulfill({ json: { data: resolved ? [] : [{ id: 'test-report', targetType: 'post', targetId: 'post-1', reason: 'Nội dung không phù hợp', createdAt: '2026-10-01' }], meta: { totalPages: 1 } } }))
  await page.route('**/api/v1/recipes/mine', route => route.fulfill({ json: { data: [] } }))
  await page.route('**/api/v1/admin/reports/test-report/resolve', route => { resolved = true; return route.fulfill({ json: { data: { id: 'test-report' } } }) })
  await page.goto('/admin')
  await expect(page.locator('.admin-stats')).toContainText('25')
  await page.getByRole('button', { name: 'Báo cáo' }).click()
  await page.getByRole('button', { name: 'Không vi phạm' }).click()
  await expect(page.getByText('Không có báo cáo trong danh sách này.')).toBeVisible()
  expect(resolved).toBe(true)
})

test('Next links navigate to the recipe catalog', async ({ page }) => {
  await page.goto('/community')
  await page.locator('footer').getByRole('link', { name: 'Công thức món ăn' }).click()
  await expect(page).toHaveURL(/\/recipes$/)
  await expect(page.locator('.community-nav')).toBeVisible()
})
