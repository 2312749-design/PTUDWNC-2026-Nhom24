import PageClient from '../../../PageClient'
import { ProtectedRoute } from '../../../../src/RecipePages'
import CreateRecipeWizard from '../../../../src/routes/wizard'

export const metadata = { title: 'Tạo công thức', robots: { index: false } }
export default function Page() { return <PageClient><ProtectedRoute><CreateRecipeWizard /></ProtectedRoute></PageClient> }
