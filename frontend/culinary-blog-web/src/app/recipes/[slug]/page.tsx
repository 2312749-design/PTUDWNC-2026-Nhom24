type Recipe = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  status: string;
};

type Ingredient = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  notes: string | null;
  orderIndex: number;
};

type Step = {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  timerMinutes: number | null;
  imageUrl: string | null;
};

type RecipeDetailResponse = {
  data: {
    recipe: Recipe;
    ingredients: Ingredient[];
    steps: Step[];
  };
};

async function getRecipeBySlug(
  slug: string
): Promise<RecipeDetailResponse> {
  const response = await fetch(
    `http://localhost:5217/api/v1/recipes/slug/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Không tìm thấy công thức");
  }

  return response.json();
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await getRecipeBySlug(slug);
  const { recipe, ingredients, steps } = result.data;

  return (
    <main className="min-h-screen bg-orange-50 text-gray-800">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="text-2xl font-bold text-orange-600"
          >
            🍳 Culinary Blog
          </a>

          <a
            href="/"
            className="font-medium text-gray-600 hover:text-orange-600"
          >
            ← Về trang chủ
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex h-72 items-center justify-center bg-orange-100 text-8xl">
            🍲
          </div>

          <div className="p-8">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
              {recipe.status}
            </span>

            <h1 className="mt-4 text-4xl font-bold text-gray-900">
              {recipe.title}
            </h1>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              {recipe.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-orange-50 p-5">
                <p className="text-sm text-gray-500">
                  Thời gian
                </p>
                <p className="mt-1 text-xl font-bold">
                  ⏱ {recipe.cookTimeMinutes} phút
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-5">
                <p className="text-sm text-gray-500">
                  Khẩu phần
                </p>
                <p className="mt-1 text-xl font-bold">
                  👥 {recipe.servings} người
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-5">
                <p className="text-sm text-gray-500">
                  Độ khó
                </p>
                <p className="mt-1 text-xl font-bold">
                  ⭐ {recipe.difficulty}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            🥕 Nguyên liệu
          </h2>

          {ingredients.length === 0 ? (
            <p className="mt-5 text-gray-500">
              Chưa có nguyên liệu.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <span className="font-medium">
                    {ingredient.name}
                  </span>

                  <span className="text-gray-600">
                    {ingredient.quantity ?? ""}{" "}
                    {ingredient.unit ?? ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">
            👨‍🍳 Các bước thực hiện
          </h2>

          {steps.length === 0 ? (
            <p className="mt-5 text-gray-500">
              Chưa có bước thực hiện.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex gap-5 border-b pb-6 last:border-b-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                    {step.stepNumber}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      {step.title}
                    </h3>

                    <p className="mt-2 leading-7 text-gray-600">
                      {step.description}
                    </p>

                    {step.timerMinutes !== null && (
                      <p className="mt-3 text-sm font-medium text-orange-600">
                        ⏱ Thời gian: {step.timerMinutes} phút
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}