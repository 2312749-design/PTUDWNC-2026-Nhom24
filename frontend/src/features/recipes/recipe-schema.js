import { z } from 'zod'

const nullableTimer = z.preprocess(
  value => value === '' || value == null || Number.isNaN(value) ? null : Number(value),
  z.number().int().min(0).max(1440).nullable(),
)

export const recipeWizardSchema = z.object({
  title: z.string().trim().min(5, 'Tiêu đề cần ít nhất 5 ký tự.').max(160),
  description: z.string().trim().max(2000),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục.'),
  prepTimeMinutes: z.number().int().min(1).max(1440),
  cookTimeMinutes: z.number().int().min(0).max(1440),
  servings: z.number().int().min(1).max(100),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Expert']),
  isVegetarian: z.boolean(),
  ingredients: z.array(z.object({
    name: z.string().trim().min(1, 'Tên nguyên liệu là bắt buộc.').max(200),
    quantity: z.string().max(100),
    unit: z.string().max(50),
    notes: z.string().max(500),
  })).min(1, 'Cần ít nhất 1 nguyên liệu.'),
  steps: z.array(z.object({
    title: z.string().max(200),
    description: z.string().trim().min(1, 'Mô tả bước là bắt buộc.').max(2000),
    timerMinutes: nullableTimer,
  })).min(1, 'Cần ít nhất 1 bước làm.'),
})

export function wizardValuesToPayload(values) {
  const recipeIngredients = values.ingredients.map((item, index) => ({
    name: item.name.trim(), quantity: item.quantity.trim() || null,
    unit: item.unit.trim() || null, notes: item.notes.trim() || null, orderIndex: index + 1,
  }))
  const recipeSteps = values.steps.map(item => ({
    title: item.title.trim() || null,
    description: item.description.trim(),
    timerMinutes: item.timerMinutes,
  }))
  return {
    ...values,
    title: values.title.trim(),
    description: values.description.trim(),
    ingredients: recipeIngredients.map(item => [item.quantity, item.unit, item.name, item.notes].filter(Boolean).join(' ')),
    instructions: recipeSteps.map(item => [item.title, item.description].filter(Boolean).join(': ')),
    recipeIngredients,
    recipeSteps,
  }
}
