import { getApiBaseUrl } from '../src/api/config'

export default function sitemap() {
  const baseUrl = getApiBaseUrl()
  const routes = [
    '', '/community', '/recipes', '/categories', '/challenges', '/creator',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
