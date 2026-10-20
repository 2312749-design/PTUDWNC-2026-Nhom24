'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/Button'

export default function ErrorState({ title = 'Không thể tải nội dung', message, retry }) {
  return <section className="cb-error" role="alert">
    <AlertTriangle size={30} aria-hidden="true" />
    <div><h2>{title}</h2><p>{message || 'Vui lòng kiểm tra kết nối và thử lại.'}</p></div>
    {retry && <Button type="button" variant="secondary" onClick={retry}><RefreshCw size={16} /> Thử lại</Button>}
  </section>
}
