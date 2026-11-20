import test from 'node:test'
import assert from 'node:assert/strict'
import { recipeWizardSchema, wizardValuesToPayload } from '../src/features/recipes/recipe-schema.js'

function validRecipe() {
  return {
    title: 'Canh chua cá',
    description: 'Món canh gia đình.',
    categoryId: '11111111-1111-1111-1111-111111111111',
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    servings: 4,
    difficulty: 'Medium',
    isVegetarian: false,
    ingredients: Array.from({ length: 1 }, (_, index) => ({
      name: `Nguyên liệu ${index + 1}`, quantity: '1', unit: 'phần', notes: '',
    })),
    steps: Array.from({ length: 1 }, (_, index) => ({
      title: `Bước ${index + 1}`, description: `Thực hiện bước ${index + 1}`, timerMinutes: null,
    })),
  }
}

test('recipe wizard accepts the full SRS minimum and preserves ordered rows', () => {
  const parsed = recipeWizardSchema.parse(validRecipe())
  const payload = wizardValuesToPayload(parsed)

  assert.equal(payload.recipeIngredients.length, 1)
  assert.equal(payload.recipeIngredients[0].orderIndex, 1)
  assert.equal(payload.recipeSteps.length, 1)
})

test('recipe wizard rejects a short title and incomplete recipe content', () => {
  const value = validRecipe()
  value.title = 'Bún'
  value.ingredients = []
  value.steps = []

  const result = recipeWizardSchema.safeParse(value)

  assert.equal(result.success, false)
  const fields = result.error.issues.map(issue => issue.path[0])
  assert.ok(fields.includes('title'))
  assert.ok(fields.includes('ingredients'))
  assert.ok(fields.includes('steps'))
})
