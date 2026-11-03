import { test, expect } from '@playwright/test'

const user = {
  id: 'recipe-editor-regression-user', username: 'recipeeditor', fullName: 'Recipe Editor Regression',
  displayName: 'Recipe Editor Regression', email: 'recipeeditor@example.invalid', role: 'User', bio: '',
}
const recipeId = '11111111-1111-4111-8111-111111111111'
const categoryId = '22222222-2222-4222-8222-222222222222'
const imageId = '33333333-3333-4333-8333-333333333333'
const imageUrl = 'http://localhost:5152/uploads/recipes/editor-regression.png'
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64')

function fixture() {
  const recipeIngredients = Array.from({ length: 10 }, (_, index) => ({
    id: `ingredient-${index + 1}`, name: `Nguyên liệu kiểm thử ${index + 1}`,
    quantity: index === 0 ? '1.5' : String(index + 1), unit: 'g',
    notes: `Ghi chú nguyên liệu ${index + 1}`, orderIndex: index + 1,
  }))
  const recipeSteps = Array.from({ length: 5 }, (_, index) => ({
    id: `step-${index + 1}`, title: `Chuẩn bị bước ${index + 1}`,
    description: index === 0 ? 'Đun 1.5 lít nước. Giữ lửa nhỏ. Không tách thành bước khác.' : `Thực hiện bước ${index + 1}. Kiểm tra thành phẩm.`,
    timerMinutes: index + 2, imageUrl: `https://example.invalid/step-${index + 1}.png`, stepNumber: index + 1,
  }))
  return {
    id: recipeId, title: 'Canh rau củ kiểm thử', description: 'Công thức riêng dùng cho kiểm thử hồi quy.',
    authorId: user.id, categoryId, status: 0, difficulty: 'Medium', isVegetarian: true,
    prepTimeMinutes: 5, cookTimeMinutes: 15, cookingTimeMinutes: 20, servings: 2,
    imageUrl: null, nutrition: { calories: 120, protein: 3, carbohydrates: 15, fat: 4, fiber: 5, sodium: 150 },
    recipeIngredients, recipeSteps,
    ingredients: recipeIngredients.map(item => `${item.quantity} ${item.unit} ${item.name}`),
    instructions: recipeSteps.map(item => item.description),
  }
}

async function mockCatalog(page, { empty = false, upload, profile = user } = {}) {
  const state = { recipe: fixture(), creates: [], updates: [], uploads: [], refreshes: 0, mediaUploads: 0, sequence: [] }
  await page.route('**/api/v1/**', async route => {
    const request = route.request()
    const path = new URL(request.url()).pathname.replace('/api/v1', '')
    const method = request.method()
    const reply = data => route.fulfill({ json: { data } })
    if (path === '/auth/refresh') {
      state.refreshes++
      return route.fulfill({ status: 429, json: { status: 429, detail: 'Cookie session must not require a preemptive refresh.' } })
    }
    if (path === '/auth/me' || path === '/account/me') return reply(profile)
    if (path === '/features/notifications') return reply({ unreadCount: 0, items: [] })
    if (path === '/categories') return reply([{ id: categoryId, name: 'Món canh', publishedRecipeCount: 0 }])
    if (path === '/recipes/mine' || (path === '/recipes' && method === 'GET')) return reply(empty && state.creates.length === 0 ? [] : [state.recipe])
    if (path === '/recipes' && method === 'POST') {
      state.creates.push(request.postDataJSON())
      state.sequence.push('create')
      state.recipe = { ...state.recipe, ...request.postDataJSON(), id: recipeId }
      return reply(state.recipe)
    }
    if (path === `/recipes/${recipeId}` && method === 'PUT') {
      state.updates.push(request.postDataJSON())
      state.sequence.push('update')
      state.recipe = { ...state.recipe, ...request.postDataJSON() }
      return reply(state.recipe)
    }
    if (path === `/recipes/${recipeId}`) return reply(state.recipe)
    if (path === '/community/upload-media') {
      state.mediaUploads++
      return route.fulfill({ status: 500, json: { detail: 'Recipe photos must use recipe-specific storage.' } })
    }
    if (path === `/recipes/${recipeId}/images` && method === 'POST') {
      state.uploads.push(request.postDataBuffer().toString())
      state.sequence.push('upload')
      if (upload) {
        const failure = await upload(state.uploads.length)
        if (failure) return route.fulfill({ status: failure, json: { status: failure, detail: 'Tải ảnh tạm thời thất bại. Vui lòng thử lại.' } })
      }
      state.recipe.imageUrl = imageUrl
      return reply({ id: imageId, url: imageUrl, isPrimary: true })
    }
    if (path === `/recipes/${recipeId}/images/${imageId}/primary`) return reply({ id: imageId, url: imageUrl, isPrimary: true })
    return reply([])
  })
  return state
}

