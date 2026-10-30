import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const requireFrontend = createRequire(path.join(repositoryRoot, 'frontend/package.json'))
const { chromium, expect } = requireFrontend('@playwright/test')
const options = new Map()
for (let index = 2; index < process.argv.length; index += 2) {
  if (!['--base-url', '--output'].includes(process.argv[index]) || !process.argv[index + 1]) {
    throw new Error('Usage: node scripts/submission/verify-browser.mjs [--base-url http://localhost:28080] [--output artifacts/submission-browser]')
  }
  options.set(process.argv[index], process.argv[index + 1])
}

const target = new URL(options.get('--base-url') || 'http://localhost:28080')
if (!['localhost', '127.0.0.1', '[::1]'].includes(target.hostname)
  || target.protocol !== 'http:' || target.port !== '28080' || target.username || target.password
  || target.pathname !== '/' || target.search || target.hash) {
  throw new Error('This check creates its own account. Only the isolated local submission web on HTTP port 28080 is allowed.')
}
const baseURL = target.origin
const runId = `browser${Date.now()}${randomUUID().replaceAll('-', '').slice(0, 6)}`
const username = runId
const password = `Submission!${randomUUID()}a9`
const updatedName = `Browser verified ${runId}`
const updatedBio = 'Hồ sơ được lưu và tải lại bằng trình duyệt trên bản Docker kiểm thử riêng.'
const artifactRoot = path.join(repositoryRoot, 'artifacts')
const outputDirectory = path.resolve(repositoryRoot, options.get('--output') || `artifacts/submission-browser-${runId}`)
if (!outputDirectory.startsWith(`${artifactRoot}${path.sep}`)) {
  throw new Error('Browser diagnostics must stay inside the ignored artifacts directory.')
}
await mkdir(outputDirectory, { recursive: true })

const checks = []
const pageErrors = []
const apiServerErrors = []
const authResponses = []
const startedAt = new Date().toISOString()
const sanitize = value => String(value).replaceAll(password, '[redacted]')
const payload = json => Object.hasOwn(json, 'data') ? json.data : json
let browser
let context
let page
let accountId
let failure = null
let failureState = null

async function verify(name, action) {
  try {
    const detail = await action()
    checks.push({ name, passed: true, ...(detail ? { detail } : {}) })
    process.stdout.write(`PASS ${name}\n`)
  } catch (error) {
    const message = sanitize(error.message)
    checks.push({ name, passed: false, detail: message })
    throw new Error(`${name}: ${message}`)
  }
}

async function assertSessionStorageIsSafe() {
  const tokenStorage = await page.evaluate(() => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  }))
  expect(tokenStorage.accessToken).toBeNull()
  expect(tokenStorage.refreshToken).toBeNull()
  const cookies = await context.cookies()
  for (const name of ['culinary_access_token', 'culinary_refresh_token']) {
    expect(cookies.some(cookie => cookie.name === name && cookie.httpOnly)).toBe(true)
  }
  const readableCookieNames = await page.evaluate(() => document.cookie.split(';').map(value => value.trim().split('=')[0]))
  expect(readableCookieNames).not.toContain('culinary_access_token')
  expect(readableCookieNames).not.toContain('culinary_refresh_token')
}

