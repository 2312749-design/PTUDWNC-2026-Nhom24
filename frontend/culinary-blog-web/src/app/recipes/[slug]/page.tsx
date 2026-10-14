import Link from "next/link";
import { ArrowLeft, Clock3, CookingPot, UsersRound } from "lucide-react";
import { getRecipeBySlug } from "@/lib/api";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data } = await getRecipeBySlug(slug);
  const { recipe, ingredients, steps } = data;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-orange-700"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Khám phá thêm công thức
      </Link>

      <article className="mt-6 overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
        <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 sm:min-h-80">
          <span className="absolute -left-10 -top-20 size-64 rounded-full border-[36px] border-white/40" aria-hidden="true" />
          <span className="absolute -bottom-20 -right-12 size-72 rounded-full bg-white/30" aria-hidden="true" />
          <span className="relative text-9xl drop-shadow-lg" aria-hidden="true">🍲</span>
          <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-800 shadow-sm">
            {recipe.status}
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
            Công thức từ cộng đồng Culinary
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-stone-900 sm:text-5xl">
            {recipe.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-stone-600">
            {recipe.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Clock3, label: "Thời gian nấu", value: `${recipe.cookTimeMinutes} phút` },
              { icon: UsersRound, label: "Khẩu phần", value: `${recipe.servings} người` },
              { icon: CookingPot, label: "Độ khó", value: recipe.difficulty },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-[#fbf7f1] p-5">
                <Icon className="size-5 text-orange-700" aria-hidden="true" />
                <p className="mt-4 text-xs font-medium text-stone-500">{label}</p>
                <p className="mt-1 font-bold text-stone-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <div className="mt-6 grid gap-6 md:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
            Chuẩn bị
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-stone-900">Nguyên liệu</h2>
          {ingredients.length === 0 ? (
            <p className="mt-5 text-sm text-stone-500">Chưa có nguyên liệu được cập nhật.</p>
          ) : (
            <ul className="mt-6 divide-y divide-stone-100">
              {ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-center justify-between gap-4 py-3.5">
                  <span className="text-sm font-medium text-stone-700">{ingredient.name}</span>
                  <span className="shrink-0 text-sm text-stone-500">
                    {ingredient.quantity ?? ""} {ingredient.unit ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
            Cùng vào bếp
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-stone-900">Cách thực hiện</h2>
          {steps.length === 0 ? (
            <p className="mt-5 text-sm text-stone-500">Chưa có hướng dẫn cho công thức này.</p>
          ) : (
            <ol className="mt-6 space-y-6">
              {steps.map((step) => (
                <li key={step.id} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-extrabold text-orange-800">
                    {step.stepNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-stone-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{step.description}</p>
                    {step.timerMinutes !== null && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700">
                        <Clock3 className="size-3.5" aria-hidden="true" />
                        {step.timerMinutes} phút
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}
