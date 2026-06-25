"use client";

import { Suspense } from "react";
import SessionCountdown from "./SessionCountdown";

interface Props {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: Props) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-[#0d0d1a]/90 backdrop-blur-md shrink-0 z-10">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors shrink-0"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Divider */}
      <div className="h-5 w-px bg-white/8 shrink-0" />

      {/* F1 wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded bg-[#e10600] flex items-center justify-center font-black text-[10px] text-white leading-none">
          F1
        </div>
        <span className="text-white/50 text-xs font-bold tracking-wide hidden lg:block">
          Dashboard
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Session countdown — center piece */}
      <Suspense
        fallback={
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 rounded-full bg-white/5 animate-pulse" />
            <div className="h-3 w-16 rounded-full bg-white/5 animate-pulse" />
          </div>
        }
      >
        <SessionCountdown />
      </Suspense>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Data source */}
      <span className="text-white/15 text-[10px] font-mono hidden md:block shrink-0">
        openf1.org · jolpi.ca/ergast
      </span>
    </header>
  );
}
