"use client";

import { useState } from "react";
import Image from "next/image";
import { NewsArticle } from "@/types/f1";

interface Props {
  article: NewsArticle;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default function FeaturedNewsCard({ article }: Props) {
  const [imgError, setImgError] = useState(false);
  const showImage = article.urlToImage && !imgError;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <div className="relative w-full aspect-[21/9] overflow-hidden bg-white/[0.03]">
        {showImage ? (
          <Image
            src={article.urlToImage!}
            alt={article.title}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="100vw"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#e10600]/10 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#e10600] text-white shadow-lg shadow-[#e10600]/20">
            Featured
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/70 backdrop-blur-sm">
            {article.source.name}
          </span>
        </div>

        <h2 className="text-white font-black text-2xl md:text-3xl leading-tight mb-3 group-hover:text-[#e10600] transition-colors duration-200 line-clamp-2">
          {article.title}
        </h2>

        {article.description && (
          <p className="text-white/50 text-sm leading-relaxed line-clamp-2 max-w-3xl mb-4">
            {article.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-white/30 text-xs">
          {article.author && <span>By {article.author}</span>}
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </a>
  );
}
