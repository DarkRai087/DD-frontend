"use client";

import { useState } from "react";
import Image from "next/image";
import { NewsArticle } from "@/types/f1";

interface Props {
  article: NewsArticle;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function getSourceColor(sourceName: string): string {
  const colors: Record<string, string> = {
    "Motorsport.com": "#e10600",
    "autosport.com": "#ff8700",
    "PlanetF1": "#1e90ff",
    "Crash.net": "#00c853",
    "RaceFans": "#9c27b0",
    "GPFans": "#ff5722",
    "ESPN": "#d50000",
    "BBC Sport": "#ffd700",
    "Sky Sports": "#0077b5",
  };
  return colors[sourceName] || "#666";
}

export default function NewsCard({ article }: Props) {
  const [imgError, setImgError] = useState(false);
  const sourceColor = getSourceColor(article.source.name);
  const timeAgo = formatTimeAgo(article.publishedAt);
  const showImage = article.urlToImage && !imgError;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
    >
      {showImage ? (
        <div className="relative w-full aspect-video overflow-hidden bg-white/[0.03]">
          <Image
            src={article.urlToImage!}
            alt={article.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
        </div>
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-[#e10600]/5 to-black flex items-center justify-center">
          <svg className="w-10 h-10 text-white/[0.06]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: `${sourceColor}15`, color: sourceColor }}
          >
            {article.source.name}
          </span>
          <span className="text-[10px] text-white/25 font-mono">{timeAgo}</span>
        </div>

        <h3 className="text-white font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#e10600] transition-colors duration-200">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-white/35 text-xs leading-relaxed line-clamp-2">
            {article.description}
          </p>
        )}

        {article.author && (
          <p className="text-white/20 text-[10px] mt-3 font-mono truncate">
            By {article.author}
          </p>
        )}
      </div>
    </a>
  );
}
