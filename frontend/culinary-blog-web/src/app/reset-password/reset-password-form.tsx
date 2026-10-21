"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ApiClientError } from "@/lib/api-error";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email, token, password);
      setSuccess(true);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Không thể đặt lại mật khẩu. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f8eee3] px-5 py-12 sm:px-8">
      <section className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-7 shadow-xl shadow-orange-900/5 sm:p-9">
        <h1 className="text-3xl font-black tracking-tight text-stone-900">Đặt lại mật khẩu</h1>
        {success ? (
          <>
            <p role="status" className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm leading-6 text-green-800">
              Mật khẩu đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
            </p>
            <Link href="/login" className="mt-6 block text-center text-sm font-bold text-orange-700 hover:text-orange-900">
              Đến trang đăng nhập
            </Link>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              Tạo mật khẩu mới gồm ít nhất 8 ký tự.
            </p>
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-stone-700">Mật khẩu mới</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-stone-700">Xác nhận mật khẩu</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </label>
              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !email || !token}
                className="w-full rounded-xl bg-orange-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </button>
              {(!email || !token) && (
                <p role="alert" className="text-sm text-red-700">
                  Liên kết đặt lại mật khẩu không hợp lệ. Hãy yêu cầu một liên kết mới.
                </p>
              )}
            </form>
          </>
        )}
      </section>
    </main>
  );
}
