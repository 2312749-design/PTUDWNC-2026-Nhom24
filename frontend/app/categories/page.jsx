import Image from 'next/image'
import Link from 'next/link'
import { publicContent } from '../content-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const categories = await publicContent('/categories')
  const items = Array.isArray(categories) ? categories : []
  return <section className="content-shell category-gallery-page"><header className="page-header"><div><p className="eyebrow">KHÁM PHÁ THEO CHỦ ĐỀ</p><h1>Danh mục món ăn</h1><p>Chọn một danh mục để xem các công thức đã xuất bản phù hợp.</p></div><Link href="/recipes">Xem tất cả công thức</Link></header><div className="category-card-grid">{items.map(category => <article className="category-tile" key={category.id}><Link className="category-gallery-link" href={`/categories/${category.slug || category.id}`}><div className="category-tile-image">{category.imageUrl ? <Image src={category.imageUrl} alt={`Ảnh minh họa ${category.name}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw" /> : <span>Chưa có ảnh</span>}</div><div className="category-tile-content"><p className="category-gallery-label">DANH MỤC</p><h2>{category.name}</h2><p>{category.description || 'Khám phá các món ngon thuộc danh mục này.'}</p><span>{category.publishedRecipeCount ?? category.recipeCount ?? 0} công thức <b aria-hidden="true">→</b></span></div></Link></article>)}</div>{!categories && <p role="alert">Chưa tải được danh mục. Vui lòng thử lại sau.</p>}{categories && !items.length && <p>Chưa có danh mục công khai.</p>}</section>
}
