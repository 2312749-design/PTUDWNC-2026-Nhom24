"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import Pagination from "@/components/common/pagination";
import RecipeCard from "@/components/common/recipe-card";
import { searchRecipes } from "@/lib/api";

const pageSize = 10;

export default function SearchExperience({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialQuery);
  const [submittedKeyword, setSubmittedKeyword] = useState(initialQuery.trim());
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["recipes", "search", submittedKeyword, page, pageSize],
    queryFn: () => searchRecipes(submittedKeyword, page, pageSize),
    enabled: submittedKeyword.length >= 2,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = keyword.trim();
    if (value.length < 2) {
      setSubmittedKeyword("");
      return;
    }

    setPage(1);
    setSubmittedKeyword(value);
    router.replace(`/search?q=${encodeURIComponent(value)}`, { scroll: false });
  }

  return (
    <main className="flex-1">
      <section className="bg-[#f8eee3]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-800">
              <Sparkles className="size-4" aria-hidden="true" />
              Tìm cảm hứng cho bữa ăn
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-stone-900 sm:text-5xl">
              Công thức dành cho bạn
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              Tìm món ăn yêu thích trong bộ sưu tập công thức từ cộng đồng Culinary.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-7 flex max-w-2xl items-center rounded-2xl border border-stone-200 bg-white p-2 shadow-lg shadow-orange-900/5 focus-within:border-orange-400"
            >
              <Search className="ml-3 size-5 shrink-0 text-stone-400" aria-hidden="true" />
              <input
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Ví dụ: phở bò, bánh xèo..."
                aria-label="Từ khóa tìm kiếm công thức"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-stone-800 outline-none placeholder:text-stone-400"
              />
              <button
                type="submit"
                disabled={query.isFetching}
                className="rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
              >
                {query.isFetching ? "Đang tìm..." : "Tìm kiếm"}
              </button>
            </form>
            {keyword.trim().length === 1 && (
              <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                Từ khóa tìm kiếm phải có ít nhất 2 ký tự.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
              {submittedKeyword ? "Kết quả tìm kiếm" : "Khám phá"}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">
              {submittedKeyword
                ? `Công thức cho “${submittedKeyword}”`
                : "Bắt đầu với món bạn yêu thích"}
            </h2>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-stone-500 transition hover:text-orange-700"
          >
            ← Về trang chủ
          </Link>
        </div>

        <div className="mt-8">
          {query.isPending && submittedKeyword.length >= 2 && (
            <LoadingState message="Đang tìm những công thức phù hợp..." />
          )}
          {query.isError && (
            <ErrorState
              message={query.error.message || "Không thể tìm kiếm công thức. Vui lòng thử lại."}
              onRetry={() => void query.refetch()}
            />
          )}
          {query.isSuccess && query.data.items.length === 0 && (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
              <span className="text-5xl" aria-hidden="true">🔎</span>
              <p className="mt-4 font-semibold text-stone-700">Chưa tìm thấy công thức phù hợp.</p>
              <p className="mt-1 text-sm text-stone-500">Thử một từ khóa khác ngắn gọn hơn nhé.</p>
            </div>
          )}
          {query.data && query.data.items.length > 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {query.data.items.map((recipe, index) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                ))}
              </div>
              <Pagination
                page={query.data.page}
                totalPages={query.data.totalPages}
                totalCount={query.data.totalCount}
                isLoading={query.isFetching}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
