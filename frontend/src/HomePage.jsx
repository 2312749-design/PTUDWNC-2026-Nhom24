'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from './api/session'
import LoadingState from './components/common/LoadingState'
import ErrorState from './components/common/ErrorState'
import EmptyState from './components/common/EmptyState'
import './home.css'

const fallbackImage = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80'
const bypassLocalImageOptimizer = url => /^https?:\/\/(localhost|127\.0\.0\.1):9000\//i.test(url || '') || /^https:\/\/(commons|upload)\.wikimedia\.org\//i.test(url || '')

function recipeCreatedAt(recipe) {
  const timestamp = Date.parse(recipe.createdAt || recipe.updatedAt || '')
  return Number.isFinite(timestamp) ? timestamp : 0
}

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const [categoryData, recipeData] = await Promise.all([apiRequest('/categories'), apiRequest('/recipes')])
      setCategories(Array.isArray(categoryData) ? categoryData.filter(category => category.isVisible !== false) : categoryData?.items || [])
      setRecipes(Array.isArray(recipeData) ? recipeData : recipeData?.items || [])
    } catch (loadError) { setError(loadError.message || 'Không thể tải trang chủ.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])
  const newestRecipes = useMemo(() => recipes.slice().sort((left, right) => recipeCreatedAt(right) - recipeCreatedAt(left) || String(left.id).localeCompare(String(right.id))).slice(0, 9), [recipes])

  return <div className="home-page">
    <section className="home-hero"><div className="home-hero-copy"><p>ẨM THỰC MỖI NGÀY</p><h1>Nấu món ngon, kể chuyện bếp nhà</h1><span>Khám phá công thức dễ làm từ cộng đồng và lưu lại cảm hứng cho bữa cơm tiếp theo.</span><div><Link href="/recipes">Khám phá công thức →</Link><Link className="home-hero-secondary" href="/recipes/new">Chia sẻ món của bạn</Link></div></div></section>
    {loading && <LoadingState label="Đang tải công thức mới…" />}
    {error && <ErrorState title="Không thể tải trang chủ" message={error} retry={load} />}
    {!loading && !error && <div className="home-layout">
      <aside className="home-sidebar"><div className="home-sidebar-head"><div><p>DANH MỤC</p><h2>Nấu gì hôm nay?</h2></div><Link href="/categories">Xem tất cả</Link></div>
        <nav aria-label="Danh mục món ăn">{categories.slice(0, 12).map(category => <Link key={category.id} href={`/recipes?category=${category.id}`}><span>{category.name}</span><b>{category.publishedRecipeCount ?? category.recipeCount ?? 0}</b></Link>)}</nav>
        {!categories.length && <p className="home-muted">Chưa có danh mục để hiển thị.</p>}
      </aside>
      <main className="home-main"><div className="home-section-head"><div><p>CÔNG THỨC MỚI</p><h2>Món mới từ cộng đồng</h2></div><Link href="/recipes">Xem toàn bộ →</Link></div>
        {newestRecipes.length ? <div className="home-recipe-grid">{newestRecipes.map(recipe => { const imageUrl = recipe.imageUrl || fallbackImage; return <article key={recipe.id}><Link className="home-recipe-image" href={`/recipes/${recipe.id}`}><Image src={imageUrl} alt={recipe.title} width={900} height={600} sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 30vw" unoptimized={bypassLocalImageOptimizer(imageUrl)} /></Link><div className="home-recipe-content"><span>{recipe.categoryName || 'Món ngon mỗi ngày'}</span><h3><Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link></h3><p>{recipe.description || 'Khám phá nguyên liệu và cách chế biến chi tiết.'}</p><small>{recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : 'Xem cách nấu'} · {recipe.difficulty || 'Dễ làm'}</small></div></article> })}</div> : <EmptyState title="Chưa có công thức mới" message="Hãy quay lại sau hoặc chia sẻ công thức đầu tiên của bạn." actionLabel="Tạo công thức" onAction={() => { window.location.href = '/recipes/new' }} />}
      </main>
    </div>}
  </div>
}
