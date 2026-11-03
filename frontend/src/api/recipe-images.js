const MAX_RECIPE_IMAGE_SIZE = 5 * 1024 * 1024
const RECIPE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])

export function validateRecipeImageFile(file) {
  if (!file || !RECIPE_IMAGE_TYPES.has(file.type)) {
    throw new Error('Chỉ hỗ trợ ảnh JPEG, PNG, WebP hoặc AVIF.')
  }
  if (!Number.isFinite(file.size) || file.size <= 0) {
    throw new Error('Ảnh đã chọn trống hoặc không đọc được. Vui lòng chọn lại ảnh.')
  }
  if (file.size > MAX_RECIPE_IMAGE_SIZE) {
    throw new Error('Ảnh món ăn tối đa 5 MB.')
  }
  return file
}

export async function uploadRecipeImage(recipeId, file) {
  validateRecipeImageFile(file)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recipeId || '')) {
    throw new Error('Cần lưu công thức trước khi tải ảnh.')
  }
  const body = new FormData()
  body.append('file', file)
  const { apiRequest } = await import('./session.js')
  return apiRequest(`/recipes/${recipeId}/images`, { method: 'POST', body })
}
