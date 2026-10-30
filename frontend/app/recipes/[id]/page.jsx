import PageClient from '../../PageClient'
import { RecipeDetailPage } from '../../../src/RecipePages'
import { publicContent } from '../../content-data'
import JsonLd from '../../JsonLd'
import { recipeJsonLd } from '../../../src/structured-data'
import { getSiteUrl } from '../../../src/api/config'

async function getRecipe(id) {
  return publicContent(/^[0-9a-f-]{36}$/i.test(id) ? `/recipes/${id}` : `/recipes/slug/${encodeURIComponent(id)}`)
}
export async function generateMetadata({ params }) {
  const { id } = await params
  const recipe = await getRecipe(id)
  return recipe ? { title: recipe.title, description: recipe.description, alternates: { canonical: `/recipes/${recipe.slug || recipe.id}` } } : { title: 'Công thức', robots: { index: false } }
}
export default async function Page({ params }) {
  const { id } = await params
  const recipe = await getRecipe(id)
  return <>{recipe && <JsonLd data={recipeJsonLd(recipe, getSiteUrl())} />}<PageClient><RecipeDetailPage /></PageClient></>
}
