"use client";

import ErrorState from "@/components/common/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-5 py-12 sm:px-8">
      <div className="w-full">
        <h1 className="mb-5 text-2xl font-bold text-stone-900">Đã xảy ra lỗi</h1>
        <ErrorState message={error.message || "Không thể tải nội dung này."} onRetry={reset} />
      </div>
    </main>
  );
}
