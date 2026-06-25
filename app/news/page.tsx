import { Suspense } from "react";
import { getNews } from "@/lib/api";
import NewsGrid from "@/components/NewsGrid";

async function NewsContent() {
  const newsRes = await getNews(9).catch(() => null); // 1 featured + 8 cards

  if (!newsRes || newsRes.articles.length === 0) {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-[#e10600] text-3xl font-black tracking-tight">F1</span>
              <h1 className="text-xl font-bold text-white/90 tracking-tight uppercase">
                News
              </h1>
            </div>
            <p className="text-white/20 text-[11px] font-mono mt-1">
              Latest from the paddock
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-[#e10600]/20 bg-[#e10600]/5 p-5">
          <p className="text-[#e10600] font-semibold text-sm">
            Could not fetch F1 news
          </p>
          <p className="text-white/30 text-xs mt-2 font-mono">
            Backend must be running on localhost:5000
          </p>
        </div>
      </>
    );
  }

  return <NewsGrid initialData={newsRes} />;
}

function LoadingSkeleton() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-[#e10600] text-3xl font-black tracking-tight">F1</span>
            <h1 className="text-xl font-bold text-white/90 tracking-tight uppercase">
              News
            </h1>
          </div>
          <p className="text-white/20 text-[11px] font-mono mt-1">
            Latest from the paddock
          </p>
        </div>
        <div className="h-9 w-28 bg-white/[0.03] rounded-lg animate-pulse" />
      </div>

      <div className="rounded-lg bg-[#0f0f14] border border-white/[0.04] overflow-hidden mb-6 animate-pulse">
        <div className="aspect-[21/9] bg-white/[0.03]" />
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-white/5 rounded" />
            <div className="h-5 w-20 bg-white/[0.03] rounded" />
          </div>
          <div className="h-6 w-3/4 bg-white/5 rounded" />
          <div className="h-3 w-full bg-white/[0.03] rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#0f0f14] rounded-lg border border-white/[0.04] overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-white/[0.03]" />
            <div className="p-4 space-y-2">
              <div className="flex gap-2">
                <div className="h-3 w-14 bg-white/5 rounded" />
                <div className="h-3 w-10 bg-white/[0.03] rounded" />
              </div>
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-2/3 bg-white/[0.03] rounded" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function NewsPage() {
  return (
    <div className="px-5 py-6">
      <Suspense fallback={<LoadingSkeleton />}>
        <NewsContent />
      </Suspense>
    </div>
  );
}
