import { test, expect } from '@playwright/test'

const preferencesKey = 'culinary:cosmic-preferences'
const recipes = [
  { id: '11111111-1111-4111-8111-111111111111', title: 'Bò sốt vang kiểu Bắc', categoryName: 'Món từ thịt', cookingTimeMinutes: 35, difficulty: 'Expert', ingredients: ['thịt bò', 'cà chua', 'khoai tây'], status: 1 },
  { id: '22222222-2222-4222-8222-222222222222', title: 'Canh chua cá lóc', categoryName: 'Món canh', cookingTimeMinutes: 25, difficulty: 'Easy', ingredients: ['cá lóc', 'cà chua', 'dứa'], status: 1 },
  { id: '33333333-3333-4333-8333-333333333333', title: 'Cà ri đậu gà', categoryName: 'Món chay', cookingTimeMinutes: 30, difficulty: 'Medium', ingredients: ['đậu gà', 'nước cốt dừa'], status: 1 },
  { id: '44444444-4444-4444-8444-444444444444', title: 'Bản nháp riêng chưa xuất bản', categoryName: 'Món từ thịt', cookingTimeMinutes: 10, difficulty: 'Easy', ingredients: ['thịt bò'], status: 0 },
].map((recipe, index) => ({
  ...recipe,
  description: `Công thức kiểm tra giao diện cho ${recipe.title}.`,
  categoryId: index === 1 ? 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb' : 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  imageUrl: '/music/exs-hate-me-cover.png',
  createdAt: `2026-10-${String(27 - index).padStart(2, '0')}T08:00:00Z`,
  authorId: 'ui-fixture-author',
  instructions: ['Chuẩn bị nguyên liệu.', 'Nấu chín và thưởng thức.'],
  recipeIngredients: [], recipeSteps: [], prepTimeMinutes: 10, cookTimeMinutes: 25, servings: 4,
}))

const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase()

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.route('**/api/v1/**', async route => {
    const url = new URL(route.request().url())
    const path = url.pathname.replace('/api/v1', '')
    let data = []
    if (path === '/categories') data = [
      { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'Món từ thịt', publishedRecipeCount: 2, isVisible: true },
      { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', name: 'Món canh', publishedRecipeCount: 1, isVisible: true },
    ]
    else if (path === '/recipes') data = recipes
    else if (path === '/search/recipes') {
      const query = normalize(url.searchParams.get('q') || '')
      data = recipes.filter(recipe => recipe.status === 1 && normalize(`${recipe.title} ${recipe.ingredients.join(' ')}`).includes(query))
    } else if (/^\/recipes\/[a-f0-9-]{36}$/.test(path)) data = recipes.find(recipe => path.endsWith(recipe.id)) || {}
    else if (path.endsWith('/reviews')) data = { averageRating: 0, count: 0, items: [] }
    else if (path.includes('/related')) data = recipes.filter(recipe => recipe.status === 1)
    return route.fulfill({ json: { data } })
  })
})

test('SFX level, Boost and the cosmic palette persist after reload', async ({ page }) => {
  await page.goto('/')
  const slider = page.getByRole('slider', { name: 'Độ lớn SFX', exact: true })
  await expect(slider).toHaveValue('100')
  await slider.evaluate(node => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(node, '50')
    node.dispatchEvent(new Event('input', { bubbles: true }))
    node.dispatchEvent(new Event('change', { bubbles: true }))
  })
  await expect(slider).toHaveValue('50')
  await page.getByRole('button', { name: 'Boost SFX', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Boost SFX', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('combobox', { name: 'Tông màu vũ trụ', exact: true }).selectOption('purple')
  await expect(page.locator('html')).toHaveAttribute('data-cosmic-palette', 'purple')
  await page.reload()
  await expect(slider).toHaveValue('50')
  await expect(page.getByRole('button', { name: 'Boost SFX', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-cosmic-palette', 'purple')
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)), preferencesKey)).toMatchObject({ sfxVolume: 0.5, boost: true, palette: 'purple' })
})

