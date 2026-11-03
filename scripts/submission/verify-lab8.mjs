import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const requireFrontend = createRequire(path.join(root, 'frontend/package.json'))
const { chromium, expect } = requireFrontend('@playwright/test')
const web = new URL(process.env.LAB8_WEB_URL || 'http://localhost:3000')
const api = new URL(process.env.LAB8_API_URL || 'http://localhost:5152')
for (const url of [web, api]) {
  if (!['localhost', '127.0.0.1'].includes(url.hostname) || url.protocol !== 'http:' || url.username || url.password) {
    throw new Error('Lab 8 verification only permits local HTTP targets and creates its own test account/recipe.')
  }
}
if (web.hostname !== api.hostname) throw new Error('Use the same localhost hostname for cookie authentication.')
const runId = `lab8${Date.now()}${randomUUID().replaceAll('-', '').slice(0, 6)}`
const output = path.join(root, 'artifacts/lab8-fixes-20261103', runId)
await mkdir(output, { recursive: true })
const password = `Lab8!${randomUUID()}Aa9`
const checks = []
const errors = []
const serverErrors = []
let recipeId
let userId
let questionId
let sessionId
let collectionId
let failure
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ baseURL: web.origin, viewport: { width: 1440, height: 1080 }, reducedMotion: 'reduce' })
context.setDefaultTimeout(30_000)
const page = await context.newPage()
page.on('pageerror', error => errors.push(error.message))
page.on('response', response => {
  const url = new URL(response.url())
  if (url.origin === api.origin && url.pathname.startsWith('/api/') && response.status() >= 500) {
    serverErrors.push({ path: url.pathname, status: response.status() })
  }
})
const unwrap = json => json?.data ?? json
async function request(method, pathname, data) {
  let response
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await context.request.fetch(`${api.origin}${pathname}`, { method, ...(data ? { data } : {}) })
    if (response.status() !== 429 || !pathname.startsWith('/api/v1/auth/') || attempt === 2) break
    const header = response.headers()['retry-after']
    const delay = Math.max(1, Math.min(75, /^\d+$/.test(header || '') ? Number(header) + 1 : 61))
    process.stdout.write(`Respecting auth Retry-After: ${delay}s\n`)
    await new Promise(resolve => setTimeout(resolve, delay * 1000))
  }
  expect(response.status(), `${method} ${pathname}`).toBeLessThan(400)
  return response.status() === 204 ? null : unwrap(await response.json())
}
async function verify(name, action) {
  try {
    await action()
    checks.push({ name, passed: true })
    process.stdout.write(`PASS ${name}\n`)
  } catch (error) {
    checks.push({ name, passed: false, detail: String(error.message).replaceAll(password, '[redacted]') })
    throw error
  }
}
const fixture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACLSURBVHhe7dAxAQAgEIDAL2RNo3xN3akAwy2MzNn7zIbBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYfCmcgizyrqgyAAAAAElFTkSuQmCC', 'base64')
const photo = name => ({ name, mimeType: 'image/png', buffer: fixture })
let title = `Canh chua kiểm thử ${runId}`
async function edit() {
  await page.getByRole('button', { name: `Chỉnh sửa ${title}`, exact: true }).click()
  return page.getByRole('dialog', { name: 'Chỉnh sửa công thức', exact: true })
}
async function save(dialog) {
  await dialog.locator('button[type="submit"]').click()
  await expect(dialog).not.toBeVisible({ timeout: 30_000 })
}
const children = recipe => ({
  ingredients: recipe.recipeIngredients.map(({ id, recipeId, ...item }) => item),
  steps: recipe.recipeSteps.map(({ id, recipeId, ...item }) => item),
  nutrition: recipe.nutrition,
})

