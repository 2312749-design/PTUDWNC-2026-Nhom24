'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import { register } from '../../src/api/auth'

function generateCaptcha() {
  const left = Math.floor(Math.random() * 9) + 1
  const right = Math.floor(Math.random() * 9) + 1
  return { question: `${left} + ${right} = ?`, answer: String(left + right) }
}

export default function RegisterClient() {
  const router = useRouter()
  const [captcha, setCaptcha] = useState({ question: '2 + 3 = ?', answer: '5' })
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captchaInput: '',
  })
  const captchaReady = form.captchaInput.trim() === captcha.answer

  useEffect(() => {
    setCaptcha(generateCaptcha())
  }, [])

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setForm((current) => ({ ...current, captchaInput: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.fullName.trim() || !form.username.trim() || !form.email.trim()) {
      toast.error('Vui lòng nhập họ tên, username và email.')
      return
    }

    if (!form.password || !form.confirmPassword) {
      toast.error('Vui lòng nhập mật khẩu và xác nhận mật khẩu.')
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

    const result = await register({
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      captchaQuestion: captcha.question,
      captchaAnswer: form.captchaInput.trim(),
    })

    if (!result.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message || 'Đăng ký thành công!')
    window.setTimeout(() => router.push('/login'), 1000)
  }

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
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
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
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-confirm-password">Xác nhận Password</label>
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
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
            <button type="submit" className="primary-btn" disabled={!captchaReady}>
              Đăng ký
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