import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  totalCount,
  isLoading,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Phân trang kết quả"
      className="mt-10 flex flex-wrap items-center justify-center gap-4"
    >
      <button
        type="button"
        disabled={page <= 1 || isLoading}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        Trang trước
      </button>
      <span className="text-sm text-stone-600" aria-live="polite">
        Trang <strong className="text-stone-900">{page}</strong> / {totalPages}
        <span className="mx-2 text-stone-300">·</span>
        {totalCount} công thức
      </span>
      <button
        type="button"
        disabled={page >= totalPages || isLoading}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-45"
      >
        Trang sau
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
