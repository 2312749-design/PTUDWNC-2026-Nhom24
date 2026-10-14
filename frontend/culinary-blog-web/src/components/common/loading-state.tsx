import { LoaderCircle } from "lucide-react";

export default function LoadingState({
  message = "Đang tải dữ liệu...",
}: {
  message?: string;
}) {
  return (
    <div
      className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-sm"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="size-8 animate-spin text-orange-600" />
      <p className="text-sm font-medium text-stone-600">{message}</p>
    </div>
  );
}
