"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ApiClientError } from "@/lib/api-error";
import { requestPasswordReset } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Không thể gửi yêu cầu. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f8eee3] px-5 py-12 sm:px-8">
      <section className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-7 shadow-xl shadow-orange-900/5 sm:p-9">
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Quên mật khẩu?</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Nhập email tài khoản để nhận liên kết đặt lại mật khẩu.
        </p>
        {sent ? (
          <p role="status" className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm leading-6 text-green-800">
            Nếu email tồn tại, hướng dẫn đặt lại mật khẩu sẽ được gửi đến hộp thư của bạn.
          </p>
        ) : (
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
              {isSubmitting ? "Đang gửi..." : "Gửi liên kết"}
            </button>
          </form>
        )}
        <Link href="/login" className="mt-6 block text-center text-sm font-semibold text-orange-700 hover:text-orange-900">
          Quay lại đăng nhập
        </Link>
      </section>
    </main>
  );
}
