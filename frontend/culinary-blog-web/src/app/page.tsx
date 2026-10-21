"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Clock3,
  Search,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import RecipeCard from "@/components/common/recipe-card";
import { getCategories, getRecipes } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [validationError, setValidationError] = useState("");
  const recipesQuery = useQuery({
    queryKey: ["recipes", "latest"],
    queryFn: getRecipes,
  });
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = keyword.trim();
    if (value.length < 2) {
      setValidationError("Hãy nhập ít nhất 2 ký tự để tìm công thức.");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  return (
    <main className="flex-1">
      <section className="relative isolate overflow-hidden bg-[#f8eee3]">
        <div className="absolute -right-28 -top-32 -z-10 size-[34rem] rounded-full border-[70px] border-orange-200/30" />
        <div className="absolute -bottom-52 -left-32 -z-10 size-[30rem] rounded-full bg-amber-200/25 blur-2xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-800">
              <Sparkles className="size-4" aria-hidden="true" />
              Món ngon bắt đầu từ đây
            </p>
            <h1 className="mt-6 text-5xl font-black leading-[1.08] tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
              Nấu ngon hơn,
              <span className="mt-1 block font-serif font-medium italic text-orange-700">
                sống vui hơn.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              Khám phá những công thức gần gũi, dễ làm và đầy cảm hứng — được
              chia sẻ bởi những người yêu căn bếp như bạn.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-xl items-center rounded-2xl border border-stone-200 bg-white p-2 shadow-xl shadow-orange-900/5 focus-within:border-orange-400"
            >
              <Search className="ml-3 size-5 shrink-0 text-stone-400" aria-hidden="true" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setValidationError("");
                }}
                aria-label="Tìm kiếm công thức"
                placeholder="Hôm nay bạn muốn nấu món gì?"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-700 sm:px-5"
              >
                Tìm món
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </form>
            {validationError && (
              <p role="alert" className="mt-2 text-sm font-medium text-red-700">
                {validationError}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Được yêu thích:</span>
              {["phở bò", "món chay", "bánh ngọt"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full bg-white/80 px-3 py-1.5 transition hover:text-orange-700"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] bg-orange-200/60" />
            <div className="relative overflow-hidden rounded-[2.2rem] border-[10px] border-white bg-gradient-to-br from-amber-200 via-orange-100 to-rose-200 p-6 shadow-2xl shadow-orange-950/10 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-orange-900">
                  Món ngon mỗi ngày
                </span>
                <span className="flex size-11 items-center justify-center rounded-full bg-white text-orange-700 shadow-sm">
                  <ChefHat className="size-5" aria-hidden="true" />
                </span>
              </div>
              <div className="flex min-h-[300px] items-center justify-center sm:min-h-[350px]">
                <span className="select-none text-[10rem] drop-shadow-xl sm:text-[12rem]" aria-hidden="true">
                  🍲
                </span>
              </div>
              <div className="rounded-2xl bg-white/85 p-5 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-700">
                      Công thức nổi bật
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-stone-900">
                      Ấm áp từ căn bếp nhà
                    </p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs font-medium text-stone-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="size-4 text-orange-600" aria-hidden="true" />
                    Dễ làm mỗi ngày
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Utensils className="size-4 text-orange-600" aria-hidden="true" />
                    Nguyên liệu thân quen
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
              Chọn theo khẩu vị
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Hôm nay ăn gì nhỉ?
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-700 transition hover:text-orange-900"
          >
            Xem tất cả
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {categoriesQuery.isPending && <LoadingState message="Đang tải danh mục..." />}
        {categoriesQuery.isError && (
          <ErrorState
            message={categoriesQuery.error.message || "Không thể tải danh mục."}
            onRetry={() => void categoriesQuery.refetch()}
          />
        )}
        {categoriesQuery.isSuccess && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesQuery.data.data.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-900/5"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-3xl transition group-hover:scale-105">
                <ChefHat className="size-7 text-orange-700" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold text-stone-900">{category.name}</span>
                <span className="mt-1 block text-xs leading-5 text-stone-500">{category.description}</span>
              </span>
            </Link>
          ))}
        </div>
        )}
      </section>

      <section className="bg-[#f7f4ef]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-700">
                Từ cộng đồng của chúng ta
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
                Mới nhất trong căn bếp
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-700 transition hover:text-orange-900"
            >
              Khám phá công thức
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-9 grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="h-fit rounded-3xl border border-stone-200 bg-white p-5">
              <h3 className="font-extrabold text-stone-900">Danh mục món ăn</h3>
              {categoriesQuery.isPending && (
                <p className="mt-4 text-sm text-stone-500">Đang tải...</p>
              )}
              {categoriesQuery.isError && (
                <p className="mt-4 text-sm text-red-700">Không thể tải danh mục.</p>
              )}
              {categoriesQuery.data && (
                <ul className="mt-3 space-y-1">
                  {categoriesQuery.data.data.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${category.id}`}
                        className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-orange-50 hover:text-orange-800"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs text-stone-400">{category.recipeCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/categories" className="mt-4 block border-t border-stone-100 pt-4 text-sm font-bold text-orange-700 hover:text-orange-900">
                Xem tất cả danh mục
              </Link>
            </aside>
            <div>
            {recipesQuery.isPending && <LoadingState message="Đang chuẩn bị những công thức mới nhất..." />}
            {recipesQuery.isError && (
              <ErrorState
                message={recipesQuery.error.message || "Không thể tải danh sách công thức."}
                onRetry={() => void recipesQuery.refetch()}
              />
            )}
            {recipesQuery.isSuccess && recipesQuery.data.data.length === 0 && (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <span className="text-5xl" aria-hidden="true">🥣</span>
                <p className="mt-4 font-semibold text-stone-700">Chưa có công thức nào được chia sẻ.</p>
              </div>
            )}
            {recipesQuery.isSuccess && recipesQuery.data.data.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {recipesQuery.data.data.slice(0, 4).map((recipe, index) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="flex flex-col items-start justify-between gap-7 rounded-[2rem] bg-stone-900 px-7 py-9 text-white sm:px-10 sm:py-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
              Cùng nhau vào bếp
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Mỗi món ăn đều có một câu chuyện.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">
              Tìm cảm hứng cho bữa ăn tiếp theo, hoặc đăng nhập để bắt đầu chia sẻ
              bí quyết của riêng bạn.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-orange-400"
          >
            Bắt đầu khám phá
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
