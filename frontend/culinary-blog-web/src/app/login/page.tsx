"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ApiClientError } from "@/lib/api-error";
import { useAuthStore } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signIn({ email: email.trim(), password });
      router.replace("/");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Đăng nhập chưa thành công. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f8eee3] px-5 py-12 sm:px-8">
      <section className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-7 shadow-xl shadow-orange-900/5 sm:p-9">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition hover:text-orange-700"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Về trang chủ
        </Link>
        <div className="mt-7 flex size-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <LockKeyhole className="size-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-stone-900">Chào mừng trở lại</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Đăng nhập để tiếp tục chia sẻ niềm vui nấu nướng.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Email</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 px-4 focus-within:border-orange-500">
              <Mail className="size-4 shrink-0 text-stone-400" aria-hidden="true" />
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ban@email.com"
                className="min-w-0 flex-1 py-3 text-sm outline-none placeholder:text-stone-400"
              />
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Mật khẩu</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 px-4 focus-within:border-orange-500">
              <LockKeyhole className="size-4 shrink-0 text-stone-400" aria-hidden="true" />
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nhập mật khẩu"
                className="min-w-0 flex-1 py-3 text-sm outline-none placeholder:text-stone-400"
              />
            </span>
          </label>
          {error && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </section>
    </main>
  );
}
