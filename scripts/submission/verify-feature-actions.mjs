import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const options = new Map()
for (let index = 2; index < process.argv.length; index += 2) {
  if (!['--api-url', '--output'].includes(process.argv[index]) || !process.argv[index + 1]) {
    throw new Error('Usage: node scripts/submission/verify-feature-actions.mjs [--api-url http://localhost:5152] [--output artifacts/feature-actions]')
  }
  options.set(process.argv[index], process.argv[index + 1])
}
const target = new URL(options.get('--api-url') || 'http://localhost:5152')
if (target.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(target.hostname)
  || !['5152', '15152', '25152'].includes(target.port) || target.pathname !== '/' || target.username || target.password || target.search || target.hash) {
  throw new Error('Only the local Culinary Blog API on port 5152, 15152 or 25152 is allowed. This script creates its own temporary content.')
}
const output = path.resolve(root, options.get('--output') || `artifacts/feature-actions-${Date.now()}`)
if (!output.startsWith(`${path.join(root, 'artifacts')}${path.sep}`)) throw new Error('Reports must stay inside the ignored artifacts directory.')
await mkdir(output, { recursive: true })
const runId = `features${Date.now()}${randomUUID().replaceAll('-', '').slice(0, 5)}`
const username = runId
const password = `Feature!${randomUUID()}A9`
const startedAt = new Date().toISOString()
const checks = []
const cleanup = []
const errors = []
const saved = { recipes: [], posts: [], articles: [], collections: [], mealPlans: [], drafts: [] }
let accessToken = ''
let accountId
let requests = 0
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
const unwrap = value => value && typeof value === 'object' && Object.hasOwn(value, 'data') ? value.data : value
const list = value => Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : []
const sanitize = value => String(value).replaceAll(password, '[redacted]').replaceAll(accessToken || '__no_token__', '[redacted]')

