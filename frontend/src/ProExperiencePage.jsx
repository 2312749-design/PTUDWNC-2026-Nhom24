'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { apiRequest, getAccessToken, getSessionUser } from './api/session'

const defaults = {
  theme: 'system', fontScale: 'normal', highContrast: false,
  privacy: { hideEmail: true, hideActivity: false, collections: 'followers' },
  notifications: { comments: true, approvals: true, follows: true, challenges: true },
  goal: 'Cân bằng', savedFilters: [],
}

function mergeSettings(settings) {
  return { ...defaults, ...(settings || {}), privacy: { ...defaults.privacy, ...(settings?.privacy || {}) }, notifications: { ...defaults.notifications, ...(settings?.notifications || {}) }, savedFilters: Array.isArray(settings?.savedFilters) ? settings.savedFilters : [] }
}


export default function ProExperiencePage() {
  const signedIn = Boolean(getAccessToken() || getSessionUser())
  const [discovery, setDiscovery] = useState({ categories: [], topIngredients: [], trends: [], regions: [] })
  const [settings, setSettings] = useState(defaults)
  const [insights, setInsights] = useState(null)
  const [history, setHistory] = useState([])
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [filter, setFilter] = useState({ category: '', difficulty: '', maxMinutes: '', vegetarian: '' })
  const [compareIds, setCompareIds] = useState({ left: '', right: '' })
  const [comparison, setComparison] = useState(null)
  const [rolePreview, setRolePreview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const tasks = [apiRequest('/pro/discovery')]
    if (signedIn) tasks.push(apiRequest('/pro/preferences'), apiRequest('/pro/profile-insights'), apiRequest('/pro/history'))
    Promise.all(tasks).then(result => {
      if (!active) return
      setDiscovery(result[0])
      if (signedIn) { setSettings(mergeSettings(result[1]?.settings)); setInsights(result[2]); setHistory(result[3]?.items || []) }
    }).catch(error => toast.error(error.message)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [signedIn])

  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return }
    const controller = new AbortController()
    const timeout = window.setTimeout(() => apiRequest(`/pro/suggestions?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(data => setSuggestions(data.items || [])).catch(() => {}), 180)
    return () => { controller.abort(); window.clearTimeout(timeout) }
  }, [query])

  const saveSettings = async next => {
    setSettings(next)
    document.documentElement.dataset.theme = next.theme
    document.documentElement.dataset.fontScale = next.fontScale
    document.documentElement.dataset.contrast = String(next.highContrast)
    localStorage.setItem('culinary:appearance', JSON.stringify({ theme: next.theme, fontScale: next.fontScale, highContrast: next.highContrast }))
    window.dispatchEvent(new Event('culinary:appearance-changed'))
    if (!signedIn) { toast.info('Bạn có thể đăng nhập để đồng bộ cài đặt giữa các thiết bị.'); return }
    try { await apiRequest('/pro/preferences', { method: 'PUT', body: JSON.stringify({ settings: next }) }); toast.success('Đã lưu cài đặt cá nhân.') }
    catch (error) { toast.error(error.message) }
  }

  const saveFilter = () => {
    if (!filter.category && !filter.difficulty && !filter.maxMinutes && !filter.vegetarian) return toast.info('Hãy chọn ít nhất một điều kiện trước khi lưu.')
    const label = [filter.category && discovery.categories.find(item => item.id === filter.category)?.name, filter.difficulty, filter.maxMinutes && `≤ ${filter.maxMinutes} phút`, filter.vegetarian === 'true' && 'Món chay'].filter(Boolean).join(' · ')
    const next = { ...settings, savedFilters: [...settings.savedFilters, { id: `${Date.now()}`, label, filter }].slice(-8) }
    saveSettings(next)
  }

  const runComparison = async () => {
    if (!compareIds.left || !compareIds.right) return toast.info('Chọn đủ hai công thức để so sánh.')
    try { setComparison(await apiRequest(`/pro/recipes/compare?left=${compareIds.left}&right=${compareIds.right}`)) }
    catch (error) { toast.error(error.message) }
  }

  const previewRole = async role => {
    try { setRolePreview(await apiRequest('/pro/admin/preview-role', { method: 'POST', body: JSON.stringify({ role }) })) }
    catch { setRolePreview({ role, navigation: role === 'Moderator' ? ['Báo cáo', 'Bảng tin', 'Hàng đợi ưu tiên'] : ['Trang chủ', 'Công thức', 'Hồ sơ'] }) }
  }

  const visibleTrends = useMemo(() => discovery.trends.filter(recipe => (!filter.category || discovery.categories.find(item => item.id === filter.category)?.name === recipe.category) && (!filter.difficulty || recipe.difficulty === filter.difficulty) && (!filter.maxMinutes || (recipe.cookingTimeMinutes || 0) <= Number(filter.maxMinutes)) && (!filter.vegetarian || true)), [discovery, filter])

  return <div className="pro-shell">
    <header className="pro-hero">
      <div><p>TRUNG TÂM CULINARY PRO</p><h1>Bếp thông minh, cá nhân hóa hơn</h1><span>Tìm món nhanh, so sánh trước khi nấu, quản lý mục tiêu và trải nghiệm theo cách của riêng bạn.</span></div>
      <div className="pro-hero-actions"><Link href="/fridge">AI từ tủ lạnh</Link><Link href="/planner">Lập thực đơn tuần</Link></div>
    </header>

    <section className="pro-section search-section" aria-labelledby="quick-search">
      <div className="pro-section-heading"><div><p>GỢI Ý TỨC THÌ</p><h2 id="quick-search">Bạn muốn nấu gì?</h2></div><kbd>Ctrl K</kbd></div>
      <div className="pro-search"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Gõ tên món, danh mục hoặc nguyên liệu…" aria-label="Tìm công thức nhanh" />{suggestions.length > 0 && <div className="suggestion-panel">{suggestions.map(item => <Link key={`${item.type}-${item.value}`} href={item.type === 'recipe' ? `/recipes/${item.value}` : item.type === 'category' ? `/categories` : `/recipes`}><span>{item.type === 'recipe' ? '🍲' : item.type === 'category' ? '▦' : '🥬'}</span><b>{item.label}</b><small>{item.detail}</small></Link>)}</div>}</div>
      <div className="filter-grid"><label>Danh mục<select value={filter.category} onChange={event => setFilter({ ...filter, category: event.target.value })}><option value="">Tất cả</option>{discovery.categories.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label>Độ khó<select value={filter.difficulty} onChange={event => setFilter({ ...filter, difficulty: event.target.value })}><option value="">Mọi độ khó</option><option>Easy</option><option>Medium</option><option>Hard</option><option>Expert</option></select></label><label>Tối đa (phút)<input type="number" min="1" value={filter.maxMinutes} onChange={event => setFilter({ ...filter, maxMinutes: event.target.value })} placeholder="30" /></label><label>Chế độ ăn<select value={filter.vegetarian} onChange={event => setFilter({ ...filter, vegetarian: event.target.value })}><option value="">Tất cả</option><option value="true">Món chay</option></select></label><button type="button" onClick={saveFilter}>Lưu bộ lọc</button></div>
      {settings.savedFilters.length > 0 && <div className="saved-filter-row">{settings.savedFilters.map(item => <button type="button" key={item.id} onClick={() => setFilter(item.filter)}>{item.label} ×</button>)}</div>}
    </section>

    <section className="pro-section"><div className="pro-section-heading"><div><p>XU HƯỚNG TRONG TUẦN</p><h2>Món được quan tâm</h2></div><Link href="/recipes">Xem tất cả →</Link></div><div className="trend-grid">{loading ? <p>Đang tải đề xuất…</p> : visibleTrends.length ? visibleTrends.map(recipe => <Link href={`/recipes/${recipe.slug || recipe.id}`} className="trend-card" key={recipe.id}>{recipe.imageUrl ? <img src={recipe.imageUrl} alt="" /> : <span className="trend-image">🍽</span>}<small>{recipe.category}</small><strong>{recipe.title}</strong><span>{recipe.views} lượt xem · {recipe.difficulty}</span></Link>) : <p>Không có món phù hợp với bộ lọc hiện tại.</p>}</div></section>

    <section className="pro-columns"><article className="pro-section"><div className="pro-section-heading"><div><p>C11 · C16 · C17</p><h2>Khám phá theo nguyên liệu</h2></div></div><div className="ingredient-cloud">{discovery.topIngredients.map(item => <button type="button" key={item.name} onClick={() => setQuery(item.name)}>{item.name}<small>{item.recipeCount}</small></button>)}</div><div className="category-mini-grid">{discovery.categories.slice(0, 6).map(category => <Link href="/categories" key={category.id}><b>{category.name}</b><small>{category.recipeCount} món</small></Link>)}</div></article>
      <article className="pro-section"><div className="pro-section-heading"><div><p>W5 · ẨM THỰC BA MIỀN</p><h2>Bản đồ vị giác Việt Nam</h2></div></div><div className="region-map">{discovery.regions.map(region => <button type="button" key={region.region} onClick={() => setQuery(region.examples[0])}><b>Miền {region.region}</b><span>{region.examples.join(' · ')}</span></button>)}</div></article></section>

    <section className="pro-section"><div className="pro-section-heading"><div><p>R9 · SO SÁNH CÔNG THỨC</p><h2>Chọn món hợp với hôm nay</h2></div></div><div className="compare-controls"><select value={compareIds.left} onChange={event => setCompareIds({ ...compareIds, left: event.target.value })}><option value="">Món thứ nhất</option>{discovery.trends.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><span>với</span><select value={compareIds.right} onChange={event => setCompareIds({ ...compareIds, right: event.target.value })}><option value="">Món thứ hai</option>{discovery.trends.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><button type="button" onClick={runComparison}>So sánh</button></div>{comparison && <div className="comparison-table"><div></div><b>{comparison.left.title}</b><b>{comparison.right.title}</b><span>Thời gian</span><span>{comparison.left.totalMinutes} phút</span><span>{comparison.right.totalMinutes} phút</span><span>Độ khó</span><span>{comparison.left.difficulty}</span><span>{comparison.right.difficulty}</span><span>Khẩu phần</span><span>{comparison.left.servings}</span><span>{comparison.right.servings}</span><span>Nguyên liệu</span><span>{comparison.left.ingredients.length} loại</span><span>{comparison.right.ingredients.length} loại</span></div>}</section>

    <section className="pro-columns"><article className="pro-section"><div className="pro-section-heading"><div><p>P2 · P3 · W7</p><h2>Hành trình vào bếp</h2></div></div>{signedIn && insights ? <><div className="level-card"><b>{insights.level}</b><strong>{insights.points} điểm</strong><span>{insights.cookedCount} món đã nấu · {insights.recipeCount} công thức đã đăng</span></div><div className="badge-row">{insights.badges.map(badge => <span key={badge}>✦ {badge}</span>)}</div></> : <p><Link href="/login">Đăng nhập</Link> để xem cấp độ, huy hiệu và hoạt động bếp của bạn.</p>}<Link className="text-link" href="/creator">Mở dashboard tác giả →</Link></article>
      <article className="pro-section"><div className="pro-section-heading"><div><p>R12 · LỊCH SỬ XEM</p><h2>Quay lại món vừa xem</h2></div></div>{signedIn ? <div className="history-list">{history.length ? history.slice(0, 5).map(item => <Link href={`/recipes/${item.slug || item.recipeId}`} key={item.recipeId}><b>{item.title}</b><small>{new Date(item.viewedAt).toLocaleDateString('vi-VN')} · {item.category}</small></Link>) : <p>Bạn chưa xem công thức nào gần đây.</p>}</div> : <p>Lịch sử xem sẽ được lưu sau khi bạn đăng nhập.</p>}</article></section>

    <section className="pro-section preferences"><div className="pro-section-heading"><div><p>U1 · U8 · P4 · P7 · W4</p><h2>Không gian bếp của bạn</h2></div></div><div className="preferences-grid"><label>Giao diện<select value={settings.theme} onChange={event => saveSettings({ ...settings, theme: event.target.value })}><option value="system">Theo hệ thống</option><option value="light">Sáng</option><option value="dark">Tối</option></select></label><label>Cỡ chữ<select value={settings.fontScale} onChange={event => saveSettings({ ...settings, fontScale: event.target.value })}><option value="normal">Mặc định</option><option value="large">Lớn hơn</option></select></label><label>Mục tiêu dinh dưỡng<select value={settings.goal} onChange={event => saveSettings({ ...settings, goal: event.target.value })}><option> Cân bằng</option><option>Giảm cân</option><option>Tăng cơ</option><option>Ăn chay</option></select></label><label className="switch-label"><input type="checkbox" checked={settings.highContrast} onChange={event => saveSettings({ ...settings, highContrast: event.target.checked })} /> Tương phản cao</label><label className="switch-label"><input type="checkbox" checked={settings.privacy.hideEmail} onChange={event => saveSettings({ ...settings, privacy: { ...settings.privacy, hideEmail: event.target.checked } })} /> Ẩn email công khai</label><label className="switch-label"><input type="checkbox" checked={settings.notifications.comments} onChange={event => saveSettings({ ...settings, notifications: { ...settings.notifications, comments: event.target.checked } })} /> Nhận thông báo bình luận</label></div></section>

    <section className="pro-columns"><article className="pro-section"><div className="pro-section-heading"><div><p>W6 · CỘNG ĐỒNG</p><h2>Sự kiện & thử thách</h2></div></div><p>Tham gia thử thách đang mở, đăng công thức của bạn và theo dõi thành tích ngay trên bảng xếp hạng.</p><Link className="primary-link" href="/challenges">Khám phá sự kiện nấu ăn →</Link></article><article className="pro-section admin-preview"><div className="pro-section-heading"><div><p>A17 · A18</p><h2>Quyền quản trị chi tiết</h2></div></div><p>Kiểm tra trải nghiệm theo vai trò mà không đổi tài khoản thật.</p><div>{['User', 'Moderator', 'ContentManager', 'SystemAdmin'].map(role => <button type="button" key={role} onClick={() => previewRole(role)}>{role}</button>)}</div>{rolePreview && <small>Giả lập {rolePreview.role}: {rolePreview.navigation?.join(' · ')}</small>}{signedIn && <Link className="text-link" href="/admin">Mở quản trị →</Link>}</article></section>
  </div>
}
