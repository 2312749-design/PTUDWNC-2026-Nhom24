'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { getSessionUser } from './api/session'
import './onboarding.css'

const STEPS = [
  { id: 'profile', title: 'Hoàn thiện hồ sơ', description: 'Thêm tên hiển thị, giới thiệu và ảnh đại diện để mọi người dễ nhận ra bạn.', href: '/account', action: 'Mở hồ sơ' },
  { id: 'security', title: 'Bảo vệ tài khoản', description: 'Đặt mật khẩu mạnh, bật 2FA và lưu mã khôi phục ở nơi an toàn.', href: '/security', action: 'Mở bảo mật' },
  { id: 'recipe', title: 'Tạo công thức đầu tiên', description: 'Thêm nguyên liệu, các bước nấu, ảnh món ăn và chọn đúng danh mục.', href: '/recipes/new', action: 'Tạo công thức' },
  { id: 'review', title: 'Gửi duyệt và xuất bản', description: 'Tác giả gửi công thức để quản trị viên góp ý; sau khi đạt yêu cầu, bạn có thể xuất bản.', href: '/recipes', action: 'Quản lý công thức' },
]

export default function OnboardingPage() {
  const [done, setDone] = useState([])
  const user = getSessionUser()
  const storageKey = `culinary-onboarding:${user?.id || user?.userId || user?.username || 'guest'}`

  useEffect(() => {
    try { setDone(JSON.parse(window.localStorage.getItem(storageKey) || '[]')) } catch { setDone([]) }
  }, [storageKey])

  const completed = useMemo(() => STEPS.filter(step => done.includes(step.id)).length, [done])
  const toggle = (id) => {
    setDone(current => {
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id]
      window.localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  return <div className="onboarding-page">
    <div className="onboarding-crumb"><Link href="/community">Trang chủ</Link><span>/</span><span>Bắt đầu nhanh</span></div>
    <section className="onboarding-hero">
      <p>HƯỚNG DẪN THÀNH VIÊN MỚI</p>
      <h1>Bắt đầu với Bếp Nhà</h1>
      <div className="onboarding-progress" aria-label={`Đã hoàn thành ${completed} trên ${STEPS.length} bước`}><span style={{ width: `${(completed / STEPS.length) * 100}%` }} /></div>
      <strong>{completed}/{STEPS.length} bước đã hoàn thành</strong>
      <p>Đi theo từng bước ngắn để hồ sơ của bạn sẵn sàng chia sẻ những món ăn đầu tiên.</p>
    </section>
    <section className="onboarding-steps" aria-label="Các bước bắt đầu">
      {STEPS.map((step, index) => <article key={step.id} className={done.includes(step.id) ? 'done' : ''}>
        <button type="button" className="onboarding-check" onClick={() => toggle(step.id)} aria-pressed={done.includes(step.id)} aria-label={`Đánh dấu ${step.title} đã hoàn thành`}>{done.includes(step.id) ? '✓' : index + 1}</button>
        <div><h2>{step.title}</h2><p>{step.description}</p><Link href={step.href}>{step.action} <span aria-hidden="true">→</span></Link></div>
      </article>)}
    </section>
  </div>
}