try {
  browser = await chromium.launch({ headless: true })
  context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1080 }, reducedMotion: 'reduce' })
  context.setDefaultTimeout(30_000)
  context.setDefaultNavigationTimeout(60_000)
  page = await context.newPage()
  page.on('pageerror', error => pageErrors.push(sanitize(error.message)))
  page.on('response', response => {
    const url = new URL(response.url())
    if (url.origin === baseURL && url.pathname.startsWith('/api/') && response.status() >= 500) {
      apiServerErrors.push({ path: url.pathname, status: response.status() })
    }
    if (url.origin === baseURL && /\/auth\/(login|logout|refresh|me)$/.test(url.pathname)) {
      authResponses.push({ path: url.pathname, method: response.request().method(), status: response.status() })
    }
  })

  await verify('Docker web reaches healthy PostgreSQL, Redis and MinIO', async () => {
    const response = await context.request.get('/health/ready')
    expect(response.status()).toBe(200)
    const health = await response.json()
    for (const service of ['database', 'redis', 'minio']) {
      expect(health.checks[service].status).toBe('Healthy')
      expect(health.checks[service].description).not.toMatch(/disabled|local storage is active/i)
    }
  })

  await verify('Create an isolated account through the real API', async () => {
    const response = await context.request.post('/api/v1/auth/register', {
      data: {
        displayName: `Submission browser ${runId}`, username,
        email: `${username}@example.invalid`, password, confirmPassword: password,
        captchaQuestion: '8 + 5', captchaAnswer: '13',
      },
    })
    expect([200, 201]).toContain(response.status())
    accountId = payload(await response.json()).user.id
    expect(accountId).toBeTruthy()
    const logout = await context.request.post('/api/v1/auth/logout', { data: {} })
    expect([200, 204]).toContain(logout.status())
    expect((await context.request.get('/api/v1/auth/me')).status()).toBe(401)
  })

  await verify('Login using the actual browser form', async () => {
    const response = await page.goto('/login', { waitUntil: 'domcontentloaded' })
    expect(response.status()).toBe(200)
    await page.getByLabel('Tên đăng nhập', { exact: true }).fill(username)
    await page.getByLabel('Mật khẩu', { exact: true }).fill(password)
    const [request] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/auth/login'
        && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Đăng nhập', exact: true }).click(),
    ])
    expect(request.status()).toBe(200)
    await expect(page).toHaveURL(`${baseURL}/community`)
    await expect(page.locator('.community-nav-account').getByRole('button', { name: 'Đăng xuất', exact: true })).toBeVisible()
    await assertSessionStorageIsSafe()
  })

  await verify('Account settings opens without redirecting to login', async () => {
    await page.locator('.community-nav-group').filter({ has: page.locator('summary', { hasText: 'Tài khoản' }) })
      .locator('summary').click()
    await page.locator('.community-nav-group-links').getByRole('link', { name: 'Cài đặt tài khoản', exact: true }).click()
    await expect(page).toHaveURL(`${baseURL}/account`)
    await expect(page.getByRole('heading', { name: 'Cài đặt hồ sơ', exact: true })).toBeVisible()
    await expect(page.getByLabel('Username', { exact: true })).toHaveValue(username)
  })

  await verify('Edit and save profile through the actual form', async () => {
    await page.getByLabel('Họ và tên', { exact: true }).fill(updatedName)
    await page.locator('textarea[name="bio"]').fill(updatedBio)
    await page.getByLabel('Số điện thoại', { exact: true }).fill('0900000000')
    const [saved] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/account/profile'
        && response.request().method() === 'PUT'),
      page.getByRole('button', { name: /Lưu hồ sơ/ }).click(),
    ])
    expect(saved.status()).toBe(200)
    const persisted = payload(await (await context.request.get('/api/v1/account/me')).json())
    expect(persisted.fullName).toBe(updatedName)
    expect(persisted.bio).toBe(updatedBio)
    expect(persisted.phoneNumber).toBe('0900000000')
  })

  await verify('Upload avatar in the browser and load its real stored image', async () => {
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACLSURBVHhe7dAxAQAgEIDAL2RNo3xN3akAwy2MzNn7zIbBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYfCmcgizyrqgyAAAAAElFTkSuQmCC', 'base64')
    const [response] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/account/avatar'
        && response.request().method() === 'POST'),
      page.locator('.avatar-upload-row input[type="file"]').setInputFiles({ name: `${runId}.png`, mimeType: 'image/png', buffer }),
    ])
    expect(response.status()).toBe(200)
    const avatarUrl = payload(await response.json()).avatarUrl
    const stored = await context.request.get(new URL(avatarUrl, baseURL).href)
    expect(stored.status()).toBe(200)
    expect(stored.headers()['content-type']).toMatch(/^image\//)
    await expect(page.locator('.avatar-upload-row img')).toHaveAttribute('src', avatarUrl)
    await expect.poll(() => page.locator('.avatar-upload-row img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
  })

  await verify('Reload retains profile, avatar and cookie session', async () => {
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(`${baseURL}/account`)
    await expect(page.getByLabel('Họ và tên', { exact: true })).toHaveValue(updatedName)
    await expect(page.locator('textarea[name="bio"]')).toHaveValue(updatedBio)
    await expect.poll(() => page.locator('.avatar-upload-row img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
    await assertSessionStorageIsSafe()
    await page.screenshot({ path: path.join(outputDirectory, 'account-after-reload.png'), fullPage: true })
  })

  await verify('Home shows categories and newly listed recipes', async () => {
    await page.locator('.community-nav nav').getByRole('link', { name: 'Trang chủ', exact: true }).click()
    await expect(page).toHaveURL(`${baseURL}/home`)
    await expect(page.getByRole('heading', { name: 'Nấu món ngon, kể chuyện bếp nhà', exact: true })).toBeVisible()
    await expect.poll(() => page.locator('.home-recipe-grid article').count()).toBeGreaterThan(0)
    await expect.poll(() => page.locator('nav[aria-label="Danh mục món ăn"] a').count()).toBeGreaterThan(0)
    const counts = await page.locator('nav[aria-label="Danh mục món ăn"] b').allTextContents()
    expect(counts.every(value => Number(value) > 0)).toBe(true)
    await page.screenshot({ path: path.join(outputDirectory, 'home.png'), fullPage: true })
  })

  await verify('Category list opens and both close controls work', async () => {
    await page.locator('.home-sidebar').getByRole('link', { name: 'Xem tất cả', exact: true }).click()
    await expect(page).toHaveURL(`${baseURL}/categories`)
    await expect.poll(() => page.locator('.category-tile-select').count()).toBeGreaterThanOrEqual(20)
    const firstCategory = page.locator('.category-tile-select').first()
    await firstCategory.click()
    const dialog = page.getByRole('dialog', { name: /Các món trong danh mục/ })
    await expect(dialog).toBeVisible()
    await expect.poll(() => dialog.locator('.category-recipe-list a').count()).toBeGreaterThan(0)
    await dialog.getByRole('button', { name: 'Đóng danh sách công thức', exact: true }).click()
    await expect(dialog).toHaveCount(0)
    await firstCategory.click()
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Đã hiểu, đóng danh sách', exact: true }).click()
    await expect(dialog).toHaveCount(0)
  })

  await verify('Category recipe link opens cooking instructions', async () => {
    await page.locator('.category-tile-select').first().click()
    const dialog = page.getByRole('dialog', { name: /Các món trong danh mục/ })
    const link = dialog.locator('.category-recipe-list a').first()
    await expect(link).toBeVisible()
    const destination = await link.getAttribute('href')
    expect(destination).toMatch(/^\/recipes\/[a-zA-Z0-9-]+$/)
    await link.click()
    await expect(page).toHaveURL(`${baseURL}${destination}`)
    await expect(page.locator('.recipe-detail-header h1')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Nguyên liệu', exact: true }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Các bước làm', exact: true })).toBeVisible()
    expect(await page.locator('.recipe-detail-grid ul li').count()).toBeGreaterThanOrEqual(10)
    expect(await page.locator('.recipe-detail-grid ol li').count()).toBeGreaterThanOrEqual(5)
    await page.screenshot({ path: path.join(outputDirectory, 'recipe-from-category.png'), fullPage: true })
    await page.goto('/account', { waitUntil: 'domcontentloaded' })
    await expect(page.getByLabel('Họ và tên', { exact: true })).toHaveValue(updatedName)
  })

  await verify('Logout revokes browser session and protects account settings', async () => {
    const logoutButton = page.locator('.community-nav-account').getByRole('button', { name: 'Đăng xuất', exact: true })
    await expect(logoutButton).toBeVisible()
    await page.screenshot({ path: path.join(outputDirectory, 'before-logout.png'), fullPage: true })
    const [loggedOut] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/auth/logout'
        && response.request().method() === 'POST', { timeout: 15_000 }),
      logoutButton.click({ timeout: 15_000 }),
    ])
    expect([200, 204]).toContain(loggedOut.status())
    await expect(page.locator('.community-nav-account').getByRole('link', { name: 'Đăng nhập', exact: true })).toBeVisible()
    expect((await context.request.get('/api/v1/auth/me')).status()).toBe(401)
    await page.goto('/account', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(`${baseURL}/login`)
    await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible()
  })

  await verify('No browser JavaScript exception or observed API server error', async () => {
    expect(pageErrors).toEqual([])
    expect(apiServerErrors).toEqual([])
    const refreshes = authResponses.filter(response => response.path.endsWith('/auth/refresh'))
    expect(refreshes.filter(response => response.status >= 400)).toEqual([])
    // Only the two explicit authenticated document reloads require restoring
    // a token from the HttpOnly cookie. Ordinary API requests reuse memory.
    expect(refreshes.length).toBeLessThanOrEqual(3)
  })
} catch (error) {
  failure = sanitize(error.message)
  if (page) failureState = await page.evaluate(() => ({
    path: location.pathname,
    hasUserMetadata: Boolean(localStorage.getItem('currentUser')),
    storesAccessToken: Boolean(localStorage.getItem('accessToken')),
    storesRefreshToken: Boolean(localStorage.getItem('refreshToken')),
  })).catch(() => null)
  if (context && failureState) {
    failureState.privateProfileHttpStatus = await context.request.get('/api/v1/auth/me').then(response => response.status()).catch(() => null)
    failureState.cookieMetadata = (await context.cookies()).filter(cookie => cookie.name.startsWith('culinary_'))
      .map(cookie => ({ name: cookie.name, httpOnly: cookie.httpOnly }))
  }
  if (page) await page.screenshot({ path: path.join(outputDirectory, 'failure.png'), fullPage: true }).catch(() => {})
} finally {
  await context?.close().catch(() => {})
  await browser?.close().catch(() => {})
  const report = {
    startedAt, finishedAt: new Date().toISOString(), baseURL, accountId, username,
    passed: failure === null, checks, pageErrors, apiServerErrors, authResponses, failure, failureState,
    scope: 'Real Chromium UI and real Docker API/PostgreSQL/Redis/MinIO; no API interception or mocking.',
    limitations: 'Does not certify all administration, SMTP, Google OAuth, service-outage recovery or every extended feature. Test account remains only in the isolated submission database.',
  }
  await writeFile(path.join(outputDirectory, 'result.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  process.stdout.write(`Browser evidence: ${path.relative(repositoryRoot, outputDirectory)}\n`)
  if (failure) {
    process.stderr.write(`FAIL ${failure}\n`)
    process.exitCode = 1
  }
}
