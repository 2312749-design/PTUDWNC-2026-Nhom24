import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { publicContent } from '../../content-data'
import { encodeRouteSegment } from '../../../src/api/route-segment'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateStaticParams() {
  const categories = await publicContent('/categories')
  return Array.isArray(categories)
    ? categories.filter(category => category.slug).map(category => ({ slug: category.slug }))
    : []
}

async function getCategory(slug) {
  return publicContent(`/categories/${encodeRouteSegment(slug)}`)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const result = await getCategory(slug)
  return result?.category
    ? { title: result.category.name, description: result.category.description, alternates: { canonical: `/categories/${result.category.slug}` } }
    : { title: 'Danh mục', robots: { index: false } }
}

export default async function Page({ params }) {
  const { slug } = await params
  const result = await getCategory(slug)
  if (!result?.category) notFound()
  const { category, recipes = [] } = result

  return <main className="content-shell category-detail-page">
    <header className="page-header"><div><p className="eyebrow">DANH MỤC CÔNG THỨC</p><h1>{category.name}</h1><p>{category.description || 'Khám phá các công thức đã xuất bản trong danh mục này.'}</p></div><Link className="secondary-btn" href="/categories">Tất cả danh mục</Link></header>
    <p className="summary-chip">{recipes.length} công thức đã xuất bản</p>
    {recipes.length ? <section className="recipe-card-grid" aria-label={`Công thức thuộc ${category.name}`}>
      {recipes.map(recipe => <article className="recipe-card" key={recipe.id}>
        <Link href={`/recipes/${recipe.slug || recipe.id}`}>
          <div className="recipe-card-image">{recipe.imageUrl
            ? <Image src={recipe.imageUrl} alt={recipe.title} fill sizes="(max-width: 720px) 100vw, 33vw" unoptimized={/^https?:\/\/(localhost|127\.0\.0\.1):\d+\//.test(recipe.imageUrl) || /^https:\/\/(commons|upload)\.wikimedia\.org\//i.test(recipe.imageUrl)} />
            : <span>Chưa có ảnh</span>}</div>
          <div className="recipe-card-content"><p className="eyebrow">{category.name}</p><h2>{recipe.title}</h2><p>{recipe.description}</p><small>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} phút · {recipe.servings} khẩu phần</small></div>
        </Link>
      </article>)}
    </section> : <p className="empty-state">Danh mục chưa có công thức được xuất bản.</p>}
  </main>
}
