import RecipeEditor from "@/app/studio/recipes/recipe-editor";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <RecipeEditor recipeId={id} />
    </main>
  );
}
