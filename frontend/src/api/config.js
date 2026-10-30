export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5152/api'
}

export function getVersionedApiBaseUrl() {
  return `${getApiBaseUrl().replace(/\/$/, '')}/v1`
}

/**
 * The API owns local uploads, while Next.js uses a separate origin.  API
 * responses use `/uploads/...` paths, so turn them into browser-ready URLs
 * before a page renders an image, video, or avatar.
 */
export function resolveMediaUrl(value) {
  if (typeof value !== 'string' || !value.startsWith('/uploads/')) return value

  try {
    return new URL(value, getApiBaseUrl()).toString()
  } catch {
    return value
  }
}

function normalizeMediaUrls(value) {
  if (Array.isArray(value)) return value.map(normalizeMediaUrls)
  if (!value || typeof value !== 'object') return resolveMediaUrl(value)

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, normalizeMediaUrls(child)]),
  )
}

export function normalizeApiResponse(payload) {
  if (!payload || typeof payload !== 'object') return payload

  const response = payload.detail && !payload.message
    ? { ...payload, message: payload.detail }
    : payload

  if (Object.hasOwn(response, 'data')) {
    if (Object.hasOwn(response, 'meta')) return normalizeMediaUrls({ ...response.meta, items: response.data })
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return normalizeMediaUrls({ ...response.data, ...(response.message ? { message: response.message } : {}) })
    }
    return normalizeMediaUrls(response.data)
  }

  return normalizeMediaUrls(response)
}

export async function readApiResponse(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return normalizeApiResponse(JSON.parse(text))
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(text.replace(/\s+/g, ' ').trim().slice(0, 200) || 'Máy chủ trả về dữ liệu không hợp lệ.')
    }
    throw error
  }
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}
