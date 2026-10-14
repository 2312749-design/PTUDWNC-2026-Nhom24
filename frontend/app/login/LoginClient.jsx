'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { toast, ToastContainer } from 'react-toastify'
import { login } from '../../src/api/auth'
import { getVersionedApiBaseUrl, readApiResponse } from '../../src/api/config.js'

function LoginForm() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [tokenInput, setTokenInput] = useState('')

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
    const result = await login(request)

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    localStorage.setItem('accessToken', result.data.accessToken)
    localStorage.setItem('refreshToken', result.data.refreshToken)
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
      const response = await fetch(`${getVersionedApiBaseUrl()}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      const data = await readApiResponse(response)

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập bằng Google thất bại.')
      }

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken || '')
      toast.success(data.message || 'Đăng nhập Google thành công!')
      router.push('/community')
    } catch (error) {
      toast.error(error.message || 'Đăng nhập bằng Google thất bại.')
    }
  }

  const handleTokenLogin = () => {
    const token = tokenInput.trim()
    const parts = token.split('.')

    if (!token || parts.length !== 3 || !parts.every(Boolean)) {
      toast.error('Token không hợp lệ.')
      return
    }

    localStorage.setItem('accessToken', token)
    toast.success('Đăng nhập bằng mã truy cập thành công.')
    router.push('/community')
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
          <button type="submit" className="primary-btn">Đăng nhập</button>
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

        <div className="token-box">
          <h3>Đăng nhập bằng mã truy cập</h3>
          <input
            type="text"
            placeholder="Dán mã JWT"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
          />
          <button className="primary-btn" type="button" onClick={handleTokenLogin}>
            Xác nhận
          </button>
        </div>

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
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