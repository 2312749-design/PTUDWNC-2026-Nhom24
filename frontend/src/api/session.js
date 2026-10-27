import { getVersionedApiBaseUrl, readApiResponse } from './config.js'
import { requestJson } from '../lib/api-client'
import { useAuthStore } from '../store/auth-store'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_KEY = 'currentUser'
let refreshPromise

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
  const store = storage()
  const legacyRefreshToken = store?.getItem(REFRESH_TOKEN_KEY) || ''
  if (!legacyRefreshToken && !store?.getItem(USER_KEY)) return ''
  if (!refreshPromise) {
    refreshPromise = fetch(`${getVersionedApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      // Supplying the old value once lets sessions from before the upgrade
      // seamlessly move to the cookie transport.
      body: JSON.stringify(legacyRefreshToken ? { refreshToken: legacyRefreshToken } : {}),
    }).then(async response => {
      const data = await readApiResponse(response)
      if (!response.ok || !data.accessToken) throw new Error('Phiên đăng nhập đã hết hạn.')
      saveSession(data)
      return data.accessToken
    }).catch(() => {
      clearSession()
      return ''
    }).finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

export async function getFreshAccessToken() {
  const accessToken = getAccessToken()
  return accessToken || (getSessionUser() || storage()?.getItem(REFRESH_TOKEN_KEY) ? refreshAccessToken() : '')
}

export async function apiRequest(path, options = {}) {
  const send = async () => {
    const accessToken = await getFreshAccessToken()
    return requestJson(path, { ...options, token: accessToken })
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
