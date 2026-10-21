import CategoryRecipes from "@/app/categories/[id]/category-recipes";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryRecipes categoryId={id} />;
}
