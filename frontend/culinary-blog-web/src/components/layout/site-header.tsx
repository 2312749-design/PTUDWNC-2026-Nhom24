"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, Menu, UtensilsCrossed } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const navigation = [
  { href: "/", label: "Trang chủ" },
  { href: "/search", label: "Công thức" },
  { href: "/#categories", label: "Danh mục" },
  { href: "/#about", label: "Giới thiệu" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#fffdf9]/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Culinary Blog, trang chủ">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-md shadow-orange-200">
            <UtensilsCrossed className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-stone-900 sm:text-xl">
            culinary<span className="text-orange-600">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Điều hướng chính">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                (item.href === "/" && pathname === "/") ||
                (item.href === "/search" && pathname.startsWith("/search"))
                  ? "page"
                  : undefined
              }
              className={`text-sm font-semibold transition ${
                (item.href === "/" && pathname === "/") ||
                (item.href === "/search" && pathname.startsWith("/search"))
                  ? "text-orange-700"
                  : "text-stone-600 hover:text-orange-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm font-semibold text-stone-700 sm:inline">
                Xin chào, {user.displayName}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-700"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              <LogIn className="size-4" aria-hidden="true" />
              Đăng nhập
            </Link>
          )}
          <details className="relative md:hidden">
            <summary
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-stone-200 text-stone-700"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="size-5" aria-hidden="true" />
            </summary>
            <nav className="absolute right-0 top-12 flex w-48 flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-orange-50 hover:text-orange-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
