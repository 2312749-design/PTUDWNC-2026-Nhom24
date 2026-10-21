"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import Pagination from "@/components/common/pagination";
import RecipeCard from "@/components/common/recipe-card";
import { getCategories, getCategoryRecipes } from "@/lib/api";

const pageSize = 12;

export default function CategoryRecipes({ categoryId }: { categoryId: string }) {
  const [page, setPage] = useState(1);
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const recipesQuery = useQuery({
    queryKey: ["categories", categoryId, "recipes", page, pageSize],
    queryFn: () => getCategoryRecipes(categoryId, page, pageSize),
    enabled: /^[0-9a-f-]{36}$/i.test(categoryId),
  });
  const category = categoriesQuery.data?.data.find((item) => item.id === categoryId);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
      <Link href="/categories" className="text-sm font-semibold text-stone-500 hover:text-orange-700">
        ← Tất cả danh mục
      </Link>
      {categoriesQuery.isPending && <LoadingState message="Đang tải danh mục..." />}
      {categoriesQuery.isError && (
        <ErrorState
          message={categoriesQuery.error.message || "Không thể tải danh mục."}
          onRetry={() => void categoriesQuery.refetch()}
        />
      )}
      {categoriesQuery.isSuccess && !category && (
        <p className="mt-8 rounded-3xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
          Không tìm thấy danh mục.
        </p>
      )}
      {category && (
        <>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
            Danh mục món ăn
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">{category.description}</p>
          <section className="mt-8">
            {recipesQuery.isPending && <LoadingState message="Đang tải công thức..." />}
            {recipesQuery.isError && (
              <ErrorState
                message={recipesQuery.error.message || "Không thể tải công thức."}
                onRetry={() => void recipesQuery.refetch()}
              />
            )}
            {recipesQuery.data?.items.length === 0 && (
              <p className="rounded-3xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
                Danh mục này chưa có công thức được xuất bản.
              </p>
            )}
            {recipesQuery.data && recipesQuery.data.items.length > 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {recipesQuery.data.items.map((recipe, index) => (
                    <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                  ))}
                </div>
                <Pagination
                  page={recipesQuery.data.page}
                  totalPages={recipesQuery.data.totalPages}
                  totalCount={recipesQuery.data.totalCount}
                  isLoading={recipesQuery.isFetching}
                  onPageChange={setPage}
                />
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
}
