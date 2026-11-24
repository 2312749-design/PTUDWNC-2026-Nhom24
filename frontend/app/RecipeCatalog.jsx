import Link from 'next/link'
import Image from 'next/image'
import { publicContent } from './content-data'
import '../src/home.css'
import './catalog.css'

function paginationItems(currentPage, totalPages) {
  if (totalPages <= 17) return Array.from({ length: totalPages }, (_, index) => index + 1)

  const visible = new Set([1, totalPages])
  const windowStart = currentPage <= 8
    ? 2
    : currentPage >= totalPages - 7
      ? totalPages - 14
      : currentPage - 6
  const windowEnd = currentPage <= 8
    ? 15
    : currentPage >= totalPages - 7
      ? totalPages - 1
      : currentPage + 6
  for (let number = Math.max(2, windowStart); number <= Math.min(totalPages - 1, windowEnd); number += 1) visible.add(number)

  const sorted = [...visible].sort((left, right) => left - right)
  const items = []
  sorted.forEach((number, index) => {
    if (index > 0 && number - sorted[index - 1] > 1) items.push(`ellipsis-${number}`)
    items.push(number)
  })
  return items
}

export function RecipeCards({ items, catalog = false }) {
  return <div className={`home-recipe-grid${catalog ? ' catalog-recipe-grid' : ''}`}>{items.map(recipe => <article key={recipe.id}><Link className="home-recipe-image" href={`/recipes/${recipe.slug || recipe.id}`}>{recipe.imageUrl ? <Image src={recipe.imageUrl} alt={recipe.title} width={900} height={600} sizes={catalog ? '(max-width: 720px) 100vw, (max-width: 1100px) 33vw, 20vw' : '(max-width: 720px) 100vw, 33vw'} unoptimized={/^https?:\/\/(localhost|127\.0\.0\.1):\d+\//.test(recipe.imageUrl) || /^https:\/\/(commons|upload)\.wikimedia\.org\//i.test(recipe.imageUrl)} /> : <span>Chưa có ảnh</span>}</Link><div className="home-recipe-content"><span>{recipe.categoryName}</span><h2><Link href={`/recipes/${recipe.slug || recipe.id}`}>{recipe.title}</Link></h2><p>{recipe.description}</p><small>{recipe.cookingTimeMinutes || 0} phút · {recipe.servings || 1} khẩu phần</small></div></article>)}</div>
}

export default async function RecipeCatalog({ searchParams, pathname = '/recipes' }) {
  const params = await searchParams || {}
  const isSearchPage = pathname === '/search'
  const first = value => Array.isArray(value) ? value[0] : value || ''
  const q = isSearchPage ? first(params.q).slice(0, 200) : ''
  const categoryId = isSearchPage ? first(params.categoryId || params.category) : ''
  const difficulty = isSearchPage ? first(params.difficulty) : ''
  const sortBy = isSearchPage && ['createdAt', 'title', 'cookTimeMinutes'].includes(first(params.sortBy)) ? first(params.sortBy) : 'createdAt'
  const sortOrder = isSearchPage && first(params.sortOrder) === 'asc' ? 'asc' : 'desc'
  const maxMinutes = isSearchPage ? Number.parseInt(first(params.maxMinutes), 10) : Number.NaN
  const vegetarian = isSearchPage && first(params.vegetarian) === 'true'
  const page = Math.min(100000, Math.max(1, Number.parseInt(first(params.page), 10) || 1))
  const pageSize = 30
  const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize), sortBy, sortOrder })
  if (Number.isFinite(maxMinutes) && maxMinutes > 0 && maxMinutes <= 2880) query.set('maxMinutes', String(maxMinutes))
  if (vegetarian) query.set('vegetarian', 'true')
  if (q) query.set('q', q)
  if (/^[0-9a-f-]{36}$/i.test(categoryId)) query.set('categoryId', categoryId)
  if (['Easy', 'Medium', 'Hard', 'Expert'].includes(difficulty)) query.set('difficulty', difficulty)
  const [result, categories] = await Promise.all([publicContent(`/search/recipes?${query}`), publicContent('/categories')])
  const items = result?.items || []
  const total = result?.totalCount ?? result?.total ?? 0
  const pages = result?.totalPages ?? Math.ceil(total / pageSize)
  const pageLink = next => { const copy = new URLSearchParams(query); copy.set('page', String(next)); return `${pathname}?${copy}` }
  return <section className="home-page"><header className="page-header"><div><h1>{isSearchPage ? 'Tìm kiếm công thức' : 'Tất cả công thức'}</h1><p>{isSearchPage ? 'Nhập tên món và kết hợp các bộ lọc để tìm đúng công thức bạn cần.' : 'Duyệt toàn bộ món ăn đã xuất bản, sắp xếp từ công thức mới nhất.'}</p></div><Link className="share-recipe-cta" href="/dashboard/recipes/new"><span>＋</span><strong>Chia sẻ công thức</strong><small>Đăng món ngon của bạn</small></Link></header>
    {isSearchPage ? <form action={pathname} method="get" className="catalog-filters"><label>Từ khóa<input name="q" defaultValue={q} placeholder="Nhập đúng tên món ăn…" maxLength={200} /></label><label>Danh mục<select name="categoryId" defaultValue={categoryId}><option value="">Tất cả danh mục</option>{(Array.isArray(categories) ? categories : []).map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Độ khó<select name="difficulty" defaultValue={difficulty}><option value="">Mọi độ khó</option><option value="Easy">Dễ</option><option value="Medium">Trung bình</option><option value="Hard">Khó</option><option value="Expert">Chuyên gia</option></select></label><label>Sắp xếp<select name="sortBy" defaultValue={sortBy}><option value="createdAt">Mới nhất</option><option value="title">Tên món</option><option value="cookTimeMinutes">Thời gian nấu</option></select></label><label>Thời gian tối đa (phút)<input name="maxMinutes" type="number" min="1" max="2880" defaultValue={Number.isFinite(maxMinutes) ? maxMinutes : ''} /></label><label>Chế độ ăn<select name="vegetarian" defaultValue={vegetarian ? 'true' : ''}><option value="">Tất cả</option><option value="true">Món chay thuần thực vật</option></select></label><label>Thứ tự<select name="sortOrder" defaultValue={sortOrder}><option value="desc">Giảm dần</option><option value="asc">Tăng dần</option></select></label><button type="submit">Tìm kiếm</button><Link href={pathname}>Xóa bộ lọc</Link></form> : <div className="catalog-browse-bar"><div><strong>Kho công thức Bếp Nhà</strong><span>Chọn Tìm kiếm khi bạn cần lọc chính xác theo tên món, danh mục, độ khó hoặc thời gian.</span></div><Link href="/search">Tìm và lọc công thức →</Link></div>}
    {!result ? <p role="alert">Chưa kết nối được máy chủ. Vui lòng tải lại trang sau ít phút.</p> : <><p>{total} công thức · Trang {page}{pages > 0 ? ` / ${pages}` : ''}</p>{items.length ? <RecipeCards items={items} catalog /> : <p>Không có công thức phù hợp. Hãy thử từ khóa hoặc danh mục khác.</p>}<nav className="catalog-pagination" aria-label="Phân trang công thức"><Link className={`pagination-direction${page <= 1 ? ' is-disabled' : ''}`} href={page > 1 ? pageLink(page - 1) : pageLink(1)} aria-disabled={page <= 1}>← Trước</Link><div className="pagination-pages">{paginationItems(page, pages).map(item => typeof item === 'number' ? <Link key={item} href={pageLink(item)} className={item === page ? 'is-current' : ''} aria-current={item === page ? 'page' : undefined}>{item}</Link> : <span className="pagination-ellipsis" key={item} aria-hidden="true">…</span>)}</div><Link className={`pagination-direction${page >= pages ? ' is-disabled' : ''}`} href={page < pages ? pageLink(page + 1) : pageLink(Math.max(1, pages))} aria-disabled={page >= pages}>Sau →</Link></nav></>}
  </section>
}
