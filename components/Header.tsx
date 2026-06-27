"use client";

import { useState, useEffect } from "react";

interface Props {
  onToggleSidebar: () => void;
}

interface SessionInfo {
  label: string;
  location: string;
  country: string;
  dateStart: Date;
  dateEnd: Date;
}

const SESSION_LABELS: Record<string, string> = {
  "Practice 1": "FP1",
  "Practice 2": "FP2",
  "Practice 3": "FP3",
  "Qualifying": "QUALI",
  "Sprint": "SPRINT",
  "Sprint Qualifying": "SQ",
  "Sprint Shootout": "SS",
  "Race": "RACE",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toLabel(name: string) {
  return SESSION_LABELS[name] ?? name.toUpperCase();
}

function toIST(date: Date): string {
  const hours = date.getUTCHours() + 5;
  const minutes = date.getUTCMinutes() + 30;
  let totalMinutes = hours * 60 + minutes;
  const finalHours = Math.floor(totalMinutes / 60) % 24;
  const finalMinutes = totalMinutes % 60;
  return `${finalHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")} IST`;
}

function toDateIST(date: Date): string {
  const istDate = new Date(date.getTime());
  istDate.setMinutes(istDate.getMinutes() + 330);
  
  const today = new Date();
  const todayIST = new Date(today.getTime() + (today.getTimezoneOffset() + 330) * 60000);

  const sameDay =
    istDate.getUTCDate() === todayIST.getUTCDate() &&
    istDate.getUTCMonth() === todayIST.getUTCMonth() &&
    istDate.getUTCFullYear() === todayIST.getUTCFullYear();

  if (sameDay) return toIST(date);

  const day = istDate.getUTCDate();
  const month = MONTHS[istDate.getUTCMonth()];
  return `${day} ${month} · ${toIST(date)}`;
}

function useNextSession() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const year = new Date().getFullYear();
    fetch(`https://api.openf1.org/v1/sessions?year=${year}`)
      .then((r) => r.json())
      .then((data: { session_name: string; location: string; country_name: string; date_start: string; date_end: string }[]) => {
        const now = Date.now();
        const next = data
          .map((s) => ({ ...s, startMs: new Date(s.date_start).getTime(), endMs: new Date(s.date_end).getTime() }))
          .filter((s) => s.endMs > now)
          .sort((a, b) => a.startMs - b.startMs)[0];

        if (next) {
          setSession({
            label: toLabel(next.session_name),
            location: next.location,
            country: next.country_name,
            dateStart: new Date(next.date_start),
            dateEnd: new Date(next.date_end),
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { session, loading };
}

export default function Header({ onToggleSidebar }: Props) {
  const { session, loading } = useNextSession();

  const now = Date.now();
  const isLive = session
    ? session.dateStart.getTime() <= now && now < session.dateEnd.getTime()
    : false;
  const isRace = session?.label === "RACE" || session?.label === "SPRINT";

  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-black/90 backdrop-blur-xl shrink-0 z-10">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg hover:bg-white/[0.06] text-white/40 hover:text-white transition-all duration-200 shrink-0 active:scale-95"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Divider */}
      <div className="h-5 w-px bg-white/[0.08] shrink-0" />

      {/* F1 logo */}
      <div className="w-7 h-7 rounded-md bg-[#e10600] flex items-center justify-center font-black text-[10px] text-white leading-none shrink-0 shadow-lg shadow-[#e10600]/20">
        F1
      </div>

      {/* Session location + label */}
      {!loading && session && (
        <>
          <div className="h-4 w-px bg-white/[0.08] shrink-0" />

          {isLive && (
            <span className="w-2 h-2 rounded-full bg-[#e10600] live-indicator shrink-0" />
          )}

          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-xs font-semibold text-white/60">
              {session.location}
            </span>
            <span className="text-white/20 text-[10px]">/</span>
            <span className="text-[10px] font-medium text-white/30">
              {session.country}
            </span>
          </div>

          <span className="text-white/15 text-xs">·</span>

          <span
            className={`text-xs font-black tracking-widest whitespace-nowrap transition-colors duration-200 ${isLive ? "text-[#e10600]" : isRace ? "text-[#e10600]" : "text-white/80"}`}
          >
            {isLive ? "LIVE · " : ""}{session.label}
          </span>
        </>
      )}

      {/* Loading skeleton */}
      {loading && (
        <>
          <div className="h-4 w-px bg-white/[0.08] shrink-0" />
          <div className="h-3 w-24 skeleton" />
          <div className="h-3 w-12 skeleton" />
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Session time */}
      {!loading && session && (
        <span className="text-xs text-mono font-semibold text-white/40 whitespace-nowrap hidden sm:block">
          {toDateIST(session.dateStart)}
        </span>
      )}

      {loading && (
        <div className="h-3 w-28 skeleton hidden sm:block" />
      )}
    </header>
  );
}
