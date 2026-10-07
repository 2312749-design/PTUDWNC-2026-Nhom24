export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5152/api'
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}
