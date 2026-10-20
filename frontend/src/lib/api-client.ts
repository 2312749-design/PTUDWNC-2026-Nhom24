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

/**
 * Shared low-level API caller. Authentication refresh/retry stays in
 * api/session.js, while this module owns request formatting and API errors.
 */
export async function requestJson(path: string, options: RequestOptions = {}) {
  const { token, headers, body, ...requestOptions } = options
  const response = await fetch(`${getVersionedApiBaseUrl()}${path}`, {
    ...requestOptions,
    body,
    headers: {
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })
  const data = await readApiResponse(response)

  if (!response.ok) {
    throw new ApiClientError(
      data?.message || `Không thể hoàn thành yêu cầu (mã ${response.status}).`,
      response.status,
      data?.code,
    )
  }

  return data
}
