import PageClient from '../../PageClient'
import { ProtectedRoute, CategoriesPage } from '../../../src/RecipePages'

export const metadata = { title: 'Quản lý danh mục', robots: { index: false } }
export default function Page() { return <PageClient><ProtectedRoute><CategoriesPage /></ProtectedRoute></PageClient> }
