'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { login } from '../../src/api/auth'
import { requestJson } from '../../src/lib/api-client'
import { saveSession } from '../../src/api/session.js'

function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.username.trim() || !form.password.trim()) {
      toast.error('Vui lòng nhập tên đăng nhập và mật khẩu.')
      return
    }

    const request = {
      password: form.password,
      ...(form.username.includes('@')
        ? { email: form.username.trim() }
        : { username: form.username.trim() }),
    }
    setSubmitting(true)
    const result = await login(request)
    setSubmitting(false)

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    saveSession(result.data)
    toast.success(result.message || 'Đăng nhập thành công!')
    router.push('/community')
  }

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse?.credential
    if (!idToken) {
      toast.error('Google không trả về ID token hợp lệ.')
      return
    }

    try {
      const data = await requestJson('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      })

      if (!data.refreshToken || !saveSession(data)) throw new Error('Máy chủ không trả về phiên đăng nhập hợp lệ.')
      toast.success(data.message || 'Đăng nhập Google thành công!')
      router.push('/community')
    } catch (error) {
      toast.error(error.message || 'Đăng nhập bằng Google thất bại.')
    }
  }

  return (
    <div className="page-shell">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-username">Tên đăng nhập</label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </div>
          <button type="submit" className="primary-btn" disabled={submitting}>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        </form>

        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error('Đăng nhập Google thất bại.')}
          />
        ) : (
          <button className="secondary-btn" type="button" disabled>
            Google OAuth chưa được cấu hình
          </button>
        )}

        <p className="switch-text">
          Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginClient() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  return (
    <>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <LoginForm />
        </GoogleOAuthProvider>
      ) : (
        <LoginForm />
      )}
    </>
  )
}
