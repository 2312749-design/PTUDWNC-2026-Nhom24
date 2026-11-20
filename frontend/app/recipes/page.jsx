import RecipeCatalog from '../RecipeCatalog'

export const dynamic = 'force-dynamic'
export default function Page({ searchParams }) { return <RecipeCatalog searchParams={searchParams} /> }
