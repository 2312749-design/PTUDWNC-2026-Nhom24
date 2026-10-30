import { getSiteUrl, getVersionedApiBaseUrl, readApiResponse } from '../src/api/config'

export const dynamic = 'force-dynamic'

export default async function sitemap() {
  const siteUrl = getSiteUrl()
  const apiUrl = process.env.API_INTERNAL_URL || getVersionedApiBaseUrl()
  const routes = [
    '', '/community', '/recipes', '/categories', '/challenges',
  ]

  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    const response = await fetch(`${apiUrl}/recipes/sitemap`, { cache: 'no-store' })
    if (!response.ok) return staticRoutes
    const recipes = await readApiResponse(response)
    return [
      ...staticRoutes,
      ...recipes.map((recipe) => ({
        url: `${siteUrl}/recipes/${encodeURIComponent(recipe.slug)}`,
        lastModified: recipe.updatedAt ? new Date(recipe.updatedAt) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
    ]
  } catch {
    return staticRoutes
  }
}
