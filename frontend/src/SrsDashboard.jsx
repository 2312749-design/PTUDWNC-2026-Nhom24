'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { apiRequest, hasSession } from './api/session.js'
import { useRouter } from 'next/navigation'
import './dashboard-redesign.css'

export default function SrsDashboard() {
  const router = useRouter()
  const [state, setState] = useState({ loading: true, user: null, recipes: [] })

  useEffect(() => {
    if (!hasSession()) { router.replace('/auth/login'); return }
    Promise.all([apiRequest('/auth/me'), apiRequest('/recipes/mine')])
      .then(([user, recipes]) => setState({ loading: false, user, recipes }))
      .catch(error => error.status === 401
        ? router.replace('/auth/login')
        : setState({ loading: false, user: null, recipes: [], error: error.message }))
  }, [router])

  if (state.loading) return <main className="content-shell"><p>Đang tải bảng điều khiển…</p></main>
  if (state.error) return <main className="content-shell"><h1>Không tải được bảng điều khiển</h1><p>{state.error}</p></main>

  const counts = state.recipes.reduce((result, recipe) => {
    result[recipe.status] = (result[recipe.status] || 0) + 1
    return result
  }, {})
  const pendingCount = state.recipes.filter(recipe => recipe.reviewStatus === 'PendingReview').length
  const hiddenCount = state.recipes.filter(recipe => recipe.status === 0 && recipe.reviewStatus !== 'PendingReview').length
  const recentRecipes = [...state.recipes]
    .sort((left, right) => new Date(right.updatedAt || right.createdAt) - new Date(left.updatedAt || left.createdAt))
    .slice(0, 6)
  const statusLabel = recipe => recipe.status === 1 ? 'Đã công khai' : recipe.status === 2 ? 'Đã lưu trữ' : 'Đang ẩn'
  const reviewLabel = recipe => recipe.reviewStatus === 'PendingReview' ? 'Đang chờ duyệt'
    : recipe.reviewStatus === 'Approved' ? 'Đã duyệt'
      : recipe.reviewStatus === 'ChangesRequested' ? 'Cần chỉnh sửa' : 'Chưa gửi duyệt'
  return <main className="content-shell srs-dashboard">
    <header className="dashboard-welcome"><div><p className="eyebrow">GÓC TÁC GIẢ</p><h1>Xin chào, {state.user?.fullName || state.user?.displayName}</h1><p>Quản lý món ăn, theo dõi kiểm duyệt và tiếp tục xây dựng căn bếp của riêng bạn.</p><div className="dashboard-welcome-actions"><Link href="/dashboard/recipes/new">＋ Tạo công thức mới</Link><Link href="/dashboard/recipes">Quản lý công thức</Link></div></div><div className="dashboard-welcome-mark" aria-hidden="true"><span>B</span><small>BẾP NHÀ</small></div></header>
    <section className="creator-metrics" aria-label="Thống kê công thức">
      <article className="metric-card metric-total"><span>Tổng công thức</span><strong>{state.recipes.length}</strong><small>Tất cả món bạn đã tạo</small></article>
      <article className="metric-card metric-draft"><span>Đang ẩn</span><strong>{hiddenCount}</strong><small>Chỉ bạn và quản trị viên thấy</small></article>
      <article className="metric-card metric-pending"><span>Chờ duyệt</span><strong>{pendingCount}</strong><small>Đang đợi quản trị viên xử lý</small></article>
      <article className="metric-card metric-published"><span>Đã công khai</span><strong>{counts[1] || 0}</strong><small>Đang xuất hiện trên website</small></article>
    </section>
    <nav className="creator-actions" aria-label="Thao tác tác giả">
      <Link href="/dashboard/recipes/new"><span>＋</span><strong>Tạo công thức</strong><small>Chia sẻ một món mới</small></Link>
      <Link href="/dashboard/recipes"><span>▤</span><strong>Công thức của tôi</strong><small>Xem trạng thái và chỉnh sửa</small></Link>
      <Link href="/profile"><span>♙</span><strong>Cập nhật hồ sơ</strong><small>Ảnh đại diện và thông tin</small></Link>
      {state.user?.role === 'Admin' && <Link href="/dashboard/categories"><span aria-hidden="true">▦</span><strong>Quản lý danh mục</strong><small>Thêm, sửa và sắp xếp danh mục</small></Link>}
      {state.user?.role === 'Admin' && <Link href="/admin"><span aria-hidden="true">♚</span><strong>Quản trị hệ thống</strong><small>Người dùng, kiểm duyệt và nhật ký</small></Link>}
    </nav>
    <section className="dashboard-recent" aria-labelledby="recent-recipes-title"><div className="dashboard-section-heading"><div><p className="eyebrow">MỚI CẬP NHẬT</p><h2 id="recent-recipes-title">Công thức gần đây</h2><span>Các món bạn vừa tạo hoặc chỉnh sửa gần nhất.</span></div><Link href="/dashboard/recipes">Xem toàn bộ →</Link></div>{recentRecipes.length ? <div className="dashboard-recent-grid">{recentRecipes.map(recipe => <article key={recipe.id} className="dashboard-recipe-card"><Link className="dashboard-recipe-image" href={`/recipes/${recipe.slug || recipe.id}`}>{recipe.imageUrl ? <img src={recipe.imageUrl} alt={recipe.title} /> : <span>Chưa có ảnh món ăn</span>}</Link><div className="dashboard-recipe-body"><div className="dashboard-recipe-status"><span className={`visibility-${recipe.status}`}>{statusLabel(recipe)}</span><span className={`review-${String(recipe.reviewStatus || 'Draft').toLowerCase()}`}>{reviewLabel(recipe)}</span></div><h3>{recipe.title}</h3><p>{recipe.description || 'Công thức chưa có phần giới thiệu.'}</p><small>Cập nhật {new Date(recipe.updatedAt || recipe.createdAt).toLocaleString('vi-VN')}</small><nav aria-label={`Thao tác cho ${recipe.title}`}><Link href={`/recipes/${recipe.slug || recipe.id}`}>Xem chi tiết</Link><Link href={`/dashboard/recipes/${recipe.id}/edit`}>Chỉnh sửa</Link></nav></div></article>)}</div> : <div className="dashboard-empty-recipes"><strong>Bếp của bạn đang chờ món đầu tiên</strong><p>Tạo công thức, thêm nguyên liệu và gửi quản trị viên duyệt.</p><Link href="/dashboard/recipes/new">Tạo công thức ngay</Link></div>}</section>
  </main>
}