async function request(method, route, body, expected = [200], authenticated = true) {
  const headers = { Accept: 'application/json', 'X-Correlation-ID': runId }
  if (authenticated && accessToken) headers.Authorization = `Bearer ${accessToken}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  let response
  for (let attempt = 0; attempt < 3; attempt++) {
    requests++
    response = await fetch(`${target.origin}${route}`, { method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(30_000) })
    if (response.status !== 429 || !route.startsWith('/api/v1/auth/') || attempt === 2) break
    const retry = response.headers.get('retry-after')
    const seconds = /^\d+$/.test(retry || '') ? Number(retry) : Math.ceil((Date.parse(retry || '') - Date.now()) / 1000)
    await response.arrayBuffer()
    await wait(Math.max(1, Math.min(75, Number.isFinite(seconds) ? seconds : 61)) * 1000)
  }
  const raw = await response.text()
  let value
  try { value = raw ? JSON.parse(raw) : {} } catch { value = {} }
  assert.ok(expected.includes(response.status), `${method} ${route}: expected ${expected.join('/')}, received ${response.status}${typeof value.detail === 'string' ? ` (${value.detail})` : ''}`)
  return unwrap(value)
}

async function check(name, action) {
  try {
    await action()
    checks.push({ name, passed: true })
    process.stdout.write(`PASS ${name}\n`)
  } catch (error) {
    const detail = sanitize(error.message)
    checks.push({ name, passed: false, detail })
    process.stdout.write(`FAIL ${name}: ${detail}\n`)
    throw error
  }
}

async function section(name, action) {
  try { await action() } catch (error) { errors.push({ section: name, detail: sanitize(error.message) }) }
}

async function removeOwn(name, method, route, body, expected = [200, 204, 404]) {
  try {
    await request(method, route, body, expected)
    cleanup.push({ name, passed: true })
  } catch (error) { cleanup.push({ name, passed: false, detail: sanitize(error.message) }) }
}

let recipeId
try {
  await check('API responds before creating any test content', async () => {
    const health = await request('GET', '/health', undefined, [200], false)
    assert.equal(health.status, 'Healthy')
  })
  await check('Register one unique isolated feature-test account', async () => {
    const registration = await request('POST', '/api/v1/auth/register', {
      displayName: `Feature check ${runId}`, username, email: `${username}@example.invalid`, password, confirmPassword: password, captchaQuestion: '8 + 5', captchaAnswer: '13',
    }, [200, 201], false)
    accessToken = registration.accessToken
    accountId = registration.user?.id
    assert.ok(accessToken && accountId, 'Registration did not return the new account session')
  })
  const categories = list(await request('GET', '/api/v1/categories'))
  assert.ok(categories[0]?.id, 'A visible category is needed for the isolated recipe')
  const recipeBody = {
    title: `Món kiểm thử tính năng ${runId}`, description: 'Công thức tự động tạo để kiểm thử. Bản ghi này được xóa mềm khi kết thúc lượt kiểm tra.',
    categoryId: categories[0].id, prepTimeMinutes: 5, cookTimeMinutes: 15, servings: 2, difficulty: 'Easy', isVegetarian: true,
    ingredients: Array.from({ length: 10 }, (_, index) => `Nguyên liệu kiểm thử ${index + 1}`),
    instructions: Array.from({ length: 5 }, (_, index) => `Bước kiểm thử ${index + 1}. Giữ nguyên nội dung câu thứ hai.`),
  }
  await check('Create a separate recipe with ten ingredients and five steps', async () => {
    const created = await request('POST', '/api/v1/recipes', recipeBody, [200, 201])
    recipeId = created.id
    assert.ok(recipeId)
    saved.recipes.push(recipeId)
  })
  await check('Publish only the recipe created by this run', async () => { await request('POST', `/api/v1/recipes/${recipeId}/publish`, {}) })

  await section('community', async () => {
    let postId
    const tag = `feature${runId.slice(-10)}`
    await check('Create an own community draft', async () => {
      const post = await request('POST', '/api/v1/community/posts', { content: `Kiểm thử bài nháp ${runId}`, isDraft: true }, [201])
      postId = post.id
      assert.ok(postId)
      saved.posts.push(postId)
    })
    await check('Own community draft persists in draft listing', async () => {
      assert.ok(list(await request('GET', '/api/v1/community/drafts')).some(item => item.id === postId))
    })
    await check('An unpublished post stays out of the public feed', async () => {
      assert.ok(!list(await request('GET', `/api/v1/community/feed?username=${username}`, undefined, [200], false)).some(item => item.id === postId))
    })
    await check('Publish and update only the own community post', async () => {
      await request('PUT', `/api/v1/community/posts/${postId}`, { content: `Kiểm thử đã cập nhật #${tag} ${runId}`, isDraft: false, commentsEnabled: true })
    })
    await check('Updated community content appears in the public feed', async () => {
      const post = list(await request('GET', `/api/v1/community/feed?username=${username}`, undefined, [200], false)).find(item => item.id === postId)
      assert.ok(post?.content.includes('đã cập nhật'))
    })
    await check('Like an own test post', async () => { assert.equal((await request('POST', `/api/v1/community/posts/${postId}/like`, {})).liked, true) })
    await check('Unlike the same test post', async () => { assert.equal((await request('POST', `/api/v1/community/posts/${postId}/like`, {})).liked, false) })
    let commentId
    await check('Add a comment to the own test post', async () => {
      commentId = (await request('POST', `/api/v1/community/posts/${postId}/comments`, { content: `Bình luận kiểm thử ${runId}` })).id
      assert.ok(commentId)
    })
    await check('Reply to an own test comment', async () => {
      assert.ok((await request('POST', `/api/v1/community/posts/${postId}/comments`, { content: `Trả lời kiểm thử ${runId}`, parentCommentId: commentId })).id)
    })
    await check('Comments and reply linkage persist on a fresh feed request', async () => {
      const post = list(await request('GET', `/api/v1/community/feed?username=${username}`)).find(item => item.id === postId)
      assert.ok(post.comments.some(item => item.id === commentId))
      assert.ok(post.comments.some(item => item.parentCommentId === commentId))
    })
    await check('Owner can turn comments off', async () => { await request('PUT', `/api/v1/community/posts/${postId}/comments-enabled`, { enabled: false }) })
    await check('Posting a comment while comments are disabled is rejected', async () => { await request('POST', `/api/v1/community/posts/${postId}/comments`, { content: 'Bình luận không được lưu' }, [400]) })
    await check('Owner can turn comments back on', async () => { await request('PUT', `/api/v1/community/posts/${postId}/comments-enabled`, { enabled: true }) })
    await check('Set a community reaction', async () => { assert.equal((await request('PUT', `/api/v1/extensions/posts/${postId}/reaction`, { type: 'helpful' })).mine, 'helpful') })
    await check('Reaction persists in its read endpoint', async () => { assert.equal((await request('GET', `/api/v1/extensions/posts/${postId}/reactions`)).mine, 'helpful') })
    await check('Remove the own test reaction', async () => { assert.equal((await request('PUT', `/api/v1/extensions/posts/${postId}/reaction`, { type: '' })).mine, null) })
    await check('Hashtag discovery finds the own post', async () => { assert.ok(list(await request('GET', `/api/v1/extensions/hashtags/${tag}`)).some(item => item.id === postId)) })
    await check('Own public profile includes the published test post', async () => {
      const profile = await request('GET', `/api/v1/community/profiles/${username}`)
      assert.equal(profile.isOwnProfile, true)
      assert.ok(profile.posts.some(item => item.id === postId))
    })
    await check('Member directory can find the newly created test account', async () => { assert.ok(list(await request('GET', `/api/v1/community/users?q=${username}`)).some(item => item.username === username || item.userName === username)) })
    await check('Delete own community post including its comments and reactions', async () => { await request('DELETE', `/api/v1/community/posts/${postId}`, undefined, [204]); saved.posts = saved.posts.filter(id => id !== postId) })
    await check('Deleted post is absent from a new feed request', async () => { assert.ok(!list(await request('GET', `/api/v1/community/feed?username=${username}`)).some(item => item.id === postId)) })
  })

  await section('articles', async () => {
    let article
    const body = { title: `Chuyện bếp kiểm thử ${runId}`, summary: `Tóm tắt bài viết kiểm thử độc lập ${runId}.`, content: `Nội dung bài viết kiểm thử riêng ${runId}. `.repeat(5) }
    await check('Create an own kitchen-story article', async () => { article = await request('POST', '/api/v1/articles', body, [201]); assert.ok(article.id && article.slug); saved.articles.push(article.id) })
    await check('Read the own kitchen story through its slug', async () => { assert.equal((await request('GET', `/api/v1/articles/${article.slug}`)).id, article.id) })
    await check('Update only the own kitchen story', async () => { await request('PUT', `/api/v1/articles/${article.id}`, { ...body, summary: `Tóm tắt đã cập nhật và lưu ${runId}.` }, [204]) })
    await check('Article update persists on a new request', async () => { assert.ok((await request('GET', `/api/v1/articles/${article.slug}`)).summary.includes('đã cập nhật')) })
    await check('Delete only the own kitchen story', async () => { await request('DELETE', `/api/v1/articles/${article.id}`, undefined, [204]); saved.articles = saved.articles.filter(id => id !== article.id) })
    await check('Deleted kitchen story returns not found', async () => { await request('GET', `/api/v1/articles/${article.slug}`, undefined, [404]) })
  })

  await section('cookbook', async () => {
    let collectionId
    await check('Save the own test recipe as a bookmark', async () => { assert.equal((await request('POST', `/api/v1/features/recipes/${recipeId}/bookmark`, {})).saved, true) })
    await check('Bookmark persists in the cookbook listing', async () => { assert.ok(list(await request('GET', '/api/v1/features/bookmarks')).some(item => item.recipe.id === recipeId)) })
    await check('Create an own recipe collection', async () => { collectionId = (await request('POST', '/api/v1/features/collections', { name: `Bộ sưu tập ${runId}` })).id; assert.ok(collectionId); saved.collections.push(collectionId) })
    await check('Add only the own test recipe to the own collection', async () => { await request('POST', `/api/v1/features/collections/${collectionId}/recipes/${recipeId}`, {}) })
    await check('Collection membership and count persist', async () => {
      const collection = list(await request('GET', '/api/v1/features/collections')).find(item => item.id === collectionId)
      assert.equal(collection.count, 1)
      assert.equal(collection.recipes[0].id, recipeId)
    })
    await check('Remove the own test recipe from the collection', async () => { await request('DELETE', `/api/v1/features/collections/${collectionId}/recipes/${recipeId}`, undefined, [204]) })
    await check('Delete the own collection', async () => { await request('DELETE', `/api/v1/features/collections/${collectionId}`, undefined, [204]); saved.collections = saved.collections.filter(id => id !== collectionId) })
    await check('Remove the own bookmark', async () => { await request('DELETE', `/api/v1/features/recipes/${recipeId}/bookmark`, undefined, [204]) })
    await check('Removed bookmark is absent from the cookbook', async () => { assert.ok(!list(await request('GET', '/api/v1/features/bookmarks')).some(item => item.recipe.id === recipeId)) })
  })

  await section('planner-shopping', async () => {
    let mealId
    const week = '2030-01-07'
    await check('Add the own recipe to the own weekly meal plan', async () => { mealId = (await request('POST', '/api/v1/features/meal-plan', { recipeId, plannedFor: week, mealType: 'Bữa tối kiểm thử', servings: 4 })).id; assert.ok(mealId); saved.mealPlans.push(mealId) })
    await check('Saved meal and servings persist in the selected week', async () => {
      const plan = await request('GET', `/api/v1/features/meal-plan?weekStart=${week}`)
      assert.ok(plan.entries.some(item => item.id === mealId && item.servings === 4))
    })
    let ingredient
    await check('Shopping list is generated from the own meal plan', async () => {
      const shopping = await request('GET', `/api/v1/features/meal-plan/shopping-list?weekStart=${week}`)
      assert.equal(list(shopping).length, 10)
      ingredient = shopping.items[0].ingredient
    })
    await check('Check one own shopping-list ingredient', async () => { assert.equal((await request('PUT', '/api/v1/features/meal-plan/shopping-list', { weekStart: week, ingredient, isChecked: true })).isChecked, true) })
    await check('Shopping check persists on a fresh request', async () => { assert.ok(list(await request('GET', `/api/v1/features/meal-plan/shopping-list?weekStart=${week}`)).some(item => item.ingredient === ingredient && item.isChecked)) })
    await check('Uncheck the own shopping ingredient', async () => { await request('PUT', '/api/v1/features/meal-plan/shopping-list', { weekStart: week, ingredient, isChecked: false }) })
    await check('Delete the own planned meal', async () => { await request('DELETE', `/api/v1/features/meal-plan/${mealId}`, undefined, [204]); saved.mealPlans = saved.mealPlans.filter(id => id !== mealId) })
    await check('Shopping list becomes empty after removing its only meal', async () => { assert.equal(list(await request('GET', `/api/v1/features/meal-plan/shopping-list?weekStart=${week}`)).length, 0) })
  })

  await section('preferences-workspace', async () => {
    const key = `feature-check-${runId}`
    await check('Read account security without enabling or disabling security features', async () => { assert.ok(await request('GET', '/api/v1/account/security')) })
    await check('Save own preferences and saved-search configuration', async () => { await request('PUT', '/api/v1/pro/preferences', { settings: { theme: 'cyan', highContrast: true, savedFilters: [{ name: runId, maxMinutes: 30, vegetarian: true }] } }) })
    await check('Own preferences survive a new request', async () => { const settings = (await request('GET', '/api/v1/pro/preferences')).settings; assert.equal(settings.highContrast, true); assert.equal(settings.savedFilters[0].name, runId) })
    await check('Save an own studio draft', async () => { await request('PUT', `/api/v1/extensions/drafts/${key}`, { content: { title: runId, ingredients: ['Đậu phụ'], notes: 'Bản nháp kiểm thử riêng' } }); saved.drafts.push(key) })
    await check('Studio draft content persists', async () => { assert.equal((await request('GET', `/api/v1/extensions/drafts/${key}`)).content.title, runId) })
    await check('Delete the own studio draft', async () => { await request('DELETE', `/api/v1/extensions/drafts/${key}`, undefined, [204]); saved.drafts = saved.drafts.filter(item => item !== key) })
    await check('Deleted studio draft no longer has saved content', async () => { const draft = await request('GET', `/api/v1/extensions/drafts/${key}`); assert.ok(!draft.content?.title) })
    await check('Read own notifications and mark only own notifications read', async () => { assert.ok(Array.isArray((await request('GET', '/api/v1/features/notifications')).items)); await request('PUT', '/api/v1/features/notifications/read-all', {}, [204]) })
    await check('Read own creator statistics', async () => { assert.ok((await request('GET', '/api/v1/features/creator/stats')).recipeCount >= 1) })
    await check('Read own cooking and community profile insights', async () => { assert.ok((await request('GET', '/api/v1/pro/profile-insights')).recipeCount >= 1) })
    await check('Record a view of only the own test recipe', async () => { await request('POST', `/api/v1/recipes/${recipeId}/view`, {}) })
    await check('Own recipe view appears in the personal history', async () => { assert.ok(list(await request('GET', '/api/v1/pro/history')).some(item => item.recipeId === recipeId)) })
    await check('Reset only the isolated test account preferences', async () => { await request('PUT', '/api/v1/pro/preferences', { settings: {} }) })
  })

  await section('discovery-readonly', async () => {
    await check('Read category tree without changing category relationships', async () => { assert.ok(list(await request('GET', '/api/v1/extensions/categories/tree')).length > 0) })
    await check('Read cooking-event listing without registering for existing events', async () => { assert.ok(Array.isArray((await request('GET', '/api/v1/extensions/events')).items)) })
    await check('Read leaderboard without changing existing members', async () => { assert.ok(Array.isArray((await request('GET', '/api/v1/extensions/leaderboard')).items)) })
    await check('Read discovery suggestions', async () => { assert.ok(Array.isArray((await request('GET', '/api/v1/pro/suggestions?q=canh')).items)) })
    await check('Read recipes related to the own test recipe', async () => { assert.ok(Array.isArray((await request('GET', `/api/v1/pro/recipes/${recipeId}/related`)).items)) })
    await check('Read allergen inference for the own recipe', async () => { assert.ok(Array.isArray((await request('GET', `/api/v1/pro/recipes/${recipeId}/allergens`)).allergens)) })
  })
} catch (error) {
  errors.push({ section: 'setup', detail: sanitize(error.message) })
} finally {
  for (const id of saved.posts) await removeOwn('Delete own post', 'DELETE', `/api/v1/community/posts/${id}`)
  for (const id of saved.articles) await removeOwn('Delete own article', 'DELETE', `/api/v1/articles/${id}`)
  for (const id of saved.collections) await removeOwn('Delete own collection', 'DELETE', `/api/v1/features/collections/${id}`)
  for (const id of saved.mealPlans) await removeOwn('Delete own meal-plan entry', 'DELETE', `/api/v1/features/meal-plan/${id}`)
  for (const key of saved.drafts) await removeOwn('Delete own workspace draft', 'DELETE', `/api/v1/extensions/drafts/${key}`)
  for (const id of saved.recipes) {
    await removeOwn('Remove own bookmark', 'DELETE', `/api/v1/features/recipes/${id}/bookmark`)
    await removeOwn('Soft-delete own test recipe', 'DELETE', `/api/v1/recipes/${id}`)
  }
  if (accountId && accessToken) {
    await removeOwn('Reset own test preferences', 'PUT', '/api/v1/pro/preferences', { settings: {} })
    await removeOwn('Log out own feature-test account', 'POST', '/api/v1/auth/logout', {})
  }
  const report = {
    startedAt, finishedAt: new Date().toISOString(), apiOrigin: target.origin, runId,
    status: errors.length === 0 && cleanup.every(item => item.passed) ? 'passed' : 'failed',
    passed: checks.filter(item => item.passed).length, failed: checks.filter(item => !item.passed).length, requestCount: requests,
    checks, errors, cleanup,
    retainedTestRecords: { accountId: accountId || null, note: 'There is no account-delete endpoint. Only this unique test account, its private audit/history rows and soft-deleted test recipe may remain; existing users/content are never edited.' },
    coverageLimits: [
      'This script verifies actual HTTP feature actions; it does not certify every visual interaction or all endpoints.',
      'Journal, Q&A, fridge and portions include client-side state/demo behavior and need separate browser persistence checks.',
      'No external Google, SMTP, AI calls, existing-user changes, admin/global changes, challenge entries or existing-event registration are performed.',
      'Security endpoints are read-only; TOTP enrollment/password/email changes are outside this script.',
    ],
  }
  await writeFile(path.join(output, 'result.json'), JSON.stringify(report, null, 2), 'utf8')
  process.stdout.write(`FEATURE_ACTIONS_RESULT ${report.status}: ${report.passed} passed, ${report.failed} failed; report ${path.relative(root, path.join(output, 'result.json'))}\n`)
  if (report.status !== 'passed') process.exitCode = 1
}
