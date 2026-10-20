import PageClient from '../../PageClient'
import { ProtectedRoute } from '../../../src/RecipePages'
import CreateRecipeWizard from '../../../src/routes/wizard'
export default function Page() { return <PageClient><ProtectedRoute><CreateRecipeWizard /></ProtectedRoute></PageClient> }
