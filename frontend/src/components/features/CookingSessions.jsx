'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { apiRequest, hasSession } from '../../api/session.js'
import { useAuthStore } from '../../store/auth-store'
import { Link } from '../../navigation.jsx'

const examples = [
  { id: 'example-1', title: 'Nấu mì xào kiểu nhà', host: 'Hà', time: '2026-09-30T19:00', duration: 45, slots: 6, joined: 4 },
  { id: 'example-2', title: 'Chảo nóng món chay', host: 'Bé', time: '2026-10-01T18:30', duration: 60, slots: 8, joined: 5 },
]
const empty = () => ({ title: '', time: '', duration: 45, slots: 6 })

export default function CookingSessions({ Shell }) {
  const hydrated = useAuthStore(state => state.hydrated)
  const userId = useAuthStore(state => state.user?.id)
  const [sessions, setSessions] = useState([])
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef(false)
  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try { setSessions((await apiRequest('/features/cooking-sessions')).items || []) }
    catch (failure) { setError(failure.message) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => {
    if (!hydrated) return
    let active = true
    const sync = async () => {
      try {
        const data = await apiRequest('/features/cooking-sessions')
        if (active) { setSessions(data.items || []); setError('') }
      } catch (failure) { if (active) setError(failure.message) }
      finally { if (active) setLoading(false) }
    }
    sync()
    return () => { active = false }
  }, [hydrated, userId])

  const act = async (path, options, message) => {
    if (pending.current) return false
    if (!hasSession()) { toast.error('Vui lòng đăng nhập để tham gia hoặc tạo buổi nấu.'); return false }
    pending.current = true
    setBusy(true)
    let saved = false
    try {
      await apiRequest(path, options)
      saved = true
      await load()
      toast.success(message)
    } catch (failure) { toast.error(failure.message) }
    finally { pending.current = false; setBusy(false) }
    return saved
  }
  const create = async event => {
    event.preventDefault()
    const startsAt = new Date(form.time)
    if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) { toast.error('Chọn thời gian bắt đầu trong tương lai.'); return }
    const saved = await act('/features/cooking-sessions', {
      method: 'POST', body: JSON.stringify({ title: form.title.trim(), description: 'Buổi nấu chung của cộng đồng Bếp Nhà.', startsAt: startsAt.toISOString(), durationMinutes: Number(form.duration), capacity: Number(form.slots) }),
    }, 'Buổi nấu chung đã được tạo.')
    if (saved) setForm(empty())
  }

  return <Shell eyebrow="NẤU CÙNG NHAU TRỰC TUYẾN" title="Tạo buổi nấu chung" intro="Mời bạn bè cùng nấu, theo dõi tiến độ và trò chuyện trong một buổi nấu diễn ra theo lịch.">
    {loading ? <p role="status">Đang tải buổi nấu...</p> : error && <p role="alert">{error} <button type="button" onClick={load}>Thử lại</button></p>}
    <div className="feature-columns cook-together-columns">
      <section className="feature-section"><div className="feature-section-heading"><h2>Thiết lập buổi mới</h2></div>
        <form className="cook-together-form" onSubmit={create}>
          <fieldset disabled={!hydrated || busy || loading || Boolean(error)} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, display: 'grid', gap: 12 }}>
            <label>Tên buổi nấu<input required minLength={3} maxLength={160} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Ví dụ: Nấu bún chả cuối tuần" /></label>
            <label>Thời gian bắt đầu<input type="datetime-local" required value={form.time} onChange={event => setForm({ ...form, time: event.target.value })} /></label>
            <div className="cook-together-row">
              <label>Thời lượng (phút)<input type="number" required min={15} max={1440} value={form.duration} onChange={event => setForm({ ...form, duration: event.target.value })} /></label>
              <label>Sức chứa<input type="number" required min={2} max={100} value={form.slots} onChange={event => setForm({ ...form, slots: event.target.value })} /></label>
            </div>
            <button type="submit" className="feature-button primary">{busy ? 'Đang xử lý...' : 'Tạo buổi nấu'}</button>
          </fieldset>
          {hydrated && !userId && <Link to="/login">Đăng nhập để tạo buổi nấu hoặc tham gia.</Link>}
        </form>
      </section>
      <section className="feature-section"><div className="feature-section-heading"><h2>Buổi đang diễn ra</h2></div>
        <div className="cook-together-list">{sessions.map(session => {
          const closed = new Date(session.endsAt) <= new Date()
          return <article key={session.id} className="cook-together-card">
            <div className="cook-together-header"><strong>{session.title}</strong><span>{session.joined}/{session.capacity ?? '∞'} người</span></div>
            <p>Chủ trì: {session.host}</p><p>{new Date(session.startsAt).toLocaleString('vi-VN')}</p>
            <div className="cook-together-footer"><small>{Math.round((new Date(session.endsAt) - new Date(session.startsAt)) / 60000)} phút</small>
              {session.canManage ? <button type="button" className="feature-button" disabled={busy} onClick={() => { if (window.confirm(`Hủy buổi nấu “${session.title}”?`)) act(`/features/cooking-sessions/${session.id}`, { method: 'DELETE' }, 'Đã hủy buổi nấu.') }}>Hủy buổi nấu</button>
                : <button type="button" className="feature-button" disabled={busy || (closed && !session.joinedByMe)} onClick={() => act(session.joinedByMe ? `/features/cooking-sessions/${session.id}/join` : `/extensions/events/${session.id}/register`, { method: session.joinedByMe ? 'DELETE' : 'POST' }, session.joinedByMe ? 'Đã rời buổi nấu.' : 'Đã tham gia buổi nấu.')}>
                  {session.joinedByMe ? 'Rời buổi nấu' : closed ? 'Đã kết thúc' : session.capacity && session.joined >= session.capacity ? 'Đã đủ chỗ' : 'Tham gia'}
                </button>}
            </div>
          </article>
        })}
        {examples.map(session => <article key={session.id} className="cook-together-card">
          <div className="cook-together-header"><strong>{session.title}</strong><span>{session.joined}/{session.slots} người</span></div>
          <small>Nội dung minh họa</small><p>Chủ trì: {session.host}</p><p>{session.time.replace('T', ' ')}</p><small>{session.duration} phút</small>
        </article>)}
        </div>
      </section>
    </div>
  </Shell>
}
