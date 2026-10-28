"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminUsers, type AdminUser } from "@/lib/api";
import { ApiClientError } from "@/lib/api-error";
import { useAuthStore } from "@/lib/auth-store";

export default function AdminUsersPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState<"Admin" | "Author" | "">("");
  const usersQuery = useQuery({
    queryKey: ["admin", "users", page, role],
    queryFn: () => {
      if (!accessToken) throw new Error("Bạn cần đăng nhập bằng tài khoản quản trị.");
      return getAdminUsers(accessToken, page, 20, role || undefined);
    },
    enabled: Boolean(accessToken && user?.role === "Admin"),
  });

  if (!accessToken || user?.role !== "Admin") {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-5 py-16">
        <section className="w-full rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-stone-900">Chỉ dành cho quản trị viên</h1>
          <p className="mt-2 text-sm text-stone-500">Tài khoản hiện tại không có quyền xem danh sách người dùng.</p>
          <Link href="/" className="mt-5 inline-flex rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white">Về trang chủ</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">Quản trị hệ thống</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">Danh sách người dùng</h1>
        </div>
        <label className="text-sm font-semibold text-stone-700">
          Vai trò
          <select value={role} onChange={(event) => {
            setRole(event.target.value as "Admin" | "Author" | "");
            setPage(1);
          }} className="ml-3 rounded-xl border border-stone-200 bg-white px-4 py-2.5">
            <option value="">Tất cả</option>
            <option value="Admin">Quản trị viên</option>
            <option value="Author">Tác giả</option>
          </select>
        </label>
      </div>

      {usersQuery.isPending && <p className="mt-8 text-sm text-stone-500">Đang tải người dùng...</p>}
      {usersQuery.isError && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{usersQuery.error instanceof ApiClientError ? usersQuery.error.message : "Không thể tải danh sách người dùng."}</p>}
      {usersQuery.data && (
        <>
          <div className="mt-8 overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th scope="col" className="px-5 py-4 font-bold">Người dùng</th>
                  <th scope="col" className="px-5 py-4 font-bold">Email</th>
                  <th scope="col" className="px-5 py-4 font-bold">Vai trò</th>
                  <th scope="col" className="px-5 py-4 font-bold">Ngày tạo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {usersQuery.data.items.map((account: AdminUser) => (
                  <tr key={account.id}>
                    <td className="px-5 py-4 font-semibold text-stone-900">{account.displayName}</td>
                    <td className="px-5 py-4 text-stone-600">{account.email}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${account.role === "Admin" ? "bg-orange-50 text-orange-800" : "bg-stone-100 text-stone-700"}`}>
                        {account.role === "Admin" ? "Quản trị viên" : "Tác giả"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-stone-500">{new Date(account.createdAt).toLocaleDateString("vi-VN")}</td>
                  </tr>
                ))}
                {usersQuery.data.items.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-stone-500">Không có người dùng nào phù hợp.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex items-center justify-between text-sm text-stone-500">
            <span>{usersQuery.data.totalCount} người dùng</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-full border border-stone-300 px-4 py-2 font-semibold text-stone-700 disabled:opacity-40">Trước</button>
              <span className="px-2 py-2">Trang {page} / {Math.max(usersQuery.data.totalPages, 1)}</span>
              <button type="button" disabled={page >= usersQuery.data.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-full border border-stone-300 px-4 py-2 font-semibold text-stone-700 disabled:opacity-40">Sau</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
