import test from 'node:test'
import assert from 'node:assert/strict'
import { recipeToForm, recipeFormToPayload } from '../src/features/recipes/recipe-form.js'

function savedRecipe() {
  return {
    id: 'recipe-roundtrip', title: 'Canh chua cá lóc', description: 'Công thức gia đình.', categoryId: 'category-soup',
    imageUrl: 'http://localhost:9000/culinary-blog/recipes/cover.png',
    prepTimeMinutes: 15, cookTimeMinutes: 25, servings: 4, difficulty: 'Medium', isVegetarian: false,
    nutrition: { calories: 210.5, protein: 20, carbohydrates: 12, fat: 8, fiber: 0, sodium: 500 },
    recipeIngredients: Array.from({ length: 10 }, (_, i) => ({
      id: `ingredient-${i}`, name: i === 0 ? 'Cá lóc, đã làm sạch' : `Nguyên liệu ${i + 1}`,
      quantity: i === 0 ? '1,5' : '100', unit: 'g', notes: 'Rửa sạch. Để ráo.', orderIndex: i + 1,
    })),
    recipeSteps: Array.from({ length: 5 }, (_, i) => ({
      id: `step-${i}`, title: `Chuẩn bị ${i + 1}`, description: 'Thêm 1.5 lít nước. Đun 5 phút.\nNêm lại cho vừa ăn.',
      timerMinutes: i === 0 ? 0 : 5, imageUrl: 'http://localhost:9000/culinary-blog/steps/step.png', stepNumber: i + 1,
    })),
  }
}

test('editing only a title preserves structured quantities, notes, timers, images and nutrition', () => {
  const recipe = savedRecipe()
  const form = recipeToForm(recipe)
  form.title = 'Canh chua cá lóc miền Tây'
  const payload = recipeFormToPayload(form)
  assert.equal(payload.title, form.title)
  assert.equal(payload.imageUrl, recipe.imageUrl)
  assert.deepEqual(payload.nutrition, recipe.nutrition)
  assert.deepEqual(payload.recipeIngredients, recipe.recipeIngredients.map(({ id, ...item }) => item))
  assert.deepEqual(payload.recipeSteps, recipe.recipeSteps.map(({ id, stepNumber, ...item }) => item))
  assert.equal(payload.instructions.length, 5)
  assert.equal(payload.ingredients.length, 10)
})

test('legacy recipe lines keep punctuation, decimal separators and sentences intact', () => {
  const legacy = savedRecipe()
  delete legacy.recipeIngredients
  delete legacy.recipeSteps
  legacy.ingredients = Array.from({ length: 10 }, () => '1,5 kg cá, làm sạch')
  legacy.instructions = Array.from({ length: 5 }, () => 'Thêm 1.5 lít nước. Đậy nắp.\nĐun nhỏ lửa.')
  const payload = recipeFormToPayload(recipeToForm(legacy))
  assert.deepEqual(payload.ingredients, legacy.ingredients)
  assert.deepEqual(payload.instructions, legacy.instructions)
})

test('ordered structured rows keep their metadata when reordered', () => {
  const recipe = savedRecipe()
  recipe.recipeIngredients.reverse()
  recipe.recipeSteps.reverse()
  const form = recipeToForm(recipe)
  assert.equal(form.ingredients[0].name, 'Cá lóc, đã làm sạch')
  assert.equal(form.steps[0].timerMinutes, 0)
  const moved = form.steps.shift()
  form.steps.push(moved)
  assert.deepEqual(recipeFormToPayload(form).recipeSteps.at(-1), {
    title: moved.title, description: moved.description, timerMinutes: 0, imageUrl: moved.imageUrl,
  })
})

test('incomplete rows and invalid numbers are rejected instead of silently dropping data', () => {
  const form = recipeToForm(savedRecipe())
  form.ingredients[0].name = ''
  assert.throws(() => recipeFormToPayload(form), /Nguyên liệu 1/)
  form.ingredients[0].name = 'Cá lóc'
  form.steps[0].timerMinutes = '1.5'
  assert.throws(() => recipeFormToPayload(form), /Thời gian bước 1/)
  form.steps[0].timerMinutes = 0
  form.steps[0].imageUrl = 'javascript:alert(1)'
  assert.throws(() => recipeFormToPayload(form), /Ảnh bước 1/)
  form.steps[0].imageUrl = ''
  form.ingredients.pop()
  assert.throws(() => recipeFormToPayload(form), /10 nguyên liệu/)
})
