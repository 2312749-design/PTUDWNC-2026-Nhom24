"use client";

import Link from "next/link";
import { ChefHat } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ErrorState from "@/components/common/error-state";
import LoadingState from "@/components/common/loading-state";
import { getCategories } from "@/lib/api";

export default function CategoriesPage() {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">Khám phá theo chủ đề</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
        Tất cả danh mục
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
        Chọn một danh mục để tìm những công thức phù hợp với bữa ăn của bạn.
      </p>
      <div className="mt-8">
        {categoriesQuery.isPending && <LoadingState message="Đang tải danh mục..." />}
        {categoriesQuery.isError && (
          <ErrorState
            message={categoriesQuery.error.message || "Không thể tải danh mục."}
            onRetry={() => void categoriesQuery.refetch()}
          />
        )}
        {categoriesQuery.isSuccess && categoriesQuery.data.data.length === 0 && (
          <p className="rounded-3xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
            Chưa có danh mục nào.
          </p>
        )}
        {categoriesQuery.data && categoriesQuery.data.data.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesQuery.data.data.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                  <ChefHat className="size-7" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-xl font-extrabold text-stone-900 group-hover:text-orange-700">
                  {category.name}
                </h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-stone-500">{category.description}</p>
                <p className="mt-4 text-xs font-bold text-orange-700">
                  {category.recipeCount} công thức
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
