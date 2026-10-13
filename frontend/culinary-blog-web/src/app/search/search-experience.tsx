"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
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
    <main className="min-h-screen bg-orange-50 text-gray-800">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            🍳 Culinary Blog
          </Link>
          <Link
            href="/"
            className="font-medium text-gray-600 hover:text-orange-600"
          >
            ← Về trang chủ
          </Link>
        </div>
      </header>

      <section className="bg-gradient-to-r from-orange-500 to-amber-400">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">
            Tìm kiếm công thức
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            Khám phá món ăn yêu thích từ kho công thức Culinary Blog.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-xl bg-white shadow-lg"
          >
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Bạn muốn nấu món gì hôm nay?"
              aria-label="Từ khóa tìm kiếm công thức"
              className="min-w-0 flex-1 px-5 py-4 text-gray-800 outline-none"
            />
            <button
              type="submit"
              disabled={query.isFetching}
              className="bg-gray-900 px-7 font-medium text-white hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60"
            >
              {query.isFetching ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </form>
          {keyword.trim().length === 1 && (
            <p role="alert" className="mt-3 text-sm text-white">
              Từ khóa tìm kiếm phải có ít nhất 2 ký tự.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold">
          {submittedKeyword
            ? `Kết quả cho “${submittedKeyword}”`
            : "Nhập từ khóa để tìm công thức"}
        </h2>

        {query.isPending && submittedKeyword.length >= 2 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">Đang tải kết quả...</p>
          </div>
        )}

        {query.isError && (
          <div role="alert" className="mt-8 rounded-xl bg-red-50 p-5 text-red-700">
            Không thể tìm kiếm công thức. Vui lòng thử lại.
          </div>
        )}

        {query.isSuccess && query.data.items.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">Không tìm thấy công thức nào.</p>
          </div>
        )}

        {query.data && query.data.items.length > 0 && (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {query.data.items.map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipes/${recipe.slug}`}
                  className="block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-48 items-center justify-center bg-orange-100 text-6xl">
                    🍲
                  </div>
                  <div className="p-5">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                      {recipe.status}
                    </span>
                    <h3 className="mt-3 text-xl font-bold">{recipe.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {recipe.description}
                    </p>
                    <div className="mt-4 flex justify-between border-t pt-4 text-sm text-gray-500">
                      <span>⏱ {recipe.cookTimeMinutes} phút</span>
                      <span>👥 {recipe.servings} người</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {query.data.totalPages > 1 && (
              <nav
                aria-label="Phân trang kết quả tìm kiếm"
                className="mt-8 flex items-center justify-center gap-4"
              >
                <button
                  type="button"
                  disabled={query.data.page <= 1 || query.isFetching}
                  onClick={() => setPage((currentPage) => currentPage - 1)}
                  className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trang trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {query.data.page} / {query.data.totalPages} ·{" "}
                  {query.data.totalCount} công thức
                </span>
                <button
                  type="button"
                  disabled={
                    query.data.page >= query.data.totalPages || query.isFetching
                  }
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                  className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trang sau
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
