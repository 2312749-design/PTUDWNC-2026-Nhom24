export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5152/api'
}

export function getVersionedApiBaseUrl() {
  return `${getApiBaseUrl().replace(/\/$/, '')}/v1`
}

export function normalizeApiResponse(payload) {
  if (!payload || typeof payload !== 'object') return payload

  if (payload.detail && !payload.message) {
    payload.message = payload.detail
  }

  if (Object.hasOwn(payload, 'data')) {
    if (Object.hasOwn(payload, 'meta')) return { ...payload.meta, items: payload.data }
    if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
      return { ...payload.data, ...(payload.message ? { message: payload.message } : {}) }
    }
    return payload.data
  }

  return payload
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
