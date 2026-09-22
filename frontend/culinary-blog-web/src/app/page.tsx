"use client";

import { useEffect, useState } from "react";
import { getRecipes, searchRecipes } from "@/lib/api";

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

export default function Home() {
const [recipes, setRecipes] = useState<Recipe[]>([]);
const [keyword, setKeyword] = useState("");
const [loading, setLoading] = useState(true);
const [searching, setSearching] = useState(false);
const [error, setError] = useState("");

// Lấy danh sách công thức khi mở trang
useEffect(() => {
async function loadRecipes() {
try {
setLoading(true);

    const result = await getRecipes();

    setRecipes(result.data ?? []);
  } catch (err) {
    console.error(err);
    setError("Không thể tải danh sách công thức.");
  } finally {
    setLoading(false);
  }
}

loadRecipes();

}, []);

// Tìm kiếm công thức
async function handleSearch() {
const value = keyword.trim();

if (!value) {
  try {
    setLoading(true);
    setError("");

    const result = await getRecipes();

    setRecipes(result.data ?? []);
  } catch (err) {
    console.error(err);
    setError("Không thể tải danh sách công thức.");
  } finally {
    setLoading(false);
  }

  return;
}

if (value.length < 2) {
  setError("Từ khóa tìm kiếm phải có ít nhất 2 ký tự.");
  return;
}

try {
  setSearching(true);
  setError("");

  const result = await searchRecipes(value, 1, 10);

  setRecipes(result.data ?? []);
} catch (err) {
  console.error(err);
  setError("Không thể tìm kiếm công thức.");
} finally {
  setSearching(false);
}

}

// Nhấn Enter để tìm kiếm
function handleKeyDown(
event: React.KeyboardEvent<HTMLInputElement>
) {
if (event.key === "Enter") {
handleSearch();
}
}

return (
<main className="min-h-screen bg-orange-50 text-gray-800">
{/* Header */}
<header className="border-b bg-white">
<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
<div className="text-2xl font-bold text-orange-600">
🍳 Culinary Blog
</div>

      <nav className="hidden gap-8 md:flex">
        <a
          href="#"
          className="font-medium text-orange-600"
        >
          Trang chủ
        </a>

        <a
          href="#"
          className="text-gray-600 hover:text-orange-600"
        >
          Công thức
        </a>

        <a
          href="#"
          className="text-gray-600 hover:text-orange-600"
        >
          Danh mục
        </a>

        <a
          href="#"
          className="text-gray-600 hover:text-orange-600"
        >
          Giới thiệu
        </a>
      </nav>

      <button className="rounded-lg bg-orange-500 px-5 py-2 font-medium text-white hover:bg-orange-600">
        Đăng nhập
      </button>
    </div>
  </header>

  {/* Hero */}
  <section className="bg-gradient-to-r from-orange-500 to-amber-400">
    <div className="mx-auto max-w-7xl px-6 py-20 text-center text-white">
      <h1 className="text-4xl font-bold md:text-6xl">
        Khám phá thế giới ẩm thực
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-lg">
        Tìm kiếm công thức nấu ăn ngon, đơn giản và phù hợp với bạn.
      </p>

      {/* Search */}
      <div className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-xl bg-white shadow-lg">
        <input
          type="text"
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="Bạn muốn nấu món gì hôm nay?"
          className="flex-1 px-5 py-4 text-gray-800 outline-none"
        />

        <button
          onClick={handleSearch}
          disabled={searching}
          className="bg-gray-900 px-7 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {searching ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>
    </div>
  </section>

  {/* Categories */}
  <section className="mx-auto max-w-7xl px-6 py-12">
    <h2 className="text-3xl font-bold">
      Khám phá danh mục
    </h2>

    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      {[
        "Món Việt",
        "Món chính",
        "Món ăn sáng",
        "Tráng miệng",
      ].map((category) => (
        <div
          key={category}
          className="cursor-pointer rounded-xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="text-3xl">🍽️</div>

          <p className="mt-3 font-semibold">
            {category}
          </p>
        </div>
      ))}
    </div>
  </section>

  {/* Recipes */}
  <section className="mx-auto max-w-7xl px-6 pb-16">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold">
        {keyword.trim()
          ? `Kết quả tìm kiếm: "${keyword}"`
          : "Công thức mới nhất"}
      </h2>

      <button className="font-medium text-orange-600 hover:text-orange-700">
        Xem tất cả →
      </button>
    </div>

    {/* Error */}
    {error && (
      <div className="mt-6 rounded-xl bg-red-50 p-4 text-center text-red-600">
        {error}
      </div>
    )}

    {/* Loading */}
    {loading ? (
      <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">
          Đang tải công thức...
        </p>
      </div>
    ) : recipes.length === 0 ? (
      <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">
          Không tìm thấy công thức nào.
        </p>
      </div>
    ) : (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <a
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

              <h3 className="mt-3 text-xl font-bold">
                {recipe.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {recipe.description}
              </p>

              <div className="mt-4 flex justify-between border-t pt-4 text-sm text-gray-500">
                <span>
                  ⏱ {recipe.cookTimeMinutes} phút
                </span>

                <span>
                  👥 {recipe.servings} người
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    )}
  </section>

  {/* Footer */}
  <footer className="bg-gray-900 text-white">
    <div className="mx-auto max-w-7xl px-6 py-10 text-center">
      <h2 className="text-xl font-bold">
        🍳 Culinary Blog
      </h2>

      <p className="mt-3 text-gray-400">
        Chia sẻ công thức, khám phá hương vị và cùng nhau nấu ăn.
      </p>

      <p className="mt-6 text-sm text-gray-500">
        © 2026 Culinary Blog. All rights reserved.
      </p>
    </div>
  </footer>
</main>

);
}