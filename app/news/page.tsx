import { Suspense } from "react";
import { getNews } from "@/lib/api";
import NewsGrid from "@/components/NewsGrid";

async function NewsContent() {
  const newsRes = await getNews(9).catch(() => null);

  if (!newsRes || newsRes.articles.length === 0) {
    return (
      <>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 animate-slide-up">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-[#e10600] text-4xl text-display">F1</span>
              <h1 className="text-xl text-heading text-white/90">
                News
              </h1>
            </div>
            <p className="text-white/25 text-[11px] font-mono mt-1.5 tracking-wide">
              Latest from the paddock
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-[#e10600]/20 bg-[#e10600]/5 p-6 animate-fade-in">
          <p className="text-[#e10600] font-bold text-sm">
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
            <span className="text-[#e10600] text-4xl text-display">F1</span>
            <h1 className="text-xl text-heading text-white/90">
              News
            </h1>
          </div>
          <p className="text-white/25 text-[11px] font-mono mt-1.5 tracking-wide">
            Latest from the paddock
          </p>
        </div>
        <div className="h-10 w-28 skeleton rounded-lg" />
      </div>

      <div className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] overflow-hidden mb-6">
        <div className="aspect-[21/9] skeleton" />
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <div className="h-5 w-16 skeleton" />
            <div className="h-5 w-20 skeleton" />
          </div>
          <div className="h-6 w-3/4 skeleton" />
          <div className="h-3 w-full skeleton" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] overflow-hidden"
          >
            <div className="aspect-video skeleton" />
            <div className="p-4 space-y-2">
              <div className="flex gap-2">
                <div className="h-3 w-14 skeleton" />
                <div className="h-3 w-10 skeleton" />
              </div>
              <div className="h-3 w-full skeleton" />
              <div className="h-3 w-2/3 skeleton" />
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
