export const serializeJsonLd = data => JSON.stringify(data).replace(/</g, '\\u003c')

export function recipeJsonLd(recipe, siteUrl) {
  const url = `${siteUrl}/recipes/${encodeURIComponent(recipe.slug || recipe.id)}`
  const ingredients = recipe.recipeIngredients?.length
    ? recipe.recipeIngredients.map(i => [i.quantity, i.unit, i.name].filter(Boolean).join(' '))
    : recipe.ingredients || []
  const steps = recipe.recipeSteps?.length ? [...recipe.recipeSteps].sort((a, b) => a.stepNumber - b.stepNumber).map(s => s.description) : recipe.instructions || []
  return {
    '@context': 'https://schema.org', '@type': 'Recipe', name: recipe.title,
    description: recipe.description || undefined, url, mainEntityOfPage: url,
    image: recipe.imageUrl ? [new URL(recipe.imageUrl, siteUrl).href] : undefined,
    recipeCategory: recipe.categoryName || undefined,
    recipeIngredient: ingredients,
    recipeInstructions: steps.filter(Boolean).map(text => ({ '@type': 'HowToStep', text })),
    prepTime: `PT${recipe.prepTimeMinutes || 0}M`, cookTime: `PT${recipe.cookTimeMinutes || 0}M`,
    totalTime: `PT${(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)}M`,
    recipeYield: recipe.servings ? `${recipe.servings} khẩu phần` : undefined,
    nutrition: recipe.nutrition?.calories != null ? { '@type': 'NutritionInformation', calories: `${recipe.nutrition.calories} calories` } : undefined,
  }
}

export function articleJsonLd(article, siteUrl) {
  return {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title,
    description: article.summary, datePublished: article.createdAt,
    image: article.coverImageUrl || undefined,
    author: article.author?.fullName ? { '@type': 'Person', name: article.author.fullName } : undefined,
    mainEntityOfPage: `${siteUrl}/articles/${encodeURIComponent(article.slug)}`,
  }
}
