const nutritionFields = ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sodium']

export const emptyIngredient = () => ({ name: '', quantity: '', unit: '', notes: '' })
export const emptyStep = () => ({ title: '', description: '', timerMinutes: '', imageUrl: '' })

export function recipeToForm(recipe = {}, categoryId = '') {
  const ingredients = recipe.recipeIngredients?.length
    ? [...recipe.recipeIngredients].sort((a, b) => a.orderIndex - b.orderIndex).map(item => ({
      name: item.name ?? '', quantity: item.quantity ?? '', unit: item.unit ?? '', notes: item.notes ?? '',
    }))
    : (recipe.ingredients ?? []).map(name => ({ ...emptyIngredient(), name }))
  const steps = recipe.recipeSteps?.length
    ? [...recipe.recipeSteps].sort((a, b) => a.stepNumber - b.stepNumber).map(item => ({
      title: item.title ?? '', description: item.description ?? '',
      timerMinutes: item.timerMinutes ?? '', imageUrl: item.imageUrl ?? '',
    }))
    : (recipe.instructions ?? []).map(description => ({ ...emptyStep(), description }))

  return {
    title: recipe.title ?? '', description: recipe.description ?? '', imageUrl: recipe.imageUrl ?? '',
    categoryId: recipe.categoryId ?? categoryId,
    ingredients: ingredients.length ? ingredients : Array.from({ length: 10 }, emptyIngredient),
    steps: steps.length ? steps : Array.from({ length: 5 }, emptyStep),
    prepTimeMinutes: recipe.prepTimeMinutes ?? 1, cookTimeMinutes: recipe.cookTimeMinutes ?? 0,
    servings: recipe.servings ?? 2, difficulty: recipe.difficulty ?? 'Medium',
    isVegetarian: recipe.isVegetarian ?? false,
    nutrition: Object.fromEntries(nutritionFields.map(key => [key, recipe.nutrition?.[key] ?? ''])),
  }
}

function integer(value, min, max, label) {
  const number = Number(value)
  if (value === '' || value == null || !Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${label} phải là số nguyên từ ${min} đến ${max}.`)
  }
  return number
}

export function recipeFormToPayload(form) {
  const title = form.title.trim()
  if (title.length < 3 || title.length > 160) throw new Error('Tiêu đề công thức cần từ 3 đến 160 ký tự.')
  if (!form.categoryId) throw new Error('Vui lòng chọn danh mục cho công thức.')
  if (form.description.length > 2000) throw new Error('Mô tả công thức tối đa 2000 ký tự.')
  if (form.ingredients.length < 10) throw new Error('Mỗi công thức cần ít nhất 10 nguyên liệu.')
  if (form.steps.length < 5) throw new Error('Mỗi công thức cần ít nhất 5 bước làm.')

  const recipeIngredients = form.ingredients.map((item, index) => {
    const name = item.name.trim()
    if (!name || name.length > 200) throw new Error(`Nguyên liệu ${index + 1} cần có tên, tối đa 200 ký tự.`)
    const quantity = String(item.quantity ?? '').trim() || null
    const unit = item.unit.trim() || null
    const notes = item.notes.trim() || null
    if (quantity?.length > 100 || unit?.length > 50 || notes?.length > 500) {
      throw new Error(`Nguyên liệu ${index + 1}: số lượng tối đa 100, đơn vị 50, ghi chú 500 ký tự.`)
    }
    return { name, quantity, unit, notes, orderIndex: index + 1 }
  })
  const recipeSteps = form.steps.map((item, index) => {
    const description = item.description.trim()
    if (!description || description.length > 2000) throw new Error(`Bước ${index + 1} cần có mô tả, tối đa 2000 ký tự.`)
    const stepTitle = item.title.trim() || null
    if (stepTitle?.length > 200) throw new Error(`Tiêu đề bước ${index + 1} tối đa 200 ký tự.`)
    const imageUrl = item.imageUrl.trim() || null
    if (imageUrl) {
      try {
        if (!['http:', 'https:'].includes(new URL(imageUrl).protocol) || imageUrl.length > 2048) throw new Error()
      } catch { throw new Error(`Ảnh bước ${index + 1} cần là đường dẫn HTTP/HTTPS hợp lệ.`) }
    }
    return {
      title: stepTitle, description, imageUrl,
      timerMinutes: item.timerMinutes === '' || item.timerMinutes == null
        ? null : integer(item.timerMinutes, 0, 1440, `Thời gian bước ${index + 1}`),
    }
  })
  const nutrition = Object.fromEntries(nutritionFields.map(key => {
    const value = form.nutrition[key]
    if (value === '' || value == null) return [key, null]
    const number = Number(value)
    if (!Number.isFinite(number) || number < 0) throw new Error('Giá trị dinh dưỡng phải là số không âm.')
    return [key, number]
  }))

  return {
    title, description: form.description.trim(), imageUrl: form.imageUrl || null, categoryId: form.categoryId,
    ingredients: recipeIngredients.map(item => [item.quantity, item.unit, item.name, item.notes].filter(Boolean).join(' ')),
    instructions: recipeSteps.map(item => [item.title, item.description].filter(Boolean).join(': ')),
    recipeIngredients, recipeSteps,
    prepTimeMinutes: integer(form.prepTimeMinutes, 1, 1440, 'Thời gian chuẩn bị'),
    cookTimeMinutes: integer(form.cookTimeMinutes, 0, 1440, 'Thời gian nấu'),
    servings: integer(form.servings, 1, 100, 'Khẩu phần'),
    difficulty: form.difficulty, isVegetarian: form.isVegetarian,
    nutrition: Object.values(nutrition).some(value => value !== null) ? nutrition : null,
  }
}
