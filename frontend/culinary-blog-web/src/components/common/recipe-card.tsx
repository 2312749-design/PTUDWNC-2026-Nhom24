import Link from "next/link";
import { Clock3, UsersRound } from "lucide-react";
import type { Recipe } from "@/types/recipe";

const cardAccents = [
  "from-orange-100 via-amber-50 to-rose-100",
  "from-lime-100 via-emerald-50 to-yellow-100",
  "from-rose-100 via-orange-50 to-amber-100",
  "from-yellow-100 via-orange-50 to-red-100",
];

export default function RecipeCard({
  recipe,
  index = 0,
}: {
  recipe: Recipe;
  index?: number;
}) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600"
    >
      <div
        className={`relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br ${cardAccents[index % cardAccents.length]}`}
      >
        <span
          className="absolute -right-7 -top-10 size-40 rounded-full border-[22px] border-white/35"
          aria-hidden="true"
        />
        <span
          className="absolute -bottom-12 -left-8 size-36 rounded-full bg-white/35"
          aria-hidden="true"
        />
        <span
          className="relative text-7xl drop-shadow-sm transition duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          🍲
        </span>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-800 shadow-sm">
          {recipe.status}
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 min-h-14 text-lg font-bold leading-7 text-stone-900 group-hover:text-orange-700">
          {recipe.title}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-stone-500">
          {recipe.description}
        </p>
        <div className="mt-5 flex items-center gap-5 border-t border-stone-100 pt-4 text-xs font-medium text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-4 text-orange-600" aria-hidden="true" />
            {recipe.cookTimeMinutes} phút
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersRound className="size-4 text-orange-600" aria-hidden="true" />
            {recipe.servings} người
          </span>
        </div>
      </div>
    </Link>
  );
}
