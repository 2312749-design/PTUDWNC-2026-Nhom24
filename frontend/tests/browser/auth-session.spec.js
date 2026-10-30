import { test, expect } from '@playwright/test'

const user = {
  id: 'session-regression-user', username: 'sessionregression', fullName: 'Session Regression',
  displayName: 'Session Regression', email: 'sessionregression@example.invalid', role: 'User', bio: '',
}
const accessToken = `e30.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(profile => localStorage.setItem('currentUser', JSON.stringify(profile)), user)
})

test('document reload uses the access cookie without preemptive token rotation', async ({ page }) => {
  let refreshes = 0
  await page.route('**/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname
    if (path.endsWith('/auth/refresh')) {
      refreshes++
      return route.fulfill({ status: 429, json: { status: 429, detail: 'Unexpected refresh.' } })
    }
    return route.fulfill({ json: { data: path.endsWith('/account/me') ? user : { unreadCount: 0 } } })
  })

  await page.goto('/account')
  await expect(page.getByLabel('Họ và tên', { exact: true })).toHaveValue(user.fullName)
  await page.reload()
  await expect(page.getByLabel('Họ và tên', { exact: true })).toHaveValue(user.fullName)
  await expect(page.locator('.community-nav-account').getByRole('button', { name: 'Đăng xuất', exact: true })).toBeVisible()
  expect(refreshes).toBe(0)
  expect(await page.evaluate(() => Boolean(localStorage.getItem('currentUser')))).toBe(true)
})

test('concurrent unauthorized requests share one refresh and retain the logged-in header', async ({ page }) => {
  let refreshes = 0
  let renewed = false
  await page.route('**/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname
    if (path.endsWith('/auth/refresh')) {
      refreshes++
      await new Promise(resolve => setTimeout(resolve, 80))
      renewed = true
      return route.fulfill({ json: { data: { accessToken, user } } })
    }
    if (!renewed) return route.fulfill({ status: 401, json: { status: 401, detail: 'Expired access cookie.' } })
    return route.fulfill({ json: { data: path.endsWith('/account/me') ? user : { unreadCount: 0 } } })
  })

  await page.goto('/account')
  await expect(page.getByLabel('Họ và tên', { exact: true })).toHaveValue(user.fullName)
  await expect(page.locator('.community-nav-account').getByRole('button', { name: 'Đăng xuất', exact: true })).toBeVisible()
  expect(refreshes).toBe(1)
  const persisted = await page.evaluate(() => ({ access: localStorage.getItem('accessToken'), refresh: localStorage.getItem('refreshToken') }))
  expect(persisted).toEqual({ access: null, refresh: null })
})

test('refresh rate limiting preserves user metadata and allows a later reload to recover', async ({ page }) => {
  let recovered = false
  let refreshes = 0
  await page.route('**/api/v1/**', async route => {
    const path = new URL(route.request().url()).pathname
    if (path.endsWith('/auth/refresh')) {
      refreshes++
      return route.fulfill({ status: 429, json: { status: 429, detail: 'Vui lòng thử lại sau.' } })
    }
    if (!recovered) return route.fulfill({ status: 401, json: { status: 401, detail: 'Expired access cookie.' } })
    return route.fulfill({ json: { data: path.endsWith('/account/me') ? user : { unreadCount: 0 } } })
  })

  await page.goto('/account')
  await expect(page.getByText('Vui lòng thử lại sau.', { exact: true }).first()).toBeVisible()
  await expect(page).toHaveURL(/\/account$/)
  expect(await page.evaluate(() => Boolean(localStorage.getItem('currentUser')))).toBe(true)
  expect(refreshes).toBe(1)

  recovered = true
  await page.reload()
  await expect(page.getByLabel('Họ và tên', { exact: true })).toHaveValue(user.fullName)
  await expect(page.locator('.community-nav-account').getByRole('button', { name: 'Đăng xuất', exact: true })).toBeVisible()
})