test('SFX uses an audible master stage with compressor and limiter nodes', async ({ page }) => {
  await page.addInitScript(() => {
    window.__vipGainNodes = []
    window.__vipCompressorCount = 0
    const Context = window.AudioContext || window.webkitAudioContext
    if (!Context) return
    const originalGain = Context.prototype.createGain
    const originalCompressor = Context.prototype.createDynamicsCompressor
    Context.prototype.createGain = function (...args) {
      const node = originalGain.apply(this, args)
      window.__vipGainNodes.push(node)
      return node
    }
    Context.prototype.createDynamicsCompressor = function (...args) {
      window.__vipCompressorCount += 1
      return originalCompressor.apply(this, args)
    }
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Boost SFX', exact: true }).click()
  await expect.poll(() => page.evaluate(() => window.__vipCompressorCount)).toBeGreaterThanOrEqual(2)
  expect(await page.evaluate(() => window.__vipGainNodes.some(node => node.gain.value >= 0.65 && node.gain.value <= 0.85))).toBe(true)
})

test('the neon spider analyses recipe content and can be turned off independently', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  const card = page.locator('.home-recipe-grid article').filter({ hasText: recipes[0].title })
  await expect(card).toBeVisible()
  await expect(page.locator('.cyber-spider-canvas')).toHaveCount(1)
  await card.hover()
  await expect(page.locator('.cyber-spider-hud')).toContainText(recipes[0].title)
  await expect(page.locator('.cyber-spider-hud')).toContainText('35 phút')
  await page.getByRole('switch', { name: 'Nhện AI', exact: true }).click()
  await expect(page.locator('.cyber-spider-canvas')).toHaveCount(0)
  await expect(page.locator('.cosmic-canvas')).toHaveCount(1)
  await page.getByRole('switch', { name: 'Nhện AI', exact: true }).click()
  await expect(page.locator('.cyber-spider-canvas')).toHaveCount(1)
  expect(errors).toEqual([])
})

test('Ctrl+K searches an ingredient and opens the matching recipe', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog', { name: 'Cosmic Command Palette', exact: true })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('combobox', { name: 'Tìm kiếm nhanh', exact: true }).fill('thịt bò')
  const result = dialog.getByRole('option').filter({ hasText: recipes[0].title })
  await expect(result).toBeVisible()
  await expect(dialog.getByRole('option').filter({ hasText: recipes[3].title })).toHaveCount(0)
  await result.click()
  await expect(page).toHaveURL(new RegExp(`/recipes/${recipes[0].id}$`))
  await expect(page.getByRole('heading', { level: 1, name: recipes[0].title, exact: true })).toBeVisible()
})

test('food roulette finishes with a published recipe and a working recipe link', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Hôm nay ăn gì?', exact: true }).click()
  const dialog = page.locator('.cosmic-roulette-dialog')
  await expect(page.locator('.home-page')).toHaveAttribute('data-roulette-scanning', 'true')
  await expect(dialog.locator('.roulette-winner')).toContainText('Đã chọn:', { timeout: 6000 })
  await expect(page.locator('.home-page')).toHaveAttribute('data-roulette-scanning', 'false')
  const chosenTitle = await dialog.locator('.roulette-preview h3').textContent()
  const chosen = recipes.find(recipe => recipe.title === chosenTitle)
  expect(chosen?.status).toBe(1)
  const recipeLink = dialog.getByRole('link', { name: 'Xem công thức', exact: false })
  await expect(recipeLink).toHaveAttribute('href', `/recipes/${chosen.id}`)
  await recipeLink.click()
  await expect(page).toHaveURL(new RegExp(`/recipes/${chosen.id}$`))
})

test('closing roulette during its scan cancels the pending winner and scan state', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  await page.getByRole('button', { name: 'Hôm nay ăn gì?', exact: true }).click()
  await expect(page.locator('.home-page')).toHaveAttribute('data-roulette-scanning', 'true')
  await page.keyboard.press('Escape')
  await expect(page.locator('.cosmic-roulette-dialog')).toHaveCount(0)
  await expect(page.locator('.home-page')).toHaveAttribute('data-roulette-scanning', 'false')
  // Advance beyond the scan duration to catch a stale completion callback.
  await page.clock.runFor(2700)
  await expect(page.locator('.cosmic-roulette-dialog')).toHaveCount(0)
  await expect(page.locator('.home-page')).toHaveAttribute('data-roulette-scanning', 'false')
})

test('the DJ visualizer reads real audio without creating a second media source', async ({ page }) => {
  await page.addInitScript(() => {
    window.__vipMediaSourceCount = 0
    window.__vipAnalysisPeak = 0
    const Context = window.AudioContext || window.webkitAudioContext
    if (!Context) return
    const originalSource = Context.prototype.createMediaElementSource
    const originalAnalyser = Context.prototype.createAnalyser
    Context.prototype.createMediaElementSource = function (...args) {
      window.__vipMediaSourceCount += 1
      return originalSource.apply(this, args)
    }
    Context.prototype.createAnalyser = function (...args) {
      const analyser = originalAnalyser.apply(this, args)
      const read = analyser.getByteFrequencyData.bind(analyser)
      analyser.getByteFrequencyData = function (values) {
        read(values)
        window.__vipAnalysisPeak = Math.max(window.__vipAnalysisPeak, ...values)
      }
      return analyser
    }
  })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('.music-visualizer__bar')).toHaveCount(32)
  await page.evaluate(() => { window.__vipMusicElement = document.querySelector('audio') })
  await page.locator('.home-music-player__play').click()
  await expect(page.locator('.home-music-player')).toHaveAttribute('data-playing', 'true')
  await expect(page.locator('.music-visualizer')).toHaveAttribute('data-signal', 'live')
  await expect.poll(() => page.evaluate(() => window.__vipAnalysisPeak), { timeout: 7000 }).toBeGreaterThan(0)
  await page.locator('.home-music-player__play').click()
  await expect(page.locator('.home-music-player')).toHaveAttribute('data-playing', 'false')
  await page.locator('.home-music-player__play').click()
  await expect(page.locator('.home-music-player')).toHaveAttribute('data-playing', 'true')
  expect(await page.evaluate(() => window.__vipMediaSourceCount)).toBe(1)
  await page.locator('.community-nav').getByRole('link', { name: 'Bảng tin', exact: true }).click()
  expect(await page.evaluate(() => window.__vipMusicElement === document.querySelector('audio'))).toBe(true)
  expect(await page.evaluate(() => window.__vipMediaSourceCount)).toBe(1)
  expect(errors).toEqual([])
})
