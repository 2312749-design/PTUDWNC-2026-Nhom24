'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { requestJson } from './lib/api-client'

function passwordMessage(value) {
  if (value.length < 8) return 'Mật khẩu cần tối thiểu 8 ký tự.'
  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value) || !/[^A-Za-z0-9]/.test(value)) return 'Mật khẩu cần có chữ hoa, chữ thường, số và ký tự đặc biệt.'
  return ''
}

export default function PasswordRecoveryPage({ mode }) {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [developmentToken, setDevelopmentToken] = useState('')
  const [busy, setBusy] = useState(false)
  const token = params.get('token') || developmentToken
  const isReset = mode === 'reset'

  const requestReset = async (event) => {
    event.preventDefault()
    if (!email.trim()) return toast.error('Vui lòng nhập email đăng ký.')
    setBusy(true)
    try {
      const result = await requestJson('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: email.trim() }) })
      toast.success(result.message)
      if (result.developmentResetToken) {
        setDevelopmentToken(result.developmentResetToken)
        toast.info('Chế độ local: bạn có thể tiếp tục đặt lại mật khẩu ngay trên trang này.')
      }
    } catch (error) { toast.error(error.message || 'Không thể gửi yêu cầu đặt lại mật khẩu.') }
    finally { setBusy(false) }
  }

  const resetPassword = async (event) => {
    event.preventDefault()
    if (!token) return toast.error('Thiếu liên kết đặt lại mật khẩu. Vui lòng yêu cầu lại.')
    const error = passwordMessage(password)
    if (error) return toast.error(error)
    if (password !== confirmPassword) return toast.error('Mật khẩu xác nhận không khớp.')
    setBusy(true)
    try {
      const result = await requestJson('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword: password, confirmPassword }) })
      toast.success(result.message)
      router.push('/login')
    } catch (error) { toast.error(error.message || 'Không thể đặt lại mật khẩu.') }
    finally { setBusy(false) }
  }

  return <div className="page-shell"><div className="auth-card">
    <h1>{isReset ? 'Đặt lại mật khẩu' : 'Quên mật khẩu'}</h1>
    {isReset ? <form onSubmit={resetPassword}>
      <p className="auth-copy">Tạo mật khẩu mới cho tài khoản của bạn. Liên kết chỉ có hiệu lực trong 15 phút.</p>
      <div className="form-group"><label htmlFor="new-password">Mật khẩu mới</label><input id="new-password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={event => setPassword(event.target.value)} /><small className="form-hint">Ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</small></div>
      <div className="form-group"><label htmlFor="confirm-new-password">Xác nhận mật khẩu mới</label><input id="confirm-new-password" type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} /></div>
      <button className="primary-btn" type="submit" disabled={busy}>{busy ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}</button>
    </form> : <form onSubmit={requestReset}>
      <p className="auth-copy">Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu có hiệu lực trong 15 phút.</p>
      <div className="form-group"><label htmlFor="reset-email">Email</label><input id="reset-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="ban@email.com" /></div>
      <button className="primary-btn" type="submit" disabled={busy}>{busy ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}</button>
    </form>}
    {!isReset && developmentToken && <p className="auth-local-reset"><Link href={`/reset-password?token=${encodeURIComponent(developmentToken)}`}>Mở trang đặt lại mật khẩu (demo local)</Link></p>}
    <p className="switch-text"><Link href="/login">← Quay lại đăng nhập</Link></p>
  </div></div>
}
