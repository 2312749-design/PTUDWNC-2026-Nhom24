"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { changeRecipeStatus, getMyRecipes } from "@/lib/api";
import { ApiClientError } from "@/lib/api-error";
import { useAuthStore } from "@/lib/auth-store";

export default function RecipeManagementPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState("");
  const recipesQuery = useQuery({
    queryKey: ["studio", "recipes"],
    queryFn: () => {
      if (!accessToken) throw new Error("Bạn cần đăng nhập.");
      return getMyRecipes(accessToken);
    },
    enabled: Boolean(accessToken),
  });

  async function changeStatus(recipeId: string, status: string) {
    if (!accessToken) return;
    setActionError("");
    try {
      await changeRecipeStatus(recipeId, status, accessToken);
      await queryClient.invalidateQueries({ queryKey: ["studio", "recipes"] });
    } catch (error) {
      setActionError(error instanceof ApiClientError ? error.message : "Không thể thay đổi trạng thái.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">Không gian tác giả</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">Công thức của tôi</h1>
        </div>
        <Link href="/studio/recipes/new" className="rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-700">+ Thêm công thức</Link>
      </div>

      {!accessToken && (
        <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 text-center">
          <p className="font-semibold text-stone-800">Đăng nhập để quản lý công thức của bạn.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white">Đăng nhập</Link>
        </section>
      )}
      {actionError && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</p>}
      {recipesQuery.isPending && accessToken && <p className="mt-8 text-sm text-stone-500">Đang tải công thức...</p>}
      {recipesQuery.isError && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{recipesQuery.error instanceof ApiClientError ? recipesQuery.error.message : "Không thể tải danh sách công thức."}</p>}
      {recipesQuery.data && recipesQuery.data.data.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500">
          Bạn chưa có công thức nào. Hãy bắt đầu chia sẻ món ăn yêu thích.
        </div>
      )}
      {recipesQuery.data && recipesQuery.data.data.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="divide-y divide-stone-100">
            {recipesQuery.data.data.map((recipe) => (
              <article key={recipe.id} className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="truncate text-lg font-bold text-stone-900">{recipe.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${recipe.status === "Published" ? "bg-emerald-50 text-emerald-800" : recipe.status === "Deleted" ? "bg-red-50 text-red-800" : "bg-stone-100 text-stone-700"}`}>{recipe.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">Cập nhật {new Date(recipe.updatedAt).toLocaleDateString("vi-VN")}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {recipe.status !== "Deleted" && <Link href={`/studio/recipes/${recipe.id}`} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700 hover:border-orange-400 hover:text-orange-700">Chỉnh sửa</Link>}
                  {(recipe.status === "Draft" || recipe.status === "Archived") && <button type="button" onClick={() => void changeStatus(recipe.id, "Published")} className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white">Xuất bản</button>}
                  {recipe.status === "Published" && <button type="button" onClick={() => void changeStatus(recipe.id, "Archived")} className="rounded-full border border-stone-300 px-4 py-2 text-xs font-bold text-stone-700">Lưu trữ</button>}
                  {recipe.status !== "Deleted" && <button type="button" onClick={() => {
                    if (window.confirm("Chuyển công thức vào thùng rác?")) void changeStatus(recipe.id, "Deleted");
                  }} className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700">Xóa</button>}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
