import { getVersionedApiBaseUrl, readApiResponse } from '../src/api/config'

export async function publicContent(path, { revalidate = 0 } = {}) {
  try {
    const base = process.env.API_INTERNAL_URL || getVersionedApiBaseUrl()
    const cacheOptions = revalidate > 0
      ? { next: { revalidate } }
      : { cache: 'no-store' }
    const response = await fetch(`${base}${path}`, { ...cacheOptions, signal: AbortSignal.timeout(5000) })
    return response.ok ? await readApiResponse(response) : null
  } catch { return null }
}
