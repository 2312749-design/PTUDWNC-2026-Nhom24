'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { apiRequest, clearSession } from './api/session'
import { CommunityLayout } from './CommunityPages'

function request(path, options) { return apiRequest(path, options) }

export default function SecurityPage() {
  const router = useRouter()
  const [security, setSecurity] = useState(null)
  const [setup, setSetup] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    try { setSecurity(await request('/account/security')) }
    catch (error) {
      toast.error(error.message)
      if (error.status === 401) {
        clearSession()
        router.push('/auth/login')
      }
    }
  }
  useEffect(() => { load() }, [])
  const act = async (path, method, body) => {
    setBusy(true)
    try { const result = await request(path, { method, body: body === undefined ? undefined : JSON.stringify(body) }); await load(); return result }
    catch (error) { toast.error(error.message); return null }
    finally { setBusy(false) }
  }
  const startSetup = async event => { event.preventDefault(); const result = await act('/account/2fa/setup', 'POST', { currentPassword }); if (result) { setSetup(result); setCurrentPassword(''); toast.info('Quét QR bằng ứng dụng Authenticator, rồi nhập mã 6 số để bật.') } }
  const enable = async event => { event.preventDefault(); const result = await act('/account/2fa/enable', 'POST', { code }); if (result) { setSetup(null); setCode(''); toast.success('Đã bật 2FA.') } }
  const validateTwoFactorProof = () => {
    if (!currentPassword) { toast.error('Vui lòng nhập mật khẩu hiện tại.'); return false }
    if (code.trim().length !== 6) { toast.error('Vui lòng nhập đúng mã 2FA gồm 6 chữ số từ ứng dụng Authenticator.'); return false }
    return true
  }
  const disable = async event => {
    event.preventDefault()
    if (!validateTwoFactorProof()) return
    if (!window.confirm('Tắt xác thực hai lớp? Sau khi tắt, tài khoản chỉ còn được bảo vệ bằng mật khẩu.')) return
    const result = await act('/account/2fa/disable', 'POST', { currentPassword, code })
    if (result) { setCurrentPassword(''); setCode(''); toast.success(result.message) }
  }
  const requestEmail = async event => { event.preventDefault(); const result = await act('/account/email-change/request', 'POST', { newEmail: email, currentPassword }); if (result) toast.success(result.message) }
  const confirmEmail = async event => { event.preventDefault(); const result = await act('/account/email-change/confirm', 'POST', { code: emailCode }); if (result) { toast.success(result.message); router.push('/auth/login') } }

  return <CommunityLayout><main className="community-main account-page security-page"><header className="account-heading"><p className="community-kicker">BẢO MẬT TÀI KHOẢN</p><h1>Trung tâm bảo mật</h1><p>Quản lý xác thực hai lớp, phiên đăng nhập, email và các hoạt động gần đây.</p></header>{security && <div className="security-layout">
    <section className="account-section security-card"><div className="account-section-head"><div><span className="section-index">01</span><h2>Xác thực hai lớp</h2></div><b className={security.twoFactorEnabled ? 'security-on' : 'security-off'}>{security.twoFactorEnabled ? 'Đang bật' : 'Chưa bật'}</b></div>
      {!security.twoFactorEnabled && !setup && <form className="account-form" onSubmit={startSetup}><label className="full-field">Xác nhận mật khẩu hiện tại<input type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required /></label><div className="account-form-actions"><button disabled={busy}>Tạo mã QR 2FA</button></div></form>}
      {setup && <form className="two-factor-setup" onSubmit={enable}><img src={setup.qrCodeDataUrl} alt="Mã QR xác thực hai lớp" /><div><p>Quét mã bằng Google Authenticator, Microsoft Authenticator hoặc Authy.</p><code>{setup.manualKey}</code><label>Mã gồm 6 chữ số<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value)} required /></label><button disabled={busy}>Xác nhận và bật 2FA</button></div></form>}
      {security.twoFactorEnabled && <form className="account-form" onSubmit={disable}><p className="full-field security-copy">Để tắt 2FA, nhập mật khẩu hiện tại và mã 6 số đang hiển thị trong ứng dụng Authenticator.</p><label>Mật khẩu hiện tại<input type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required /></label><label>Mã 2FA từ ứng dụng Authenticator<input inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Nhập mã 6 số" required /></label><div className="account-form-actions"><button className="security-danger" disabled={busy}>Tắt 2FA</button></div></form>}
    </section>
    <section className="account-section security-card"><div className="account-section-head"><div><span className="section-index">02</span><h2>Phiên đăng nhập</h2></div></div><p className="security-copy">Lần đăng nhập gần nhất: {security.lastLoginAt ? new Date(security.lastLoginAt).toLocaleString('vi-VN') : 'Chưa có dữ liệu'} · {security.lastLoginIp || '—'}</p><div className="security-list">{security.sessions.map(session => <article key={session.id}><div><strong>{session.isCurrent ? 'Thiết bị hiện tại' : 'Thiết bị đã đăng nhập'}</strong><small>{session.userAgent || 'Không xác định'} · {session.ipAddress || '—'}<br />Hoạt động: {new Date(session.lastUsedAt || session.createdAt).toLocaleString('vi-VN')}</small></div>{!session.isCurrent && <button disabled={busy} onClick={() => act(`/account/sessions/${session.id}`, 'DELETE')}>Đăng xuất</button>}</article>)}</div><button disabled={busy} onClick={() => act('/account/sessions/revoke-others', 'POST')}>Đăng xuất khỏi các thiết bị khác</button></section>
    <section className="account-section security-card"><div className="account-section-head"><div><span className="section-index">03</span><h2>Đổi email có xác nhận</h2></div></div><form className="account-form" onSubmit={requestEmail}><label>Email mới<input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label><label>Mật khẩu hiện tại<input type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required /></label><div className="account-form-actions"><button disabled={busy}>Gửi mã xác nhận</button></div></form><form className="account-form security-confirm" onSubmit={confirmEmail}><label>Mã đã gửi tới email mới<input inputMode="numeric" value={emailCode} onChange={event => setEmailCode(event.target.value)} required /></label><div className="account-form-actions"><button disabled={busy}>Xác nhận đổi email</button></div></form></section>
    <section className="account-section security-card full-security"><div className="account-section-head"><div><span className="section-index">04</span><h2>Hoạt động gần đây</h2></div></div><div className="security-list">{security.activities.length ? security.activities.map(activity => <article key={activity.id}><div><strong>{activity.description}</strong><small>{new Date(activity.createdAt).toLocaleString('vi-VN')} · {activity.ipAddress || '—'}</small></div><code>{activity.activityType}</code></article>) : <p className="security-copy">Chưa có hoạt động nào được ghi nhận.</p>}</div></section>
  </div>}</main></CommunityLayout>
}
