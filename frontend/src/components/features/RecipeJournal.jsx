'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { apiRequest, hasSession } from '../../api/session.js'
import { useAuthStore } from '../../store/auth-store'

const guestStorageKey = 'culinary:recipe-journal:guest'
const initialEntries = [
  { id: 1, title: 'Mì xào rau củ chay', note: 'Thêm 1 thìa nước tương để đậm hơn', spice: 'Tăng chút ớt', cookedAt: '2026-09-28', duration: 22, result: 'Mềm, thơm, rất hợp với bàn ăn gia đình' },
  { id: 2, title: 'Canh chua cá', note: 'Giảm dứa đi một ít vì gia đình không thích chua quá', spice: 'Bớt ớt', cookedAt: '2026-09-25', duration: 35, result: 'Nước canh ngon nhưng cần thêm chút muối.' },
]
const emptyForm = () => ({ title: '', note: '', spice: '', cookedAt: new Date().toISOString().slice(0, 10), duration: 30, result: '' })

function readEntries(content) {
  if (!content || !Object.hasOwn(content, 'entries')) return initialEntries
  if (!Array.isArray(content.entries) || content.entries.some(entry => !entry || typeof entry.title !== 'string'
    || ['note', 'spice', 'cookedAt', 'result'].some(key => entry[key] != null && typeof entry[key] !== 'string')
    || !Number.isFinite(Number(entry.duration)))) {
    throw new Error('Dữ liệu nhật ký không hợp lệ. Vui lòng thử tải lại trước khi lưu.')
  }
  return content.entries
}

export default function RecipeJournal({ Shell }) {
  const hydrated = useAuthStore(state => state.hydrated)
  const userId = useAuthStore(state => state.user?.id)
  const ownerKey = userId || 'guest'
  const [entries, setEntries] = useState(initialEntries)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadedOwner, setLoadedOwner] = useState(null)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const savingRequest = useRef(false)
  const requestScope = useRef(null)
  const ready = hydrated && !loading && !error && loadedOwner === ownerKey

  useEffect(() => {
    if (!hydrated) return
    const scope = { active: true }
    requestScope.current = scope
    const load = async () => {
      setLoading(true)
      setLoadedOwner(null)
      setError('')
      try {
        const data = hasSession()
          ? await apiRequest('/extensions/drafts/recipe-journal')
          : { content: JSON.parse(window.localStorage.getItem(guestStorageKey) || 'null') }
        const loaded = readEntries(data?.content)
        if (!scope.active) return
        setEntries(loaded)
        setLoadedOwner(ownerKey)
      } catch (failure) {
        if (!scope.active) return
        setError(failure.message || 'Chưa tải được nhật ký nấu ăn.')
      } finally {
        if (scope.active) setLoading(false)
      }
    }
    load()
    return () => { scope.active = false }
  }, [hydrated, ownerKey, reload])

  const handleSubmit = async event => {
    event.preventDefault()
    if (savingRequest.current || loading || error || loadedOwner !== ownerKey) return
    const title = form.title.trim()
    const duration = Number(form.duration)
    if (!title || title.length > 160 || !form.cookedAt || !Number.isInteger(duration) || duration < 1 || duration > 1440) {
      toast.error('Nhập tên món, ngày nấu và thời gian từ 1 đến 1440 phút.')
      return
    }
    const nextEntries = [{ ...form, id: crypto.randomUUID(), title, duration }, ...entries]
    const content = { entries: nextEntries }
    if (JSON.stringify(content).length > 30000) {
      toast.error('Nhật ký vượt dung lượng lưu 30.000 ký tự. Ghi chú mới vẫn được giữ trong biểu mẫu.')
      return
    }
    const scope = requestScope.current
    savingRequest.current = true
    setSaving(true)
    try {
      if (hasSession()) {
        await apiRequest('/extensions/drafts/recipe-journal', { method: 'PUT', body: JSON.stringify({ content }) })
      } else {
        window.localStorage.setItem(guestStorageKey, JSON.stringify(content))
      }
      if (!scope?.active) return
      setEntries(nextEntries)
      setForm(emptyForm())
      toast.success('Đã lưu nhật ký nấu ăn.')
    } catch (failure) {
      if (scope?.active) toast.error(failure.message || 'Chưa lưu được nhật ký. Vui lòng thử lại.')
    } finally {
      savingRequest.current = false
      setSaving(false)
    }
  }

  return <Shell eyebrow="NHẬT KÝ NẤU RIÊNG" title="Ghi chép món đã thử" intro="Lưu lại nguyên liệu, thay đổi gia vị, thời gian nấu và cảm nhận thực tế để mỗi lần nấu dần tốt hơn.">
    {!hydrated || loading ? <p role="status">Đang tải nhật ký nấu ăn...</p> : error ? <p role="alert">{error} <button type="button" className="feature-button" onClick={() => setReload(value => value + 1)}>Thử lại</button></p> : <p className="feature-empty">{userId ? 'Nhật ký được lưu riêng theo tài khoản của bạn.' : 'Bạn đang dùng nhật ký trên trình duyệt này. Đăng nhập để lưu riêng theo tài khoản.'}</p>}
    <div className="feature-columns journal-columns">
      <section className="feature-section">
        <div className="feature-section-heading"><h2>Thêm ghi chú nấu</h2></div>
        <form className="journal-form" onSubmit={handleSubmit}>
          <fieldset disabled={!hydrated || loading || saving || Boolean(error) || loadedOwner !== ownerKey} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, display: 'grid', gap: 12 }}>
            <label>Tên món<input required maxLength={160} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Ví dụ: Bò băm xào rau" /></label>
            <label>Ghi chú<textarea maxLength={2000} value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} placeholder="Bạn đã thay đổi gì?" /></label>
            <label>Thay đổi gia vị<input maxLength={500} value={form.spice} onChange={event => setForm({ ...form, spice: event.target.value })} placeholder="Ví dụ: bớt cay, thêm tỏi" /></label>
            <div className="journal-inline-fields">
              <label>Ngày nấu<input type="date" required value={form.cookedAt} onChange={event => setForm({ ...form, cookedAt: event.target.value })} /></label>
              <label>Thời gian (phút)<input type="number" min="1" max="1440" required value={form.duration} onChange={event => setForm({ ...form, duration: event.target.value })} /></label>
            </div>
            <label>Kết quả<textarea maxLength={2000} value={form.result} onChange={event => setForm({ ...form, result: event.target.value })} placeholder="Món có ngon không, ai thích ăn gì?" /></label>
            <button type="submit" className="feature-button primary">{saving ? 'Đang lưu...' : 'Lưu nhật ký'}</button>
          </fieldset>
        </form>
      </section>
      <section className="feature-section">
        <div className="feature-section-heading"><h2>Lịch sử nấu</h2></div>
        <div className="journal-list">
          {ready && entries.map(entry => <article key={entry.id} className="journal-entry">
            <div className="journal-entry-header"><strong>{entry.title}</strong><small>{entry.cookedAt}</small></div>
            <p><span>Ghi chú:</span> {entry.note || 'Không có ghi chú'}</p>
            <p><span>Gia vị:</span> {entry.spice || 'Không đổi'}</p>
            <p><span>Thời gian:</span> {entry.duration} phút</p>
            <p><span>Kết quả:</span> {entry.result || 'Chưa ghi kết quả'}</p>
          </article>)}
          {ready && entries.length === 0 && <p className="feature-empty">Chưa có nhật ký nấu ăn.</p>}
        </div>
      </section>
    </div>
  </Shell>
}
