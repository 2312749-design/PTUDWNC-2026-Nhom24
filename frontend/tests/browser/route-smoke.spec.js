import { test, expect } from '@playwright/test'

const publicRoutes = [
  '/account', '/admin', '/ai-chat', '/author-profile', '/categories', '/challenges',
  '/community', '/cook-mode', '/cook-together', '/cookbook', '/creator', '/drafts',
  '/editor-picks', '/flexible-recipe', '/fridge', '/home', '/journal', '/login',
  '/members', '/members/chefdemo', '/multilingual', '/notifications', '/planner',
  '/print-export', '/qna', '/recipes', '/recipes/new', '/register', '/safety', '/saved',
  '/seasonal-challenge', '/standard-recipe', '/taste-suggestion'
]

test('all static app routes render without a server or browser error', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))

  for (const route of publicRoutes) {
    const response = await page.goto(route)
    expect(response.status(), route).toBe(200)
    await expect(page.locator('body'), route).not.toContainText('Application error')
  }

  expect(errors).toEqual([])
})
