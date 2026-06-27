"use client";

import { useState, useEffect } from "react";

interface Props {
  totalResults: number;
  lastUpdated: number;
  fromCache: boolean;
  nextUpdate: string;
  onRefresh?: () => Promise<void>;
}

function formatLastUpdated(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) return "Recently";
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function formatNextUpdate(isoString: string): string {
  if (!isoString) return "Soon";
  
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Soon";
  
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins <= 0) return "Soon";
  if (diffMins < 60) return `in ${diffMins} min`;
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export default function NewsHeader({ 
  totalResults, 
  lastUpdated, 
  fromCache, 
  nextUpdate,
  onRefresh 
}: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error("Failed to refresh:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  return (
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

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            {fromCache && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                Cached
              </span>
            )}
            <span className="text-white/40 text-xs font-mono">
              {totalResults.toLocaleString()} articles
            </span>
          </div>
          <p className="text-white/25 text-[10px] mt-1 font-mono">
            {mounted ? (
              <>Updated {formatLastUpdated(lastUpdated)} · Next {formatNextUpdate(nextUpdate)}</>
            ) : (
              <>Loading...</>
            )}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-ghost disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>
    </div>
  );
}
