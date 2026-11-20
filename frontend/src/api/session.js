import { getVersionedApiBaseUrl, readApiResponse } from './config.js'
import { ApiClientError, requestJson } from '../lib/api-client'
import { useAuthStore } from '../store/auth-store'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'currentUser'
const REFRESH_FAILURE_KEY = 'authRefreshFailure'
let refreshPromise
let recentRefreshFailure
let recentRefreshFailureAt = 0
const REFRESH_FAILURE_COOLDOWN_MS = 1_000

function csrfToken() {
  if (typeof document === 'undefined') return ''
  const entry = document.cookie.split(';').map(value => value.trim())
    .find(value => value.startsWith('culinary_csrf_token='))
  return entry ? decodeURIComponent(entry.slice('culinary_csrf_token='.length)) : ''
}

function storage() {
  return typeof window === 'undefined' ? null : window.localStorage
}

export function saveSession(tokens) {
  const store = storage()
  if (!store || !tokens?.accessToken) return false
  // Access credentials live only in memory. The durable browser session is
  // the HttpOnly refresh/access cookie set by the API, never localStorage.
  store.removeItem(ACCESS_TOKEN_KEY)
  store.removeItem(REFRESH_TOKEN_KEY)
  if (tokens.user) store.setItem(USER_KEY, JSON.stringify(tokens.user))
  useAuthStore.getState().setSession(tokens)
  window.dispatchEvent(new Event('auth-session-refreshed'))
  return true
}

export function clearSession() {
  const store = storage()
  store?.removeItem(ACCESS_TOKEN_KEY)
  store?.removeItem(REFRESH_TOKEN_KEY)
  store?.removeItem(USER_KEY)
  useAuthStore.getState().clearSession()
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-session-cleared'))
}

export function getSessionUser() {
  try { return JSON.parse(storage()?.getItem(USER_KEY) || 'null') } catch { return null }
}

/** A cookie-backed session survives a route change even when its access token
 * is intentionally absent from localStorage. Use this for UI guards, not as
 * an Authorization header value. */
export function hasSession() {
  return Boolean(getAccessToken() || getSessionUser())
}

export function getAccessToken() {
  const token = useAuthStore.getState().accessToken || ''
  if (!token) return ''
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    if (!payload.exp || payload.exp * 1000 <= Date.now()) return ''
    return token
  } catch {
    return ''
  }
}

export async function refreshAccessToken() {
  const runtime = typeof window !== 'undefined' ? window : globalThis
  // Next.js may place the session module in more than one client bundle. Keep
  // the in-flight request on window as well so header/page bundles cannot each
  // rotate the same cookie independently.
  refreshPromise = runtime.__culinaryRefreshPromise || refreshPromise
  const store = storage()
  const legacyRefreshToken = store?.getItem(REFRESH_TOKEN_KEY) || ''
  if (!legacyRefreshToken && !store?.getItem(USER_KEY)) return ''
  // Several requests can receive 401 at nearly the same time. A refresh that
  // fails very quickly (for example with 429) may finish before a later 401 is
  // handled, so the shared promise alone is not enough to stop a refresh
  // storm. Reuse that transient failure briefly and let a later user action or
  // reload retry normally.
  const persistedFailure = (() => {
    try { return JSON.parse(window.sessionStorage.getItem(REFRESH_FAILURE_KEY) || 'null') } catch { return null }
  })()
  if (!refreshPromise && persistedFailure && Date.now() - persistedFailure.at < REFRESH_FAILURE_COOLDOWN_MS) {
    throw new ApiClientError(persistedFailure.message, persistedFailure.status, persistedFailure.code)
  }
  if (!refreshPromise && recentRefreshFailure && Date.now() - recentRefreshFailureAt < REFRESH_FAILURE_COOLDOWN_MS) {
    throw recentRefreshFailure
  }
  if (!refreshPromise) {
    refreshPromise = fetch(`${getVersionedApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken() ? { 'X-CSRF-Token': csrfToken() } : {}),
      },
      // Supplying the old value once lets sessions from before the upgrade
      // seamlessly move to the cookie transport.
      body: JSON.stringify(legacyRefreshToken ? { refreshToken: legacyRefreshToken } : {}),
    }).then(async response => {
      const data = await readApiResponse(response)
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearSession()
          return ''
        }
        throw new ApiClientError(data.message || 'Chưa thể làm mới phiên. Vui lòng thử lại.', response.status, data.code)
      }
      if (!data.accessToken) throw new ApiClientError('Máy chủ không trả về phiên hợp lệ. Vui lòng thử lại.', 502)
      saveSession(data)
      return data.accessToken
    }).catch(error => {
      // Connectivity, rate limiting and server outages do not revoke the
      // refresh cookie. Keep user metadata so a later retry can recover.
      const failure = error instanceof ApiClientError
        ? error
        : new ApiClientError('Không thể kết nối để làm mới phiên. Vui lòng thử lại.', 0)
      recentRefreshFailure = failure
      recentRefreshFailureAt = Date.now()
      try {
        window.sessionStorage.setItem(REFRESH_FAILURE_KEY, JSON.stringify({
          at: recentRefreshFailureAt,
          message: failure.message,
          status: failure.status,
          code: failure.code,
        }))
      } catch { /* Storage may be unavailable in privacy-restricted browsers. */ }
      throw failure
    }).finally(() => {
      refreshPromise = null
      runtime.__culinaryRefreshPromise = null
    })
    runtime.__culinaryRefreshPromise = refreshPromise
  }
  return refreshPromise
}

/** Legacy explicit-token helper. Prefer apiRequest for cookie-authenticated
 * requests; transient refresh failures reject without clearing the session. */
export async function getFreshAccessToken() {
  const accessToken = getAccessToken()
  return accessToken || (getSessionUser() || storage()?.getItem(REFRESH_TOKEN_KEY) ? refreshAccessToken() : '')
}

export async function apiRequest(path, options = {}) {
  const send = async () => {
    // A valid HttpOnly access cookie already authenticates document reloads.
    // Refresh only after an actual 401, not before every cookie-backed request.
    return requestJson(path, { ...options, token: getAccessToken() })
  }
  try {
    return await send()
  } catch (error) {
    if (error?.status === 401 && (getSessionUser() || storage()?.getItem(REFRESH_TOKEN_KEY))) {
      const refreshed = await refreshAccessToken()
      if (refreshed) return send()
    }
    throw error
  }
}
