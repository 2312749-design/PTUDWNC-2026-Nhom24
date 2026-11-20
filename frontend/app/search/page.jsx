import RecipeCatalog from '../RecipeCatalog'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tìm kiếm công thức' }
export default function Page({ searchParams }) { return <RecipeCatalog searchParams={searchParams} pathname="/search" /> }
