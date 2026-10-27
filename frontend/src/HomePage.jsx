'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from './api/session'
import LoadingState from './components/common/LoadingState'
import ErrorState from './components/common/ErrorState'
import EmptyState from './components/common/EmptyState'
import { useMusicPlayer } from './components/layout/music-player-context'
import MusicVisualizer from './components/cosmic/MusicVisualizer'
import FoodRoulette from './components/cosmic/FoodRoulette'
import './home.css'

const fallbackImage = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80'

function formatTime(value) {
  const seconds = Math.max(0, Math.floor(Number(value) || 0))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function recipeCreatedAt(recipe) {
  const timestamp = Date.parse(recipe.createdAt || recipe.updatedAt || '')
  return Number.isFinite(timestamp) ? timestamp : 0
}

function HomeMusicPlayer() {
  const { track, isPlaying, duration, currentTime, volume, togglePlayback, seek, skip, setVolume } = useMusicPlayer()
  const canSeek = Number.isFinite(duration) && duration > 0
  const progress = canSeek ? Math.min(currentTime, duration) : 0

  return <aside className="home-music-player" data-playing={isPlaying} aria-label="Trình phát nhạc nền">
    <div className="home-music-player__cover"><img src={track.cover} alt={`Ảnh bìa ${track.title}`} /><span>{isPlaying ? 'ĐANG PHÁT' : 'NHẠC NỀN'}</span></div>
    <div className="home-music-player__metadata"><p>GÓC ÂM NHẠC</p><h2>{track.title}</h2><small>{track.artists}</small></div>
    <div className="home-music-player__buttons">
      <button type="button" onClick={() => skip(-10)} aria-label="Tua lại 10 giây" title="Tua lại 10 giây">↺ <span>10</span></button>
      <button type="button" className="home-music-player__play" onClick={togglePlayback}>{isPlaying ? '❚❚ Tạm dừng' : '▶ Phát nhạc'}</button>
      <button type="button" onClick={() => skip(10)} aria-label="Tua tới 10 giây" title="Tua tới 10 giây"><span>10</span> ↻</button>
    </div>
    <MusicVisualizer />
    <label className="home-music-player__range">
      <span><b>{formatTime(progress)}</b><b>{formatTime(duration)}</b></span>
      <input type="range" min="0" max={canSeek ? duration : 1} step="0.1" value={progress} disabled={!canSeek} onChange={(event) => seek(Number(event.target.value))} aria-label="Chọn đoạn nhạc" />
    </label>
    <label className="home-music-player__volume">
      <span aria-hidden="true">🔊</span><input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(event.target.value)} aria-label="Điều chỉnh âm lượng" />
    </label>
  </aside>
}

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rouletteScanning, setRouletteScanning] = useState(false)

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

  return <div className="home-page" data-roulette-scanning={rouletteScanning}>
    <section className="home-hero"><div className="home-hero-copy"><p>ẨM THỰC MỖI NGÀY</p><h1>Nấu món ngon, kể chuyện bếp nhà</h1><span>Khám phá công thức dễ làm từ cộng đồng và lưu lại cảm hứng cho bữa cơm tiếp theo.</span><div><Link href="/recipes">Khám phá công thức →</Link><Link className="home-hero-secondary" href="/recipes/new">Chia sẻ món của bạn</Link></div></div><HomeMusicPlayer /></section>
    {loading && <LoadingState label="Đang tải công thức mới…" />}
    {error && <ErrorState title="Không thể tải trang chủ" message={error} retry={load} />}
    {!loading && !error && <div className="home-layout">
      <aside className="home-sidebar"><div className="home-sidebar-head"><div><p>DANH MỤC</p><h2>Nấu gì hôm nay?</h2></div><Link href="/categories">Xem tất cả</Link></div>
        <FoodRoulette recipes={recipes} onScanningChange={setRouletteScanning} fallbackImage={fallbackImage} />
        <nav aria-label="Danh mục món ăn">{categories.slice(0, 12).map(category => <Link key={category.id} href={`/recipes?category=${category.id}`}><span>{category.name}</span><b>{category.publishedRecipeCount ?? category.recipeCount ?? 0}</b></Link>)}</nav>
        {!categories.length && <p className="home-muted">Chưa có danh mục để hiển thị.</p>}
      </aside>
      <main className="home-main"><div className="home-section-head"><div><p>CÔNG THỨC MỚI</p><h2>Món mới từ cộng đồng</h2></div><Link href="/recipes">Xem toàn bộ →</Link></div>
        {newestRecipes.length ? <div className="home-recipe-grid">{newestRecipes.map(recipe => <article key={recipe.id}><Link className="home-recipe-image" href={`/recipes/${recipe.id}`}><img src={recipe.imageUrl || fallbackImage} alt={recipe.title} /></Link><div className="home-recipe-content"><span>{recipe.categoryName || 'Món ngon mỗi ngày'}</span><h3><Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link></h3><p>{recipe.description || 'Khám phá nguyên liệu và cách chế biến chi tiết.'}</p><small>{recipe.cookingTimeMinutes ? `${recipe.cookingTimeMinutes} phút` : 'Xem cách nấu'} · {recipe.difficulty || 'Dễ làm'}</small></div></article>)}</div> : <EmptyState title="Chưa có công thức mới" message="Hãy quay lại sau hoặc chia sẻ công thức đầu tiên của bạn." actionLabel="Tạo công thức" onAction={() => { window.location.href = '/recipes/new' }} />}
      </main>
    </div>}
  </div>
}
