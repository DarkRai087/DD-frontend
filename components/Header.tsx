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

function toLabel(name: string) {
  return SESSION_LABELS[name] ?? name.toUpperCase();
}

function toIST(date: Date): string {
  const time = date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${time} IST`;
}

function toDateIST(date: Date): string {
  const today = new Date();
  const sessionDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const todayIST = new Date(today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  const sameDay =
    sessionDate.getFullYear() === todayIST.getFullYear() &&
    sessionDate.getMonth() === todayIST.getMonth() &&
    sessionDate.getDate() === todayIST.getDate();

  if (sameDay) return toIST(date);

  const dayLabel = date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
  });
  return `${dayLabel} · ${toIST(date)}`;
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

      {/* F1 logo */}
      <div className="w-6 h-6 rounded bg-[#e10600] flex items-center justify-center font-black text-[10px] text-white leading-none shrink-0">
        F1
      </div>

      {/* Session location + label — LEFT */}
      {!loading && session && (
        <>
          <div className="h-4 w-px bg-white/8 shrink-0" />

          {isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] animate-pulse shrink-0" />
          )}

          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-xs font-semibold text-white/50">
              {session.location}
            </span>
            <span className="text-white/20 text-[10px]">,</span>
            <span className="text-[10px] font-medium text-white/30">
              {session.country}
            </span>
          </div>

          <span className="text-white/15 text-xs">·</span>

          <span
            className={[
              "text-xs font-black tracking-widest whitespace-nowrap",
              isLive ? "text-[#e10600]" : isRace ? "text-[#e10600]" : "text-white/80",
            ].join(" ")}
          >
            {isLive ? "LIVE · " : ""}{session.label}
          </span>
        </>
      )}

      {/* Loading skeleton for location */}
      {loading && (
        <>
          <div className="h-4 w-px bg-white/8 shrink-0" />
          <div className="h-3 w-20 rounded-full bg-white/5 animate-pulse" />
          <div className="h-3 w-10 rounded-full bg-white/5 animate-pulse" />
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Session time in IST — RIGHT */}
      {!loading && session && (
        <span className="text-xs font-mono font-semibold text-white/40 whitespace-nowrap hidden sm:block">
          {toDateIST(session.dateStart)}
        </span>
      )}

      {loading && (
        <div className="h-3 w-24 rounded-full bg-white/5 animate-pulse hidden sm:block" />
      )}

      {/* Divider */}
      <div className="h-4 w-px bg-white/8 shrink-0 hidden md:block" />

      {/* Data attribution */}
    </header>
  );
}
