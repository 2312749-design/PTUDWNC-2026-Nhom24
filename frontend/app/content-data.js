import { getVersionedApiBaseUrl, readApiResponse } from '../src/api/config'

export async function publicContent(path) {
  try {
    const base = process.env.API_INTERNAL_URL || getVersionedApiBaseUrl()
    const response = await fetch(`${base}${path}`, { cache: 'no-store', signal: AbortSignal.timeout(5000) })
    return response.ok ? await readApiResponse(response) : null
  } catch { return null }
}
