import PageClient from '../../PageClient'
import { ProtectedRoute, RecipesPage } from '../../../src/RecipePages'

export const metadata = { title: 'Công thức của tôi', robots: { index: false } }
export default function Page() { return <PageClient><ProtectedRoute><RecipesPage /></ProtectedRoute></PageClient> }
