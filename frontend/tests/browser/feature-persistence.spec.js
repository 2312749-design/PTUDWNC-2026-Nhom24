import { test, expect } from '@playwright/test'

const user = { id: 'feature-persistence-user', username: 'featuretester', fullName: 'Feature Tester', email: 'features@example.invalid', role: 'User' }
const recipe = 'Mì xào rau củ chay'

test.beforeEach(async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await context.addCookies([{ name: 'culinary_access_token', value: 'feature-test-cookie', domain: 'localhost', path: '/', httpOnly: true, sameSite: 'Lax' }])
  await page.addInitScript(profile => {
    localStorage.setItem('currentUser', JSON.stringify(profile))
    localStorage.setItem('culinary:cosmic-preferences', JSON.stringify({ soundEnabled: false, effectsEnabled: false, spiderEnabled: false }))
  }, user)
})

test('journal loads account entries before saving, retains failed input and persists after reload', async ({ page }) => {
  const existing = { id: 'older-journal', title: 'Nhật ký cũ trên máy chủ', note: 'Ghi chú cũ được giữ', spice: 'Bớt cay', cookedAt: '2026-10-28', duration: 20, result: 'Ngon' }
  let content = { entries: [existing] }
  let writes = 0
  let refreshes = 0
  let releaseLoad
  const loadGate = new Promise(resolve => { releaseLoad = resolve })
  let firstLoad = true
  await page.route('**/api/v1/**', async route => {
    const request = route.request()
    const path = new URL(request.url()).pathname.replace('/api/v1', '')
    if (path === '/auth/refresh') {
      refreshes++
      return route.fulfill({ status: 429, json: { detail: 'Do not rotate an active cookie.' } })
    }
    if (path === '/account/me' || path === '/auth/me') return route.fulfill({ json: { data: user } })
    if (path === '/features/notifications') return route.fulfill({ json: { data: { unreadCount: 0 } } })
    if (path === '/extensions/drafts/recipe-journal' && request.method() === 'GET') {
      if (firstLoad) {
        firstLoad = false
        await loadGate
      }
      return route.fulfill({ json: { data: { key: 'recipe-journal', content } } })
    }
    if (path === '/extensions/drafts/recipe-journal' && request.method() === 'PUT') {
      writes++
      if (writes === 1) return route.fulfill({ status: 503, json: { detail: 'Không lưu được nhật ký kiểm thử.' } })
      content = structuredClone(request.postDataJSON().content)
      return route.fulfill({ json: { data: { key: 'recipe-journal' } } })
    }
    return route.fulfill({ json: { data: [] } })
  })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/journal')
  try {
    await expect(page.getByRole('button', { name: 'Lưu nhật ký', exact: true })).toBeDisabled()
  } finally {
    releaseLoad()
  }
  await expect(page.locator('.journal-list')).toContainText(existing.title)
  await page.getByLabel('Tên món', { exact: true }).fill('Canh rau củ đã nấu hôm nay')
  await page.getByLabel('Ghi chú', { exact: true }).fill('Giữ nguyên 1.5 lít nước, thêm hành.')
  await page.getByLabel('Thay đổi gia vị', { exact: true }).fill('Giảm muối')
  await page.getByLabel('Ngày nấu', { exact: true }).fill('2026-11-03')
  await page.getByLabel('Thời gian (phút)', { exact: true }).fill('25')
  await page.getByLabel('Kết quả', { exact: true }).fill('Cả nhà thích món này.')
  await page.getByRole('button', { name: 'Lưu nhật ký', exact: true }).click()
  await expect(page.getByText('Không lưu được nhật ký kiểm thử.', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Tên món', { exact: true })).toHaveValue('Canh rau củ đã nấu hôm nay')
  await expect(page.locator('.journal-list')).not.toContainText('Canh rau củ đã nấu hôm nay')
  expect(content.entries).toEqual([existing])
  await page.getByRole('button', { name: 'Lưu nhật ký', exact: true }).click()
  await expect(page.locator('.journal-list')).toContainText('Canh rau củ đã nấu hôm nay')
  expect(content.entries).toHaveLength(2)
  expect(content.entries[1]).toEqual(existing)
  await page.reload()
  await expect(page.locator('.journal-list')).toContainText('Canh rau củ đã nấu hôm nay')
  await expect(page.locator('.journal-list')).toContainText(existing.note)
  await expect(page.locator('.journal-list')).toContainText('Giữ nguyên 1.5 lít nước, thêm hành.')
  expect(writes).toBe(2)
  expect(refreshes).toBe(0)
  expect(errors).toEqual([])
})

test('community questions and answers are saved through their APIs and survive document reload', async ({ page }) => {
  const questions = []
  let questionWrites = 0
  let answerWrites = 0
  await page.route('**/api/v1/**', async route => {
    const request = route.request()
    const path = new URL(request.url()).pathname.replace('/api/v1', '')
    if (path === '/account/me' || path === '/auth/me') return route.fulfill({ json: { data: user } })
    if (path === '/features/notifications') return route.fulfill({ json: { data: { unreadCount: 0 } } })
    if (path === '/features/questions' && request.method() === 'GET') return route.fulfill({ json: { data: { items: questions } } })
    if (path === '/features/questions' && request.method() === 'POST') {
      questionWrites++
      const payload = request.postDataJSON()
      const saved = { id: '44444444-4444-4444-8444-444444444444', recipe: payload.recipe, author: user.fullName, username: user.username, text: payload.question, answers: [], answer: '', answeredBy: '', pinned: false }
      questions.unshift(saved)
      return route.fulfill({ json: { data: saved } })
    }
    if (path === '/community/posts/44444444-4444-4444-8444-444444444444/comments' && request.method() === 'POST') {
      answerWrites++
      const saved = { id: '55555555-5555-4555-8555-555555555555', content: request.postDataJSON().content }
      questions[0].answers.push({ id: saved.id, author: user.fullName, text: saved.content })
      return route.fulfill({ json: { data: saved } })
    }
    return route.fulfill({ json: { data: [] } })
  })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/qna')
  await expect(page.getByRole('button', { name: 'Gửi câu hỏi', exact: true })).toBeEnabled()
  await page.getByLabel('Chọn công thức', { exact: true }).selectOption(recipe)
  const question = 'Có thể dùng 1.5 thìa nước tương cho món mì này không?'
  const answer = 'Có, nên nêm từng ít một và thử vị trước khi thêm.'
  await page.getByLabel('Câu hỏi của bạn', { exact: true }).fill(question)
  await page.getByRole('button', { name: 'Gửi câu hỏi', exact: true }).click()
  await expect(page.locator('.qna-list')).toContainText(question)
  await page.reload()
  const card = page.locator('.qna-card').filter({ hasText: question })
  await expect(card).toBeVisible()
  await card.getByLabel(`Trả lời câu hỏi của ${user.fullName}`, { exact: true }).fill(answer)
  await card.getByRole('button', { name: 'Gửi trả lời', exact: true }).click()
  await expect(card.locator('.qna-answer')).toContainText(answer)
  await page.reload()
  await expect(page.locator('.qna-card').filter({ hasText: question }).locator('.qna-answer')).toContainText(answer)
  expect(questionWrites).toBe(1)
  expect(answerWrites).toBe(1)
  expect(questions[0].recipe).toBe(recipe)
  expect(errors).toEqual([])
})
