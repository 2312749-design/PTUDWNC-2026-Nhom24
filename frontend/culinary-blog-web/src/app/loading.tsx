import LoadingState from "@/components/common/loading-state";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-5 py-12 sm:px-8">
      <div className="w-full">
        <LoadingState message="Đang tải trang..." />
      </div>
    </main>
  );
}
