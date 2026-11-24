import Link from 'next/link'
import { publicContent } from './content-data'
import { RecipeCards } from './RecipeCatalog'
import '../src/home.css'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [categories, result] = await Promise.all([publicContent('/categories'), publicContent('/search/recipes?page=1&pageSize=9&sortBy=createdAt&sortOrder=desc')])
  const categoryItems = Array.isArray(categories) ? categories : []
  return <section className="home-page">
    <div className="home-hero"><div className="home-hero-copy"><p>ẨM THỰC MỖI NGÀY</p><h1>Nấu món ngon, chia sẻ câu chuyện bếp nhà</h1><span>Khám phá công thức theo danh mục, tìm kiếm nguyên liệu và theo dõi hướng dẫn từng bước.</span><div><Link href="/recipes">Khám phá công thức →</Link><Link href="/dashboard/recipes/new" className="home-hero-secondary">+ Chia sẻ công thức</Link></div></div></div>
    <form className="home-search" action="/search" method="get"><label htmlFor="home-query">Bạn muốn nấu món gì?</label><div><input id="home-query" name="q" maxLength="200" placeholder="Nhập đúng tên món ăn…" /><button type="submit">Tìm công thức</button></div></form>
    <nav className="home-quick-actions" aria-label="Chức năng chính"><Link href="/recipes"><strong>Công thức</strong><span>Xem, lọc và phân trang</span></Link><Link href="/categories"><strong>Danh mục</strong><span>Khám phá theo chủ đề</span></Link><Link href="/dashboard/recipes/new"><strong>Tạo công thức</strong><span>Thêm ảnh, nguyên liệu và bước nấu</span></Link><Link href="/dashboard"><strong>Dashboard</strong><span>Quản lý Draft · Published · Archived</span></Link></nav>
    <div className="home-layout"><aside className="home-sidebar"><div className="home-sidebar-head"><div><p>DANH MỤC</p><h2>Nấu gì hôm nay?</h2></div><Link href="/categories">Xem tất cả</Link></div><nav aria-label="Danh mục món ăn">{categoryItems.slice(0, 12).map(category => <Link key={category.id} href={`/categories/${category.slug || category.id}`}><span>{category.name}</span><b>{category.publishedRecipeCount ?? category.recipeCount ?? 0}</b></Link>)}</nav>{!categoryItems.length && <p>Chưa có danh mục để hiển thị.</p>}</aside><section className="home-main"><div className="home-section-head"><div><p>CÔNG THỨC MỚI</p><h2>Món mới từ cộng đồng</h2></div><Link href="/recipes">Xem tất cả →</Link></div>{result ? <RecipeCards items={result.items || []} /> : <p role="alert">Máy chủ công thức tạm thời chưa sẵn sàng. Vui lòng thử lại sau.</p>}</section></div>
    <section className="home-extensions"><div><p>TRẢI NGHIỆM MỞ RỘNG</p><h2>Nhiều hơn một cuốn sổ công thức</h2><span>Các tiện ích cộng đồng và trải nghiệm sáng tạo vẫn được giữ riêng, không làm khuất các chức năng chính của SRS.</span></div><Link href="/community">Khám phá cộng đồng →</Link></section>
  </section>
}
