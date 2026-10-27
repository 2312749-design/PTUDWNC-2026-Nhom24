'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { apiRequest, getAccessToken, getSessionUser } from './api/session'

const emptyDraft = { title: '', note: '', tags: '#bepnha #monngon' }

function CategoryBranch({ item, depth = 0 }) {
  return <li><Link href={`/categories?category=${encodeURIComponent(item.slug || item.id)}`}>{'— '.repeat(depth)}{item.name} <small>{item.recipeCount} món</small></Link>{item.children?.length > 0 && <ul>{item.children.map(child => <CategoryBranch key={child.id} item={child} depth={depth + 1} />)}</ul>}</li>
}

export default function StudioPage() {
  const signedIn = Boolean(getAccessToken() || getSessionUser())
  const role = getSessionUser()?.role
  const [draft, setDraft] = useState(emptyDraft)
  const [hydrated, setHydrated] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [tree, setTree] = useState([])
  const [events, setEvents] = useState([])
  const [leaders, setLeaders] = useState([])
  const [undo, setUndo] = useState(null)
  const undoTimer = useRef(null)

  const load = async () => {
    try {
      const requests = [apiRequest('/extensions/categories/tree'), apiRequest('/extensions/events'), apiRequest('/extensions/leaderboard')]
      if (signedIn) requests.push(apiRequest('/extensions/drafts/recipe-studio'))
      const [categories, eventData, ranking, saved] = await Promise.all(requests)
      setTree(categories.items || [])
      setEvents(eventData.items || [])
      setLeaders(ranking.items || [])
      if (saved?.content) setDraft({ ...emptyDraft, ...saved.content })
      if (saved?.updatedAt) setSavedAt(saved.updatedAt)
    } catch (error) { toast.error(error.message || 'Không thể tải Studio.') }
    finally { setHydrated(true) }
  }

  useEffect(() => { load(); return () => window.clearTimeout(undoTimer.current) }, [])

  useEffect(() => {
    if (!signedIn || !hydrated) return
    const timer = window.setTimeout(async () => {
      try {
        const data = await apiRequest('/extensions/drafts/recipe-studio', { method: 'PUT', body: JSON.stringify({ content: draft }) })
        setSavedAt(data.updatedAt || new Date().toISOString())
      } catch { /* The editor stays usable when a transient save fails. */ }
    }, 850)
    return () => window.clearTimeout(timer)
  }, [draft, signedIn, hydrated])

  const clearDraft = () => {
    const previous = draft
    setDraft(emptyDraft)
    setUndo(previous)
    window.clearTimeout(undoTimer.current)
    undoTimer.current = window.setTimeout(async () => {
      try { if (signedIn) await apiRequest('/extensions/drafts/recipe-studio', { method: 'DELETE' }) } catch {}
      setUndo(null)
    }, 6000)
  }

  const restoreDraft = () => {
    if (!undo) return
    window.clearTimeout(undoTimer.current)
    setDraft(undo)
    setUndo(null)
    toast.success('Đã hoàn tác thao tác xóa.')
  }

  const register = async id => {
    if (!signedIn) return toast.info('Đăng nhập để đăng ký sự kiện.')
    try { await apiRequest(`/extensions/events/${id}/register`, { method: 'POST', body: JSON.stringify({}) }); toast.success('Đã đăng ký sự kiện!'); load() }
    catch (error) { toast.error(error.message) }
  }

  return <div className="studio-shell">
    <header className="studio-hero"><div><p>STUDIO · TÍNH NĂNG PRO</p><h1>Tạo, lưu và tham gia cùng cộng đồng</h1><span>Không gian thử ý tưởng có autosave, danh mục nhiều cấp, hashtag, sự kiện và bảng xếp hạng.</span></div><Link href="/pro">Mở Trung tâm Pro →</Link></header>

    <section className="studio-grid">
      <article className="studio-card editor-card"><div className="studio-heading"><div><p>U5 · U6 · M3 · M4</p><h2>Nháp ý tưởng công thức</h2></div>{signedIn && <small>{savedAt ? `Đã tự lưu ${new Date(savedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Sẵn sàng tự lưu'}</small>}</div>
        <label>Tên món<input value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} placeholder="Ví dụ: Canh chua cá miền Nam" /></label>
        <label>Ghi chú / mô tả<textarea value={draft.note} onChange={event => setDraft({ ...draft, note: event.target.value })} placeholder="Mẹo nấu, nguyên liệu có sẵn, hoặc nhắc @ten-ban để cùng hoàn thiện…" /></label>
        <label>Hashtag<input value={draft.tags} onChange={event => setDraft({ ...draft, tags: event.target.value })} placeholder="#monchay #comgiadinh" /></label>
        <div className="studio-actions"><button type="button" onClick={clearDraft}>Xóa nháp</button><Link href="/recipes">Viết công thức đầy đủ →</Link></div>
        {undo && <div className="undo-toast">Đã xóa nháp. <button type="button" onClick={restoreDraft}>Hoàn tác</button></div>}
        {!signedIn && <small className="studio-muted"><Link href="/login">Đăng nhập</Link> để lưu nháp an toàn trên máy chủ.</small>}
      </article>

      <article className="studio-card"><div className="studio-heading"><div><p>C11</p><h2>Danh mục dạng cây</h2></div><Link href="/categories">Tất cả →</Link></div>{tree.length ? <ul className="category-tree">{tree.map(item => <CategoryBranch key={item.id} item={item} />)}</ul> : <p className="studio-muted">Chưa có danh mục hiển thị.</p>}</article>
    </section>

    <section className="studio-grid">
      <article className="studio-card"><div className="studio-heading"><div><p>W6 · M5</p><h2>Sự kiện nấu ăn trực tuyến</h2></div></div><div className="event-list">{events.length ? events.map(item => <div key={item.id}><b>{item.title}</b><span>{new Date(item.startsAt).toLocaleDateString('vi-VN')} · {item.registrations}{item.capacity ? `/${item.capacity}` : ''} người</span><p>{item.description}</p><button type="button" disabled={item.registeredByMe} onClick={() => register(item.id)}>{item.registeredByMe ? 'Đã đăng ký' : 'Đăng ký tham gia'}</button></div>) : <p className="studio-muted">Sự kiện mới sẽ xuất hiện tại đây.</p>}</div>{role === 'Admin' && <Link className="studio-admin-link" href="/admin">Tạo sự kiện trong quản trị →</Link>}</article>
      <article className="studio-card"><div className="studio-heading"><div><p>M5 · M8</p><h2>Bảng xếp hạng cộng đồng</h2></div><Link href="/challenges">Thử thách →</Link></div><ol className="leaderboard">{leaders.length ? leaders.map((item, index) => <li key={`${item.userName}-${index}`}><span>#{index + 1}</span><b>{item.fullName || item.userName}</b><strong>{item.points} điểm</strong></li>) : <li className="studio-muted">Hãy là người đầu tiên tạo hoạt động.</li>}</ol></article>
    </section>

    <section className="studio-card hashtag-card"><div><p>M3 · M4</p><h2>Gắn thẻ và tìm theo chủ đề</h2><span>Dùng <b>@username</b> để nhắc thành viên trong bài viết; dùng hashtag để gom câu chuyện ẩm thực.</span></div><div>{['#monchay', '#bepnha', '#comgiadinh'].map(tag => <Link href={`/community?hashtag=${encodeURIComponent(tag.slice(1))}`} key={tag}>{tag}</Link>)}</div></section>
  </div>
}
