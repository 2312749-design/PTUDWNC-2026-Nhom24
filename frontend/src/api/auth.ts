import type { ApiErrorResponse, ApiResponse, AuthTokens, LoginRequest, RegisterRequest } from '../types/api'
import { getVersionedApiBaseUrl } from './config.js'

type AuthResult =
  | { ok: true; data: AuthTokens; message?: string }
  | { ok: false; message: string }

async function submitAuthRequest(action: 'login' | 'register', request: LoginRequest | RegisterRequest): Promise<AuthResult> {
  let response: Response

  try {
    response = await fetch(`${getVersionedApiBaseUrl()}/auth/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
  } catch {
    return { ok: false, message: 'Không thể kết nối đến máy chủ.' }
  }

  let payload: ApiResponse<AuthTokens> | ApiErrorResponse
  try {
    payload = await response.json() as ApiResponse<AuthTokens> | ApiErrorResponse
  } catch {
    return { ok: false, message: 'Máy chủ trả về dữ liệu không hợp lệ.' }
  }

  if (!response.ok) {
    return {
      ok: false,
      message: payload.message ?? ('detail' in payload ? payload.detail : undefined) ?? 'Đăng nhập thất bại.',
    }
  }

  if (!('data' in payload) || !payload.data) {
    return { ok: false, message: 'Máy chủ không trả về thông tin phiên đăng nhập.' }
  }

  return { ok: true, data: payload.data, message: payload.message }
}

export function login(request: LoginRequest): Promise<AuthResult> {
  return submitAuthRequest('login', request)
}

export function register(request: RegisterRequest): Promise<AuthResult> {
  return submitAuthRequest('register', request)
}