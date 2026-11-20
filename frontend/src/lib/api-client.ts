import { getVersionedApiBaseUrl, readApiResponse } from '../api/config.js'

export class ApiClientError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
  }
}

type RequestOptions = RequestInit & { token?: string }

function readCookie(name: string) {
  if (typeof document === 'undefined') return ''
  const prefix = `${encodeURIComponent(name)}=`
  const entry = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(prefix))
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : ''
}

function getApiErrorMessage(data: unknown, status: number) {
  if (status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
  if (status === 403) return 'Tài khoản của bạn không có quyền thực hiện thao tác này.'
  if (status === 429) return 'Bạn thao tác quá nhanh. Vui lòng chờ một lát rồi thử lại.'
  if (!data || typeof data !== 'object') return `Không thể hoàn thành yêu cầu (mã ${status}).`
  const response = data as { message?: unknown; detail?: unknown; title?: unknown; errors?: Record<string, unknown> }
  if (typeof response.message === 'string' && response.message.trim()) return response.message
  if (typeof response.detail === 'string' && response.detail.trim()) return response.detail
  if (response.errors && typeof response.errors === 'object') {
    const firstError = Object.values(response.errors).flatMap(value => Array.isArray(value) ? value : [value]).find(value => typeof value === 'string' && value.trim())
    if (typeof firstError === 'string') return firstError
  }
  if (typeof response.title === 'string' && response.title.trim()) return response.title
  return `Không thể hoàn thành yêu cầu (mã ${status}).`
}

/**
 * Shared low-level API caller. Authentication refresh/retry stays in
 * api/session.js, while this module owns request formatting and API errors.
 */
export async function requestJson(path: string, options: RequestOptions = {}) {
  const { token, headers, body, ...requestOptions } = options
  const method = (requestOptions.method || 'GET').toUpperCase()
  const csrfToken = ['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method) ? '' : readCookie('culinary_csrf_token')
  const response = await fetch(`${getVersionedApiBaseUrl()}${path}`, {
    ...requestOptions,
    // The API stores the refresh token in an HttpOnly cookie. Include it on
    // same-site localhost and production requests without exposing it to JS.
    credentials: requestOptions.credentials ?? 'include',
    body,
    headers: {
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...headers,
    },
  })
  const data = await readApiResponse(response)

  if (!response.ok) {
    throw new ApiClientError(
      getApiErrorMessage(data, response.status),
      response.status,
      data?.code,
    )
  }

  return data
}
