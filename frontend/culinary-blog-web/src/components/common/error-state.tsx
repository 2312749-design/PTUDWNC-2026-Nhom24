import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-3xl border border-red-200 bg-red-50 p-8 text-center"
      role="alert"
    >
      <AlertCircle className="size-8 text-red-600" aria-hidden="true" />
      <p className="max-w-xl text-sm leading-6 text-red-800">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Thử lại
        </button>
      )}
    </div>
  );
}
