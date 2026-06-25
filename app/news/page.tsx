import { Suspense } from "react";
import { getNews } from "@/lib/api";
import NewsCard from "@/components/NewsCard";
import FeaturedNewsCard from "@/components/FeaturedNewsCard";

async function NewsGrid() {
  const newsRes = await getNews(13).catch(() => null);

  if (!newsRes || newsRes.articles.length === 0) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
        <p className="text-red-400 font-semibold text-sm">
          Could not fetch F1 news.
        </p>
        <p className="text-white/30 text-xs mt-2">
          Make sure the backend is running on{" "}
          <code className="font-mono bg-white/5 px-1 rounded">
            http://localhost:5000
          </code>
        </p>
      </div>
    );
  }

  const [featured, ...rest] = newsRes.articles;

  return (
    <>
      <p className="text-white/25 text-xs font-mono mb-4">
        {newsRes.totalResults.toLocaleString()} articles found
      </p>

      {featured && (
        <div className="mb-6">
          <FeaturedNewsCard article={featured} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rest.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <div className="h-3 w-32 bg-white/10 rounded mb-4 animate-pulse" />
      
      <div className="rounded-2xl bg-[#15151e] border border-white/5 overflow-hidden mb-6 animate-pulse">
        <div className="aspect-[21/9] bg-white/5" />
        <div className="p-6 space-y-3">
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-white/10 rounded-full" />
            <div className="h-6 w-24 bg-white/5 rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-full bg-white/5 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#15151e] rounded-xl border border-white/5 overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-white/5" />
            <div className="p-4 space-y-2">
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-white/10 rounded" />
                <div className="h-4 w-12 bg-white/5 rounded" />
              </div>
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-2/3 bg-white/5 rounded" />
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
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">
          <span className="text-[#e10600]">F1</span> News
        </h1>
        <p className="text-white/30 text-xs mt-0.5">
          Latest Formula 1 news from around the paddock
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <NewsGrid />
      </Suspense>
    </div>
  );
}
