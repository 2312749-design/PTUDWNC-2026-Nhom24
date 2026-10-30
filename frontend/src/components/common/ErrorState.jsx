'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'
import { Button } from '../ui/Button'

export default function ErrorState({ title = 'Không thể tải nội dung', message, retry }) {
  return <ErrorHud key={`${title}:${message}`} title={title} message={message} retry={retry} />
}

function ErrorHud({ title, message, retry }) {
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setDismissed(true), 5000)
    return () => window.clearTimeout(timer)
  }, [])

  if (dismissed) return null
  return <section className="cb-error cosmic-error-hud" role="alert" aria-live="assertive">
    <AlertTriangle size={30} aria-hidden="true" />
    <div><h2>{title}</h2><p>{message || 'Vui lòng kiểm tra kết nối và thử lại.'}</p></div>
    {retry && <Button type="button" variant="secondary" onClick={retry}><RefreshCw size={16} /> Thử lại</Button>}
    <button type="button" className="cosmic-error-close" aria-label="Đóng thông báo lỗi" onClick={() => setDismissed(true)}><X size={16} /></button>
    <span className="cosmic-error-timer" aria-hidden="true" />
  </section>
}
