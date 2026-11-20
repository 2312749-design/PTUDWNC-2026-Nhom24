import { publicContent } from '../../content-data'
import JsonLd from '../../JsonLd'
import { recipeJsonLd } from '../../../src/structured-data'
import { getSiteUrl } from '../../../src/api/config'
import { notFound } from 'next/navigation'
import RecipeServerDetails from './RecipeServerDetails.jsx'
import { encodeRouteSegment } from '../../../src/api/route-segment'

async function getRecipe(id) {
  return publicContent(
    /^[0-9a-f-]{36}$/i.test(id) ? `/recipes/${id}` : `/recipes/slug/${encodeRouteSegment(id)}`,
    { revalidate: 0 },
  )
}
export const dynamic = 'force-dynamic'
export const revalidate = 0
export async function generateStaticParams() {
  const recipes = await publicContent('/recipes')
  return Array.isArray(recipes)
    ? recipes.filter(recipe => recipe.slug || recipe.id).map(recipe => ({ id: recipe.slug || recipe.id }))
    : []
}
export async function generateMetadata({ params }) {
  const { id } = await params
  const recipe = await getRecipe(id)
  return recipe ? { title: recipe.title, description: recipe.description, alternates: { canonical: `/recipes/${recipe.slug || recipe.id}` } } : { title: 'Công thức', robots: { index: false } }
}
export default async function Page({ params }) {
  const { id } = await params
  const recipe = await getRecipe(id)
  if (!recipe) notFound()
  return <><JsonLd data={recipeJsonLd(recipe, getSiteUrl())} /><RecipeServerDetails recipe={recipe} /></>
}
