"use client";

import { useState } from "react";
import { NewsArticle, NewsResponse } from "@/types/f1";
import NewsCard from "./NewsCard";
import FeaturedNewsCard from "./FeaturedNewsCard";
import NewsHeader from "./NewsHeader";

interface Props {
  initialData: NewsResponse;
}

export default function NewsGrid({ initialData }: Props) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialData.articles);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.totalResults > initialData.articles.length);
  const [lastUpdated, setLastUpdated] = useState(initialData.lastUpdated);
  const [fromCache, setFromCache] = useState(initialData.fromCache);
  const [nextUpdate, setNextUpdate] = useState(initialData.nextUpdate);
  const [totalResults, setTotalResults] = useState(initialData.totalResults);

  const loadMore = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(
        `http://localhost:5000/api/news?pageSize=8&page=${nextPage}`
      );
      const data: NewsResponse = await res.json();

      if (data.articles && data.articles.length > 0) {
        setArticles((prev) => [...prev, ...data.articles]);
        setPage(nextPage);
        setHasMore(data.articles.length === 8);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await fetch("http://localhost:5000/api/news/refresh", { method: "POST" });
      const res = await fetch("http://localhost:5000/api/news?pageSize=9");
      const data: NewsResponse = await res.json();
      
      if (data.articles) {
        setArticles(data.articles);
        setPage(1);
        setHasMore(data.totalResults > data.articles.length);
        setLastUpdated(data.lastUpdated);
        setFromCache(data.fromCache);
        setNextUpdate(data.nextUpdate);
        setTotalResults(data.totalResults);
      }
    } catch (err) {
      console.error("Failed to refresh:", err);
    }
  };

  const [featured, ...rest] = articles;

  return (
    <>
      <NewsHeader
        totalResults={totalResults}
        lastUpdated={lastUpdated}
        fromCache={fromCache}
        nextUpdate={nextUpdate}
        onRefresh={handleRefresh}
      />

      {featured && (
        <div className="mb-6 animate-scale-in">
          <FeaturedNewsCard article={featured} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
        {rest.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center animate-fade-in">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Load More
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="mt-10 text-center animate-fade-in">
          <p className="text-label">
            {articles.length} articles loaded
          </p>
        </div>
      )}
    </>
  );
}