try {
  await verify('PostgreSQL, Redis and MinIO are healthy', async () => {
    const health = await request('GET', '/health')
    expect(health.status).toBe('Healthy')
    for (const key of ['database', 'redis', 'minio']) expect(health.checks[key].status).toBe('Healthy')
  })
  await verify('Register a unique account and retain HttpOnly login after reload', async () => {
    const registered = await request('POST', '/api/v1/auth/register', {
      username: runId, displayName: `Lab 8 ${runId}`, email: `${runId}@example.invalid`,
      password, confirmPassword: password, captchaQuestion: '8 + 5', captchaAnswer: '13',
    })
    userId = registered.user.id
    await page.goto('/login')
    await page.evaluate(user => localStorage.setItem('currentUser', JSON.stringify(user)), registered.user)
    await page.goto('/recipes')
    await page.reload()
    await expect(page.getByRole('button', { name: '+ Thêm mới', exact: true })).toBeVisible()
    const cookies = await context.cookies()
    expect(cookies.some(cookie => cookie.name === 'culinary_access_token' && cookie.httpOnly)).toBe(true)
    expect(await page.evaluate(() => localStorage.getItem('accessToken'))).toBeNull()
  })
  await verify('Create a recipe in the real form with 10 detailed ingredients, 5 steps and a MinIO cover', async () => {
    await page.getByRole('button', { name: '+ Thêm mới', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Thêm công thức mới', exact: true })
    await dialog.getByLabel('Tiêu đề', { exact: true }).fill(title)
    await dialog.getByLabel('Mô tả', { exact: true }).fill('Dữ liệu kiểm thử riêng. Chỉ công thức do lượt kiểm thử này tạo được chỉnh sửa.')
    for (let i = 1; i <= 10; i++) {
      await dialog.getByLabel(`Tên nguyên liệu ${i}`, { exact: true }).fill(`Nguyên liệu ${i}, làm sạch`)
      await dialog.getByLabel(`Số lượng nguyên liệu ${i}`, { exact: true }).fill(i === 1 ? '1,5' : '100')
      await dialog.getByLabel(`Đơn vị nguyên liệu ${i}`, { exact: true }).fill('g')
      await dialog.getByLabel(`Ghi chú nguyên liệu ${i}`, { exact: true }).fill('Rửa sạch. Để ráo.')
    }
    for (let i = 1; i <= 5; i++) {
      await dialog.getByLabel(`Tiêu đề bước ${i}`, { exact: true }).fill(`Chuẩn bị ${i}`)
      await dialog.getByLabel(`Mô tả bước ${i}`, { exact: true }).fill('Thêm 1.5 lít nước. Đun 2.5 phút.\nNêm lại cho vừa ăn.')
      await dialog.getByLabel(`Thời gian bước ${i}`, { exact: true }).fill(i === 1 ? '0' : '5')
    }
    await dialog.locator('#nutrition-calories').fill('215.5')
    await dialog.locator('#recipe-image').setInputFiles(photo('lab8-cover.png'))
    await expect(dialog.getByAltText('Xem trước món ăn')).toBeVisible()
    const [response] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/recipes' && response.request().method() === 'POST')
        .then(async response => {
          if (response.status() === 201) recipeId = unwrap(await response.json()).id
          return response
        }),
      save(dialog),
    ])
    expect(response.status()).toBe(201)
    recipeId = unwrap(await response.json()).id
    const recipe = await request('GET', `/api/v1/recipes/${recipeId}`)
    expect(recipe.recipeIngredients).toHaveLength(10)
    expect(recipe.recipeSteps).toHaveLength(5)
    expect(recipe.recipeSteps[0].timerMinutes).toBe(0)
    expect(recipe.imageUrl).toContain('/recipes/')
    expect((await context.request.get(recipe.imageUrl)).status()).toBe(200)
  })
  await verify('A title-only edit after reload preserves every structured recipe field', async () => {
    const before = await request('GET', `/api/v1/recipes/${recipeId}`)
    await page.reload()
    const dialog = await edit()
    title += ' đã cập nhật'
    await dialog.getByLabel('Tiêu đề', { exact: true }).fill(title)
    await save(dialog)
    const after = await request('GET', `/api/v1/recipes/${recipeId}`)
    expect(children(after)).toEqual(children(before))
    expect(after.imageUrl).toBe(before.imageUrl)
  })
  await verify('Step punctuation, multiline content, timers and step photo survive a second save', async () => {
    const before = await request('GET', `/api/v1/recipes/${recipeId}`)
    const dialog = await edit()
    await dialog.getByLabel('Ảnh bước 1', { exact: true }).fill(before.imageUrl)
    await save(dialog)
    const dialogAgain = await edit()
    await expect(dialogAgain.getByLabel('Ảnh bước 1', { exact: true })).toHaveValue(before.imageUrl)
    await save(dialogAgain)
    const after = await request('GET', `/api/v1/recipes/${recipeId}`)
    expect(after.recipeSteps).toHaveLength(5)
    expect(after.recipeSteps[0].description).toBe('Thêm 1.5 lít nước. Đun 2.5 phút.\nNêm lại cho vừa ăn.')
    expect(after.recipeSteps[0].imageUrl).toBe(before.imageUrl)
    expect(after.recipeIngredients[0].quantity).toBe('1,5')
  })
  await verify('Replacing a cover uses recipe images and displays the new primary image', async () => {
    const before = await request('GET', `/api/v1/recipes/${recipeId}`)
    const dialog = await edit()
    await dialog.locator('#recipe-image').setInputFiles(photo('lab8-replacement.png'))
    await save(dialog)
    const after = await request('GET', `/api/v1/recipes/${recipeId}`)
    expect(after.imageUrl).not.toBe(before.imageUrl)
    expect(after.imageUrl).toContain('/recipes/')
    expect((await context.request.get(after.imageUrl)).status()).toBe(200)
    const card = page.locator('.recipe-summary-card').filter({ has: page.getByRole('link', { name: title, exact: true }) })
    await expect(card.locator('.recipe-card-photo img')).toHaveJSProperty('naturalWidth', 64)
    await page.screenshot({ path: path.join(output, 'recipe-cover.png') })
  })
  await verify('Row add, reorder and remove keeps metadata with the correct ingredient and step', async () => {
    const dialog = await edit()
    await dialog.getByRole('button', { name: '+ Thêm nguyên liệu', exact: true }).click()
    await dialog.getByLabel('Tên nguyên liệu 11', { exact: true }).fill('Nguyên liệu tạm')
    await dialog.getByRole('button', { name: 'Xóa nguyên liệu 11', exact: true }).click()
    await dialog.getByRole('button', { name: 'Đưa nguyên liệu 1 xuống', exact: true }).click()
    await expect(dialog.getByLabel('Số lượng nguyên liệu 2', { exact: true })).toHaveValue('1,5')
    await dialog.getByRole('button', { name: 'Đưa nguyên liệu 2 lên', exact: true }).click()
    await dialog.getByRole('button', { name: '+ Thêm bước làm', exact: true }).click()
    await dialog.getByLabel('Mô tả bước 6', { exact: true }).fill('Bước tạm.')
    await dialog.getByRole('button', { name: 'Xóa bước 6', exact: true }).click()
    await save(dialog)
    const recipe = await request('GET', `/api/v1/recipes/${recipeId}`)
    expect(recipe.recipeIngredients).toHaveLength(10)
    expect(recipe.recipeSteps).toHaveLength(5)
    expect(recipe.recipeIngredients[0].quantity).toBe('1,5')
  })
  await verify('Publish, unpublish, archive and restore through the real UI', async () => {
    for (const [button, state] of [['Publish', 1], ['Unpublish', 0], ['Archive', 2], ['Restore', 0]]) {
      const card = page.locator('.recipe-summary-card').filter({ has: page.getByRole('link', { name: title, exact: true }) })
      await card.getByRole('button', { name: button, exact: true }).click()
      await expect.poll(async () => (await request('GET', `/api/v1/recipes/${recipeId}`)).status).toBe(state)
      await expect(card.getByRole('button', { name: state === 1 ? 'Unpublish' : state === 2 ? 'Restore' : 'Publish', exact: true })).toBeVisible()
    }
  })
  await verify('Profile updates survive reload with the same cookie session', async () => {
    await page.goto('/account')
    const name = `Kiểm thử Lab 8 ${runId}`
    await page.getByLabel('Họ và tên', { exact: true }).fill(name)
    await page.locator('textarea[name="bio"]').fill('Hồ sơ riêng của lượt kiểm thử Lab 8.')
    const [response] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/account/profile' && response.request().method() === 'PUT'),
      page.getByRole('button', { name: /Lưu hồ sơ/ }).click(),
    ])
    expect(response.status()).toBe(200)
    await page.reload()
    await expect(page.getByLabel('Họ và tên', { exact: true })).toHaveValue(name)
  })
  await verify('Journal saves to the account database and survives reload', async () => {
    await page.goto('/journal')
    await expect(page.getByRole('button', { name: 'Lưu nhật ký', exact: true })).toBeEnabled()
    await page.getByLabel('Tên món', { exact: true }).fill(`Nhật ký ${runId}`)
    await page.getByLabel('Ghi chú', { exact: true }).fill('Nêm 1.5 thìa nước mắm. Giữ nguyên dữ liệu sau tải lại.')
    await page.getByRole('button', { name: 'Lưu nhật ký', exact: true }).click()
    await expect(page.locator('.journal-list')).toContainText(`Nhật ký ${runId}`)
    await page.reload()
    await expect(page.locator('.journal-list')).toContainText(`Nhật ký ${runId}`)
  })
  await verify('Kitchen question and reply persist through real API and browser reload', async () => {
    await page.goto('/qna')
    await expect(page.getByRole('button', { name: 'Gửi câu hỏi', exact: true })).toBeEnabled()
    const question = `Câu hỏi ${runId}: nêm 1.5 thìa được không?`
    await page.getByLabel('Câu hỏi của bạn', { exact: true }).fill(question)
    const [response] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/features/questions' && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Gửi câu hỏi', exact: true }).click(),
    ])
    expect(response.status()).toBe(201)
    questionId = unwrap(await response.json()).id
    let card = page.locator('.qna-card').filter({ hasText: question })
    await card.getByRole('textbox').fill('Nêm từng ít rồi nếm lại trước khi tắt bếp.')
    await card.getByRole('button', { name: 'Gửi trả lời', exact: true }).click()
    await expect(card.locator('.qna-answer')).toContainText('Nêm từng ít rồi nếm lại trước khi tắt bếp.')
    await page.reload()
    card = page.locator('.qna-card').filter({ hasText: question })
    await expect(card).toBeVisible()
    await expect(card.locator('.qna-answer')).toContainText('Nêm từng ít rồi nếm lại trước khi tắt bếp.')
  })
  await verify('Cookbook creates persistent collections with real recipe links and deletes only its own collection', async () => {
    await page.goto('/cookbook')
    await expect(page.getByRole('button', { name: 'Tạo sổ tay', exact: true })).toBeEnabled()
    const name = `Sổ tay ${runId}`
    await page.getByLabel('Tên bộ sưu tập', { exact: true }).fill(name)
    await page.getByRole('button', { name: 'Tạo sổ tay', exact: true }).click()
    const card = page.locator('.cookbook-card').filter({ hasText: name })
    await expect(card.getByRole('link')).toHaveCount(1)
    const collections = await request('GET', '/api/v1/features/collections')
    collectionId = collections.find(item => item.name === name)?.id
    expect(collectionId).toBeTruthy()
    await page.reload()
    await expect(card.getByRole('link')).toHaveAttribute('href', /\/recipes\/[0-9a-f-]+$/)
    page.once('dialog', dialog => dialog.accept())
    await card.getByRole('button', { name: 'Xóa sổ tay', exact: true }).click()
    await expect(card).not.toBeVisible()
    collectionId = null
  })
  await verify('Cooking sessions persist their host and membership then allow the host to cancel', async () => {
    await page.goto('/cook-together')
    await expect(page.getByRole('button', { name: 'Tạo buổi nấu', exact: true })).toBeEnabled()
    const name = `Nấu chung ${runId}`
    await page.getByLabel('Tên buổi nấu', { exact: true }).fill(name)
    const date = new Date(Date.now() + 86400_000)
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    await page.getByLabel('Thời gian bắt đầu', { exact: true }).fill(localDate)
    const [response] = await Promise.all([
      page.waitForResponse(response => new URL(response.url()).pathname === '/api/v1/features/cooking-sessions' && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Tạo buổi nấu', exact: true }).click(),
    ])
    expect(response.status()).toBe(201)
    sessionId = unwrap(await response.json()).id
    const card = page.locator('.cook-together-card').filter({ hasText: name })
    await expect(card).toContainText('1/6 người')
    await page.reload()
    await expect(card).toContainText('1/6 người')
    page.once('dialog', dialog => dialog.accept())
    await card.getByRole('button', { name: 'Hủy buổi nấu', exact: true }).click()
    await expect(card).not.toBeVisible()
    sessionId = null
  })
  await verify('Delete only this test recipe and verify it is no longer accessible', async () => {
    await page.goto('/recipes')
    page.once('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: `Xóa ${title}`, exact: true }).click()
    await expect(page.getByRole('button', { name: `Xóa ${title}`, exact: true })).not.toBeVisible()
    expect((await context.request.get(`${api.origin}/api/v1/recipes/${recipeId}`)).status()).toBe(404)
  })
  await verify('Logout returns to the community and account settings requires sign-in again', async () => {
    await page.locator('.community-nav-account').getByRole('button', { name: 'Đăng xuất', exact: true }).click()
    await expect(page).toHaveURL(`${web.origin}/community`)
    expect((await context.request.get(`${api.origin}/api/v1/auth/me`)).status()).toBe(401)
    await page.goto('/account')
    await expect(page).toHaveURL(/\/login(?:\?|$)/)
  })
  await verify('No JavaScript exception or API 500 occurred in these real flows', async () => {
    expect(errors).toEqual([])
    expect(serverErrors).toEqual([])
  })
} catch (error) {
  failure = String(error.message).replaceAll(password, '[redacted]')
  await page.screenshot({ path: path.join(output, 'failure.png'), timeout: 10_000 }).catch(() => {})
} finally {
  // Cleanup is restricted to the one ID created by this run. No seed/user
  // recipe is selected for modification or deletion.
  if (recipeId) {
    try {
      await request('POST', '/api/v1/auth/login', { username: runId, password })
      await context.request.delete(`${api.origin}/api/v1/recipes/${recipeId}`)
      if (questionId) await context.request.delete(`${api.origin}/api/v1/community/posts/${questionId}`)
      if (sessionId) await context.request.delete(`${api.origin}/api/v1/features/cooking-sessions/${sessionId}`)
      if (collectionId) await context.request.delete(`${api.origin}/api/v1/features/collections/${collectionId}`)
      await context.request.delete(`${api.origin}/api/v1/extensions/drafts/recipe-journal`)
    } catch { }
  }
  await context.request.post(`${api.origin}/api/v1/auth/logout`, { data: {} }).catch(() => {})
  await writeFile(path.join(output, 'result.json'), JSON.stringify({
    runId, userId, recipeId, passed: !failure, checks, errors, serverErrors, failure,
    limits: ['Only this run\'s account and recipe are changed.', 'Google OAuth and real external SMTP are not covered.', 'Delayed/failing uploads are covered separately by mocked regression tests.'],
  }, null, 2))
  await browser.close()
}
process.stdout.write(`Evidence: ${output}\n`)
if (failure) throw new Error(failure)
