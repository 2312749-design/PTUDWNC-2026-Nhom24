'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { apiRequest, hasSession } from '../../api/session.js'
import { useAuthStore } from '../../store/auth-store'
import { Link } from '../../navigation.jsx'

const examples = [
  { id: 'example-1', name: 'Gia đình', owner: 'Bạn', recipes: ['Mì xào rau củ chay', 'Canh chua cá', 'Bánh tráng trộn'], shared: true },
  { id: 'example-2', name: 'Món chay nhanh', owner: 'Hương', recipes: ['Gỏi đậu phụ', 'Nộm hoa chuối', 'Bún chả giò rau củ'], shared: true },
  { id: 'example-3', name: 'Công thức lớp học', owner: 'Bé', recipes: ['Bánh bột khoai', 'Canh bí đỏ'], shared: false },
]

export default function CookbookShelf({ Shell }) {
  const hydrated = useAuthStore(state => state.hydrated)
  const userId = useAuthStore(state => state.user?.id)
  const [collections, setCollections] = useState([])
  const [recipes, setRecipes] = useState([])
  const [name, setName] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [createdId, setCreatedId] = useState(null)
  const pending = useRef(false)
  const created = useRef(null)
  const scope = useRef(null)
  const [reload, setReload] = useState(0)
  const load = useCallback(async () => {
    const rows = await apiRequest('/features/collections')
    setCollections(Array.isArray(rows) ? rows : rows.items || [])
  }, [])
  useEffect(() => {
    if (!hydrated) return
    const current = { active: true }
    scope.current = current
    created.current = null
    const fetchData = async () => {
      setCollections([])
      setCreatedId(null)
      setLoading(true); setError('')
      try {
        const [available, saved] = await Promise.all([apiRequest('/recipes'), hasSession() ? apiRequest('/features/collections') : []])
        if (!current.active) return
        const recipeRows = Array.isArray(available) ? available : available.items || []
        setRecipes(recipeRows)
        setSelectedRecipe(recipeRows[0]?.id || '')
        setCollections(Array.isArray(saved) ? saved : saved.items || [])
      } catch (failure) { if (current.active) setError(failure.message) }
      finally { if (current.active) setLoading(false) }
    }
    fetchData()
    return () => { current.active = false }
  }, [hydrated, userId, reload])

  const add = async event => {
    event.preventDefault()
    if (pending.current) return
    if (!hasSession()) { toast.error('Vui lòng đăng nhập để tạo sổ tay.'); return }
    if (name.trim().length < 2 || name.trim().length > 80 || !selectedRecipe) { toast.error('Tên sổ tay cần 2–80 ký tự và chọn một công thức.'); return }
    pending.current = true; setSaving(true)
    const current = scope.current
    try {
      if (!created.current) {
        created.current = await apiRequest('/features/collections', { method: 'POST', body: JSON.stringify({ name: name.trim() }) })
        setCreatedId(created.current.id)
      }
      await apiRequest(`/features/collections/${created.current.id}/recipes/${selectedRecipe}`, { method: 'POST' })
      if (!current?.active) return
      created.current = null
      setCreatedId(null)
      setName('')
      await load()
      toast.success('Bộ sưu tập đã được tạo.')
    } catch (failure) { toast.error(created.current ? `Sổ tay đã được tạo, món đầu tiên chưa thêm xong. Bấm Tạo sổ tay để thử lại. ${failure.message}` : failure.message) }
    finally { pending.current = false; setSaving(false) }
  }
  const remove = async item => {
    if (pending.current || !window.confirm(`Xóa sổ tay “${item.name}”? Các công thức gốc vẫn được giữ.`)) return
    pending.current = true; setSaving(true)
    try { await apiRequest(`/features/collections/${item.id}`, { method: 'DELETE' }); await load(); toast.success('Đã xóa sổ tay.') }
    catch (failure) { toast.error(failure.message) }
    finally { pending.current = false; setSaving(false) }
  }

  return <Shell eyebrow="SỔ TAY CÔNG THỨC CHUNG" title="Bộ sưu tập riêng & chia sẻ" intro="Tạo và chia sẻ tuyển tập món ăn với gia đình, bạn bè hoặc nhóm nấu cùng nhau.">
    {loading ? <p role="status">Đang tải sổ tay...</p> : error && <p role="alert">{error} <button type="button" onClick={() => setReload(value => value + 1)}>Thử lại</button></p>}
    <div className="feature-columns cookbook-columns">
      <section className="feature-section"><div className="feature-section-heading"><h2>Tạo bộ sưu tập</h2></div>
        <form className="cookbook-form" onSubmit={add}>
          <label>Tên bộ sưu tập<input required minLength={2} maxLength={80} disabled={saving || Boolean(createdId)} value={name} onChange={event => setName(event.target.value)} placeholder="Ví dụ: Món ăn cuối tuần" /></label>
          <label>Thêm món đầu tiên<select disabled={saving || loading} value={selectedRecipe} onChange={event => setSelectedRecipe(event.target.value)}><option value="">Chọn công thức</option>{recipes.map(recipe => <option key={recipe.id} value={recipe.id}>{recipe.title}</option>)}</select></label>
          <button type="submit" className="feature-button primary" disabled={!hydrated || loading || saving || Boolean(error) || !recipes.length}>{saving ? 'Đang lưu...' : 'Tạo sổ tay'}</button>
          {hydrated && !userId && <Link to="/login">Đăng nhập để lưu sổ tay riêng theo tài khoản.</Link>}
        </form>
      </section>
      <section className="feature-section"><div className="feature-section-heading"><h2>Danh sách bộ sưu tập</h2></div>
        <div className="cookbook-list">
          {collections.map(item => <article key={item.id} className="cookbook-card">
            <div className="cookbook-card-top"><strong>{item.name}</strong><span>Riêng tư</span></div><small>Người tạo: Bạn</small>
            <ul>{item.recipes?.map(recipe => <li key={recipe.id}><Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link></li>)}</ul>
            <button type="button" className="feature-button" disabled={saving} onClick={() => remove(item)}>Xóa sổ tay</button>
          </article>)}
          {examples.map(item => <article key={item.id} className="cookbook-card">
            <div className="cookbook-card-top"><strong>{item.name}</strong><span>{item.shared ? 'Chia sẻ' : 'Riêng tư'}</span></div><small>Nội dung minh họa · Người tạo: {item.owner}</small><ul>{item.recipes.map(recipe => <li key={recipe}>{recipe}</li>)}</ul>
          </article>)}
        </div>
      </section>
    </div>
  </Shell>
}
