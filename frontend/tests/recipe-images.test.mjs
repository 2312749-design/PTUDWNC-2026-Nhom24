import test from 'node:test'
import assert from 'node:assert/strict'
import { validateRecipeImageFile, uploadRecipeImage } from '../src/api/recipe-images.js'

test('recipe upload accepts each supported format up to the exact five MB boundary', () => {
  for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/avif']) {
    const file = { type, size: 5 * 1024 * 1024 }
    assert.equal(validateRecipeImageFile(file), file)
  }
})

test('recipe upload rejects an unsupported, empty or oversized file before any request', async () => {
  for (const file of [null, { type: 'image/gif', size: 12 }, { type: 'image/png', size: 0 }, { type: 'image/jpeg', size: 5 * 1024 * 1024 + 1 }]) {
    assert.throws(() => validateRecipeImageFile(file))
    await assert.rejects(uploadRecipeImage('fe7488ac-5ed5-4374-831f-c539ff599f09', file))
  }
})

test('recipe upload requires a persisted recipe id before sending a valid image', async () => {
  const file = new File(['image bytes'], 'dish.png', { type: 'image/png' })
  await assert.rejects(uploadRecipeImage('', file), /lưu công thức/)
  await assert.rejects(uploadRecipeImage('../community', file), /lưu công thức/)
})
