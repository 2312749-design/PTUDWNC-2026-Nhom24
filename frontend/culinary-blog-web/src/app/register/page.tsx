"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ApiClientError } from "@/lib/api-error";
import { useAuthStore } from "@/lib/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const signUp = useAuthStore((state) => state.signUp);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signUp({ displayName: displayName.trim(), email: email.trim(), password });
      router.replace("/profile");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Đăng ký chưa thành công. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f8eee3] px-5 py-12 sm:px-8">
      <section className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-7 shadow-xl shadow-orange-900/5 sm:p-9">
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Tạo tài khoản</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Tham gia cộng đồng và chia sẻ công thức yêu thích của bạn.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Tên hiển thị</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 px-4 focus-within:border-orange-500">
              <UserRound className="size-4 shrink-0 text-stone-400" aria-hidden="true" />
              <input
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="min-w-0 flex-1 py-3 text-sm outline-none"
              />
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-stone-700">Email</span>
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-stone-200 px-4 focus-within:border-orange-500">
              <Mail className="size-4 shrink-0 text-stone-400" aria-hidden="true" />
              <input
                type="email"
                autoComplete="email"
                required
                maxLength={320}
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
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={128}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 py-3 text-sm outline-none"
              />
            </span>
            <span className="mt-1 block text-xs text-stone-500">Ít nhất 8 ký tự.</span>
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
            {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-bold text-orange-700 hover:text-orange-900">
            Đăng nhập
          </Link>
        </p>
      </section>
    </main>
  );
}
