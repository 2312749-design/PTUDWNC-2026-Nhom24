import Link from "next/link";
import { Heart, UtensilsCrossed } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-800 bg-stone-950 text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-white">
            <span className="flex size-10 items-center justify-center rounded-xl bg-orange-600">
              <UtensilsCrossed className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold">
              culinary<span className="text-orange-400">.</span>
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-stone-400">
            Nơi những công thức ngon lành được sẻ chia, để căn bếp mỗi ngày thêm
            ấm áp và đầy cảm hứng.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm md:items-end">
          <Link href="/search" className="transition hover:text-orange-300">
            Khám phá công thức
          </Link>
          <Link href="/login" className="transition hover:text-orange-300">
            Tham gia cộng đồng
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-1 px-5 py-5 text-center text-xs text-stone-500 sm:px-8">
          © 2026 Culinary Blog · Được làm với{" "}
          <Heart className="mx-0.5 size-3.5 fill-orange-500 text-orange-500" aria-label="tình yêu" />{" "}
          trong căn bếp Việt
        </p>
      </div>
    </footer>
  );
}
