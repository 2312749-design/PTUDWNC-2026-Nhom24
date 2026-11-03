import type { AuthTokens, LoginRequest, RegisterRequest } from '../types/api'
import { ApiClientError, requestJson } from '../lib/api-client'

type AuthResult =
  | { ok: true; data: AuthTokens; message?: string }
  | { ok: false; message: string }

async function submitAuthRequest(action: 'login' | 'register', request: LoginRequest | RegisterRequest): Promise<AuthResult> {
  try {
    const data = await requestJson(`/auth/${action}`, {
      method: 'POST',
      body: JSON.stringify(request),
    })
    if (!data?.accessToken) return { ok: false, message: 'Máy chủ không trả về thông tin phiên đăng nhập.' }
    return { ok: true, data: data as AuthTokens, message: data.message }
  } catch (error) {
    if (error instanceof ApiClientError) return { ok: false, message: error.message }
    return { ok: false, message: 'Không thể kết nối đến máy chủ.' }
  }
}

export function login(request: LoginRequest): Promise<AuthResult> {
  return submitAuthRequest('login', request)
}

export function register(request: RegisterRequest): Promise<AuthResult> {
  return submitAuthRequest('register', request)
}