async function openEditor(page) {
  await page.goto('/recipes')
  await page.getByRole('button', { name: 'Chỉnh sửa Canh rau củ kiểm thử', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Chỉnh sửa công thức', exact: true })
  await expect(dialog).toBeVisible()
  return dialog
}

async function fillNewRecipe(dialog) {
  await dialog.getByLabel('Tiêu đề', { exact: true }).fill('Canh rau củ mới kiểm thử')
  await dialog.getByLabel('Mô tả', { exact: true }).fill('Công thức kiểm tra retry ảnh mà không tạo trùng.')
  for (let index = 1; index <= 10; index++) {
    if (await dialog.getByLabel(`Tên nguyên liệu ${index}`, { exact: true }).count() === 0) {
      await dialog.getByRole('button', { name: /Thêm nguyên liệu/ }).click()
    }
    await dialog.getByLabel(`Tên nguyên liệu ${index}`, { exact: true }).fill(`Nguyên liệu mới ${index}`)
  }
  for (let index = 1; index <= 5; index++) {
    if (await dialog.getByLabel(`Mô tả bước ${index}`, { exact: true }).count() === 0) {
      await dialog.getByRole('button', { name: /Thêm bước/ }).click()
    }
    await dialog.getByLabel(`Mô tả bước ${index}`, { exact: true }).fill(`Nấu bước ${index}. Giữ nguyên dấu chấm.`)
  }
}

test.beforeEach(async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await context.addCookies([{
    name: 'culinary_access_token', value: 'cookie-only-editor-session',
    domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax',
  }])
  await page.addInitScript(profile => {
    localStorage.setItem('currentUser', JSON.stringify(profile))
    localStorage.setItem('culinary:cosmic-preferences', JSON.stringify({ soundEnabled: false, effectsEnabled: false, spiderEnabled: false }))
  }, user)
})

test('cookie-backed reload keeps create and edit controls without refreshing tokens', async ({ page }) => {
  const browserErrors = []
  const hydrationErrors = []
  page.on('pageerror', error => browserErrors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error' && /hydration|hydrated|server rendered HTML/i.test(message.text())) hydrationErrors.push(message.text())
  })
  const state = await mockCatalog(page)
  await page.goto('/recipes')
  await expect(page.getByRole('button', { name: '+ Thêm mới', exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: '+ Thêm mới', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Chỉnh sửa Canh rau củ kiểm thử', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'Chỉnh sửa công thức', exact: true })).toBeVisible()
  expect(state.refreshes).toBe(0)
  expect(await page.evaluate(() => document.cookie)).not.toContain('culinary_access_token')
  expect(await page.evaluate(() => ({ access: localStorage.getItem('accessToken'), refresh: localStorage.getItem('refreshToken') }))).toEqual({ access: null, refresh: null })
  expect(browserErrors).toEqual([])
  expect(hydrationErrors).toEqual([])
})

test('an unavailable profile image falls back to initials instead of a broken avatar', async ({ page }) => {
  const avatarUrl = 'http://localhost:5152/uploads/avatars/editor-missing-avatar.png'
  await mockCatalog(page, { profile: { ...user, avatarUrl } })
  await page.route(avatarUrl, route => route.fulfill({ status: 404, body: 'Not found' }))
  await page.goto('/recipes')
  const avatar = page.locator('.community-nav-account .avatar-fallback')
  await expect(avatar).toHaveAttribute('role', 'img')
  await expect(avatar).toHaveAttribute('aria-label', user.fullName)
  await expect(avatar).toHaveText('R')
  await expect(page.locator('.community-nav-account img.community-avatar')).toHaveCount(0)
})

test('title-only edit preserves ingredient quantities, notes and complete step metadata', async ({ page }) => {
  const state = await mockCatalog(page)
  const original = structuredClone(state.recipe)
  const dialog = await openEditor(page)
  await expect(dialog.getByLabel('Số lượng nguyên liệu 1', { exact: true })).toHaveValue('1.5')
  await expect(dialog.getByLabel('Ghi chú nguyên liệu 1', { exact: true })).toHaveValue(original.recipeIngredients[0].notes)
  await expect(dialog.getByLabel('Thời gian bước 1', { exact: true })).toHaveValue('2')
  await dialog.getByLabel('Tiêu đề', { exact: true }).fill('Canh rau củ giữ đủ dữ liệu')
  await dialog.locator('button[type="submit"]').click()
  await expect(dialog).not.toBeVisible()
  expect(state.updates).toHaveLength(1)
  const saved = state.updates[0]
  expect(saved.title).toBe('Canh rau củ giữ đủ dữ liệu')
  expect(saved.recipeIngredients).toHaveLength(10)
  expect(saved.recipeIngredients[0]).toMatchObject({ name: original.recipeIngredients[0].name, quantity: '1.5', unit: 'g', notes: original.recipeIngredients[0].notes, orderIndex: 1 })
  expect(saved.recipeSteps).toHaveLength(5)
  expect(saved.recipeSteps[0]).toMatchObject({ title: original.recipeSteps[0].title, description: original.recipeSteps[0].description, timerMinutes: 2, imageUrl: original.recipeSteps[0].imageUrl })
  expect(saved.nutrition).toEqual(original.nutrition)
})

test('editing one step retains decimals, commas and sentences as one step', async ({ page }) => {
  const state = await mockCatalog(page)
  const dialog = await openEditor(page)
  const description = 'Thêm 1.5 lít nước, 0.25 muỗng muối. Nấu 2.5 phút. Sau đó tắt bếp.'
  await dialog.getByLabel('Mô tả bước 1', { exact: true }).fill(description)
  await dialog.getByLabel('Tên nguyên liệu 1', { exact: true }).fill('Muối, tiêu xay')
  await dialog.locator('button[type="submit"]').click()
  await expect(dialog).not.toBeVisible()
  expect(state.updates[0].recipeSteps).toHaveLength(5)
  expect(state.updates[0].recipeSteps[0].description).toBe(description)
  expect(state.updates[0].recipeIngredients).toHaveLength(10)
  expect(state.updates[0].recipeIngredients[0].name).toBe('Muối, tiêu xay')
})

test('saving a recipe waits for its recipe-specific photo upload and blocks duplicate submit', async ({ page }) => {
  let releaseUpload
  const gate = new Promise(resolve => { releaseUpload = resolve })
  const state = await mockCatalog(page, { upload: async () => { await gate } })
  const dialog = await openEditor(page)
  await dialog.locator('#recipe-image').setInputFiles({ name: 'recipe-regression.png', mimeType: 'image/png', buffer: png })
  expect(state.uploads).toHaveLength(0)
  await dialog.locator('button[type="submit"]').click()
  try {
    await expect.poll(() => state.uploads.length).toBe(1)
    await expect(dialog.locator('button[type="submit"]')).toBeDisabled()
    await expect(dialog).toBeVisible()
    expect(state.sequence).toEqual(['update', 'upload'])
    expect(state.mediaUploads).toBe(0)
  } finally {
    releaseUpload()
  }
  await expect(dialog).not.toBeVisible()
  expect(state.updates).toHaveLength(1)
  expect(state.uploads[0]).toContain('filename="recipe-regression.png"')
  await expect(page.locator('.recipe-card-photo img')).toHaveAttribute('src', imageUrl)
})

test('failed image upload keeps the saved draft for retry instead of creating a duplicate recipe', async ({ page }) => {
  const state = await mockCatalog(page, { empty: true, upload: async attempt => attempt === 1 ? 503 : undefined })
  await page.goto('/recipes')
  await page.getByRole('button', { name: '+ Thêm mới', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await fillNewRecipe(dialog)
  await dialog.locator('#recipe-image').setInputFiles({ name: 'recipe-regression.png', mimeType: 'image/png', buffer: png })
  await dialog.locator('button[type="submit"]').click()
  await expect.poll(() => state.uploads.length).toBe(1)
  await expect(dialog.locator('button[type="submit"]')).toBeEnabled()
  await expect(dialog).toBeVisible()
  expect(state.creates).toHaveLength(1)
  await dialog.locator('button[type="submit"]').click()
  await expect(dialog).not.toBeVisible()
  expect(state.creates).toHaveLength(1)
  expect(state.uploads).toHaveLength(2)
  expect(state.mediaUploads).toBe(0)
  await expect(page.locator('.recipe-card-photo img')).toHaveAttribute('src', imageUrl)
})

test('create wizard retries a failed photo on the same draft without rotating a valid cookie session', async ({ page }) => {
  const state = await mockCatalog(page, { empty: true, upload: async attempt => attempt === 1 ? 503 : undefined })
  await page.goto('/recipes/new')
  await page.getByPlaceholder('Ví dụ: Bún chả Hà Nội', { exact: true }).fill('Canh rau củ tạo bằng wizard')
  await page.getByPlaceholder('Mô tả ngắn gọn về món ăn...', { exact: true }).fill('Kiểm tra tạo món và thử tải lại ảnh trên đúng bản nháp.')
  await page.locator('#wizard-recipe-image').setInputFiles({ name: 'recipe-regression.png', mimeType: 'image/png', buffer: png })
  await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click()
  for (let index = 0; index < 10; index++) {
    if (await page.getByPlaceholder('Tên nguyên liệu', { exact: true }).count() <= index) {
      await page.getByRole('button', { name: '+ Thêm nguyên liệu', exact: true }).click()
    }
    await page.getByPlaceholder('Tên nguyên liệu', { exact: true }).nth(index).fill(`Nguyên liệu wizard ${index + 1}`)
    await page.getByPlaceholder('Số lượng', { exact: true }).nth(index).fill('1.5')
    await page.getByPlaceholder('Đơn vị', { exact: true }).nth(index).fill('g')
    await page.getByPlaceholder('Ghi chú (không bắt buộc)', { exact: true }).nth(index).fill('Giữ nguyên chi tiết')
  }
  await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click()
  for (let index = 0; index < 5; index++) {
    if (await page.getByPlaceholder('Mô tả từng bước...', { exact: true }).count() <= index) {
      await page.getByRole('button', { name: '+ Thêm bước làm', exact: true }).click()
    }
    await page.getByPlaceholder('Mô tả từng bước...', { exact: true }).nth(index).fill(`Nấu 1.5 phút. Hoàn thành bước ${index + 1}.`)
    await page.getByPlaceholder('Thời gian hẹn giờ (phút)', { exact: true }).nth(index).fill('0')
  }
  await page.getByRole('button', { name: 'Hoàn tất', exact: true }).click()
  await expect.poll(() => state.uploads.length).toBe(1)
  await expect(page.getByRole('button', { name: 'Hoàn tất', exact: true })).toBeEnabled()
  await expect(page.getByRole('status').filter({ hasText: 'Bản nháp đã được lưu.' })).toBeVisible()
  await expect(page).toHaveURL(/\/recipes\/new$/)
  expect(state.creates).toHaveLength(1)
  expect(state.creates[0].recipeSteps).toHaveLength(5)
  expect(state.creates[0].recipeSteps[0].timerMinutes).toBe(0)
  expect(state.creates[0].recipeIngredients[0]).toMatchObject({ quantity: '1.5', unit: 'g', notes: 'Giữ nguyên chi tiết' })
  await page.getByRole('button', { name: 'Hoàn tất', exact: true }).click()
  await expect(page).toHaveURL(/\/recipes$/)
  expect(state.creates).toHaveLength(1)
  expect(state.updates).toHaveLength(1)
  expect(state.uploads).toHaveLength(2)
  expect(state.refreshes).toBe(0)
  expect(state.mediaUploads).toBe(0)
})
