import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeApiResponse, readApiResponse } from '../src/api/config.js'
import { recipeJsonLd, articleJsonLd, serializeJsonLd } from '../src/structured-data.js'

test('unwraps API pagination without losing total and current page', () => {
  assert.deepEqual(normalizeApiResponse({ data: [{ id: 'a' }], meta: { page: 2, total: 21 } }), { items: [{ id: 'a' }], page: 2, total: 21 })
})
test('surfaces problem details to forms', () => {
  assert.equal(normalizeApiResponse({ status: 400, detail: 'Invalid input' }).message, 'Invalid input')
})
test('handles logout empty response', async () => {
  assert.deepEqual(await readApiResponse(new Response(null, { status: 204 })), {})
})
test('rejects malformed server response', async () => {
  await assert.rejects(readApiResponse(new Response('<html>Error</html>')), /Error/)
})
test('recipe schema uses ordered persisted steps and accurate preparation time', () => {
  const data = recipeJsonLd({ title: 'Soup', slug: 'soup', prepTimeMinutes: 10, cookTimeMinutes: 20, servings: 2,
    recipeIngredients: [{ name: 'Carrot', quantity: '2', unit: 'pcs' }], recipeSteps: [{ stepNumber: 2, description: 'Cook' }, { stepNumber: 1, description: 'Chop' }] }, 'https://example.com')
  assert.equal(data.totalTime, 'PT30M')
  assert.deepEqual(data.recipeIngredient, ['2 pcs Carrot'])
  assert.deepEqual(data.recipeInstructions.map(s => s.text), ['Chop', 'Cook'])
  assert.equal(data.url, 'https://example.com/recipes/soup')
})
test('JSON-LD escapes script termination from user content', () => {
  const title = '</script><script>alert(1)</script>'
  const serialized = serializeJsonLd(articleJsonLd({ title, slug: 'sample' }, 'https://example.com'))
  assert.equal(serialized.includes('<'), false)
  assert.equal(JSON.parse(serialized).headline, title)
})
