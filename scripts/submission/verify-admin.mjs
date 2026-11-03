import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const require = createRequire(path.join(root, 'frontend/package.json'))
const { chromium, expect } = require('@playwright/test')
const username = process.env.CULINARY_ADMIN_USERNAME
const password = process.env.CULINARY_ADMIN_PASSWORD
const fixtureId = process.env.CULINARY_ADMIN_ID
if (!/^lab8admin\d{14}[a-f0-9]{6}$/.test(username || '') || !/^[a-f0-9-]{36}$/i.test(fixtureId || '') || !password) {
  throw new Error('Run verify-admin.ps1 to create a temporary administrator fixture; existing administrator credentials are not accepted.')
}
const output = path.resolve(root, process.env.CULINARY_ADMIN_OUTPUT || 'artifacts/lab8-admin')
if (!output.startsWith(`${path.join(root, 'artifacts')}${path.sep}`)) throw new Error('Reports must stay under ignored artifacts.')
await mkdir(output, { recursive: true })
const checks = []
const pageErrors = []
const apiFailures = []
const startedAt = new Date().toISOString()
let browser
let context
let page
let failed = null
const unwrap = value => value && typeof value === 'object' && Object.hasOwn(value, 'data') ? value.data : value
const items = value => Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : []
const sanitize = value => String(value).replaceAll(password, '[redacted]')
async function check(name, action) {
  try { await action(); checks.push({ name, passed: true }); process.stdout.write(`PASS ${name}\n`) }
  catch (error) { const detail = sanitize(error.message); checks.push({ name, passed: false, detail }); throw new Error(`${name}: ${detail}`) }
}
async function api(route, expected = 200) {
  const response = await context.request.get(`http://localhost:5152/api/v1${route}`)
  assert.equal(response.status(), expected, `GET ${route} returned ${response.status()}`)
  return unwrap(await response.json())
}

try {
  browser = await chromium.launch({ headless: true })
  context = await browser.newContext({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' })
  page = await context.newPage()
  page.setDefaultTimeout(30_000)
  page.on('pageerror', error => pageErrors.push(sanitize(error.message)))
  page.on('response', response => {
    const url = new URL(response.url())
    if (url.origin === 'http://localhost:5152' && url.pathname.startsWith('/api/') && response.status() >= 400) apiFailures.push({ path: url.pathname, status: response.status() })
  })
  await check('Temporary administrator signs in through the actual login form', async () => {
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' })
    await page.locator('#login-username').fill(username)
    await page.locator('#login-password').fill(password)
    await page.locator('form').getByRole('button', { name: 'Đăng nhập', exact: true }).click()
    await page.waitForURL('**/community')
    const me = await api('/auth/me')
    assert.equal(me.id, fixtureId)
    assert.equal(me.role, 'Admin')
  })
  const routes = ['overview', 'users', 'recipes', 'reviews', 'categories', 'posts', 'articles', 'reports', 'analytics?days=7', 'analytics?days=30', 'media/summary', 'system-status', 'audit-logs', 'review-templates', 'priority-queue', 'alerts']
  for (const route of routes) await check(`Admin API reads ${route}`, async () => { assert.ok(await api(`/admin/${route}`)) })
  for (const role of ['User', 'Author', 'Admin']) await check(`Admin member filter returns only ${role}`, async () => {
    const members = items(await api(`/admin/users?role=${role}&pageSize=100`))
    assert.ok(members.every(member => member.role === role))
    if (role === 'Admin') assert.ok(members.some(member => member.id === fixtureId))
  })
  await check('Admin can inspect only its own temporary fixture member detail', async () => { assert.equal((await api(`/admin/users/${fixtureId}`)).profile.id, fixtureId) })
  await check('Admin can read a recipe detail and its revision history', async () => {
    const recipe = items(await api('/admin/recipes?pageSize=1'))[0]
    assert.ok(recipe?.id)
    assert.ok(await api(`/admin/recipes/${recipe.id}`))
    assert.ok(await api(`/admin/recipes/${recipe.id}/history`))
  })
  await check('Admin permission descriptions can be read without changing any role', async () => { assert.ok(Array.isArray((await api('/pro/admin/permissions')).roles)) })
  for (const kind of ['users', 'recipes', 'reports', 'analytics']) await check(`Admin can export ${kind} CSV without storing personal data`, async () => {
    const response = await context.request.get(`http://localhost:5152/api/v1/pro/admin/exports/${kind}.csv`)
    assert.equal(response.status(), 200)
    assert.match(response.headers()['content-type'], /text\/csv/)
    assert.ok((await response.body()).length > 3)
  })
  await check('Admin dashboard overview loads actual API data', async () => {
    await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: 'Tổng quan hoạt động', exact: true })).toBeVisible()
    await expect(page.locator('.admin-error')).toHaveCount(0)
  })
  const tabs = ['Tổng quan', 'Công thức', 'Chờ duyệt', 'Danh mục', 'Bảng tin', 'Chuyện trong bếp', 'Thành viên', 'Báo cáo', 'Thống kê', 'Kho ảnh', 'Hệ thống', 'Nhật ký']
  for (const tab of tabs) await check(`Admin UI opens ${tab}`, async () => {
    await page.getByRole('navigation', { name: 'Điều hướng quản trị' }).getByRole('button', { name: tab, exact: true }).click()
    await expect(page.locator('.admin-main h1')).toHaveText(tab)
    await expect(page.locator('.admin-panel')).toBeVisible()
    await expect(page.locator('.admin-error')).toHaveCount(0)
  })
  await check('Admin member search and full-profile modal work for the own fixture', async () => {
    await page.getByRole('navigation', { name: 'Điều hướng quản trị' }).getByRole('button', { name: 'Thành viên', exact: true }).click()
    await page.getByPlaceholder('Tìm tên, username hoặc email').fill(username)
    const row = page.locator('.admin-table tbody tr').filter({ hasText: username })
    await expect(row).toHaveCount(1)
    await row.getByRole('button', { name: 'Hồ sơ đầy đủ', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog')).toContainText(`@${username}`)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
  await check('Admin sessions also reach the protected Hangfire dashboard', async () => {
    const response = await context.request.get('http://localhost:5152/hangfire', { maxRedirects: 5 })
    assert.equal(response.status(), 200)
    assert.match(await response.text(), /Hangfire/i)
  })
  await check('Admin screens do not produce JavaScript errors or failed API requests', async () => { assert.deepEqual(pageErrors, []); assert.deepEqual(apiFailures, []) })
  await page.screenshot({ path: path.join(output, 'admin-fixture-member.png'), fullPage: false })
} catch (error) {
  failed = sanitize(error.message)
  if (page) await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: false }).catch(() => {})
} finally {
  if (context) await context.request.post('http://localhost:5152/api/v1/auth/logout', { data: {} }).catch(() => {})
  await browser?.close()
  const report = { startedAt, finishedAt: new Date().toISOString(), status: failed ? 'failed' : 'passed', passed: checks.filter(item => item.passed).length, failed: checks.filter(item => !item.passed).length, fixtureId, checks, pageErrors, apiFailures, failure: failed, limits: ['Temporary fixture only; existing members, categories, content, passwords, roles and storage files were not modified.', 'CSV bodies were verified in memory and were not written to artifacts.', 'Admin write actions are not exercised by this read-only check.'] }
  await writeFile(path.join(output, 'admin-result.json'), JSON.stringify(report, null, 2), 'utf8')
  process.stdout.write(`ADMIN_RESULT ${report.status}: ${report.passed} passed, ${report.failed} failed\n`)
  if (failed) { process.stderr.write(`${failed}\n`); process.exitCode = 1 }
}
