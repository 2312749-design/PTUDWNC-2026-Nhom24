'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { register } from '../../src/api/auth'
import { saveSession } from '../../src/api/session.js'

function generateCaptcha() {
  const left = Math.floor(Math.random() * 9) + 1
  const right = Math.floor(Math.random() * 9) + 1
  return { question: `${left} + ${right} = ?`, answer: String(left + right) }
}

function getPasswordError(password) {
  if (password.length < 8) return 'Mật khẩu cần tối thiểu 8 ký tự.'
  if (!/[A-Z]/.test(password)) return 'Mật khẩu cần có ít nhất 1 chữ hoa.'
  if (!/[a-z]/.test(password)) return 'Mật khẩu cần có ít nhất 1 chữ thường.'
  if (!/\d/.test(password)) return 'Mật khẩu cần có ít nhất 1 chữ số.'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Mật khẩu cần có ít nhất 1 ký tự đặc biệt, ví dụ: ! hoặc @.'
  return ''
}

export default function RegisterClient() {
  const router = useRouter()
  // The first value must be deterministic because this page is rendered on
  // both the server and browser. Generate the random challenge after hydration.
  const [captcha, setCaptcha] = useState({ question: 'Đang tạo captcha…', answer: '' })
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captchaInput: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const captchaReady = form.captchaInput.trim() === captcha.answer
  const passwordError = form.password ? getPasswordError(form.password) : ''

  useEffect(() => { setCaptcha(generateCaptcha()) }, [])

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setForm((current) => ({ ...current, captchaInput: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.displayName.trim() || !form.username.trim() || !form.email.trim()) {
      toast.error('Vui lòng nhập họ tên, username và email.')
      return
    }

    if (!form.password || !form.confirmPassword) {
      toast.error('Vui lòng nhập mật khẩu và xác nhận mật khẩu.')
      return
    }

    if (passwordError) {
      toast.error(passwordError)
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.')
      return
    }

    if (!captchaReady) {
      toast.error('Captcha chưa đúng, vui lòng kiểm tra lại.')
      return
    }

    setSubmitting(true)
    const result = await register({
      displayName: form.displayName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      captchaQuestion: captcha.question,
      captchaAnswer: form.captchaInput.trim(),
    })
    setSubmitting(false)

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    saveSession(result.data)
    toast.success(result.message || 'Đăng ký thành công!')
    window.setTimeout(() => router.push('/community'), 700)
  }

  return (
    <>
      <div className="page-shell">
        <div className="auth-card">
          <h1>Đăng ký</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-full-name">Họ và tên</label>
              <input
                id="register-full-name"
                type="text"
                autoComplete="name"
                placeholder="Tên hiển thị của bạn"
                value={form.displayName}
                onChange={(event) => setForm({ ...form, displayName: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-username">Username</label>
              <input
                id="register-username"
                type="text"
                autoComplete="username"
                placeholder="Nhập username"
                value={form.username}
                onChange={(event) => setForm({ ...form, username: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="ban@email.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
              <small className={passwordError ? 'form-hint form-hint-error' : 'form-hint'}>Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</small>
            </div>
            <div className="form-group">
              <label htmlFor="register-confirm-password">Xác nhận Password</label>
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-captcha">Captcha</label>
              <div className="captcha-box"><strong>{captcha.question}</strong></div>
              <input
                id="register-captcha"
                type="text"
                inputMode="numeric"
                placeholder="Nhập đáp án"
                value={form.captchaInput}
                onChange={(event) => setForm({ ...form, captchaInput: event.target.value })}
              />
              <button type="button" className="tiny-btn" onClick={refreshCaptcha}>
                Làm mới captcha
              </button>
            </div>
            <button type="submit" className="primary-btn" disabled={!captchaReady || submitting}>
              {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>
          <p className="switch-text">
            Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </>
  )
}
