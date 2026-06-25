"use client";

import { useState, useEffect } from "react";

interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  location: string;
  country_name: string;
  circuit_short_name: string;
  year: number;
}

interface SessionInfo {
  label: string;       // "FP1", "Q", "RACE", etc.
  location: string;    // "Austria"
  country: string;
  dateStart: Date;
  dateEnd: Date;
  isLive: boolean;
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

function toLabel(name: string): string {
  return SESSION_LABELS[name] ?? name.toUpperCase();
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseMs(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h, m, s, total };
}

function isLabelRace(label: string) {
  return label === "RACE" || label === "SPRINT";
}

export default function SessionCountdown() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // Fetch once on mount
  useEffect(() => {
    const year = new Date().getFullYear();
    fetch(`https://api.openf1.org/v1/sessions?year=${year}`)
      .then((r) => r.json())
      .then((data: OpenF1Session[]) => {
        const now = Date.now();

        // Find earliest session whose end time is still in the future
        const relevant = data
          .map((s) => ({
            ...s,
            startMs: new Date(s.date_start).getTime(),
            endMs: new Date(s.date_end).getTime(),
          }))
          .filter((s) => s.endMs > now)
          .sort((a, b) => a.startMs - b.startMs);

        const next = relevant[0];
        if (next) {
          setSession({
            label: toLabel(next.session_name),
            location: next.location,
            country: next.country_name,
            dateStart: new Date(next.date_start),
            dateEnd: new Date(next.date_end),
            isLive: next.startMs <= now,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Tick every second
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Re-evaluate live state each tick
  const now = Date.now();
  const isLive = session
    ? session.dateStart.getTime() <= now && now < session.dateEnd.getTime()
    : false;
  const msLeft = session ? session.dateStart.getTime() - now : 0;
  const { h, m, s } = parseMs(msLeft);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-3 w-28 rounded-full bg-white/5 animate-pulse" />
        <div className="h-3 w-20 rounded-full bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (!session) return null;

  // ── LIVE ──────────────────────────────────────────────────────────────────
  if (isLive) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#e10600] animate-pulse shrink-0" />
          <span className="text-[10px] font-bold tracking-widest text-[#e10600] uppercase hidden sm:block">
            Live
          </span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
            {session.location}
          </span>
          <span
            className={`text-sm font-black tracking-tight ${
              isLabelRace(session.label) ? "text-[#e10600]" : "text-white"
            }`}
          >
            {session.label}
          </span>
        </div>
      </div>
    );
  }

  // ── COUNTDOWN ─────────────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-3">
      {/* Session info */}
      <div className="hidden sm:flex flex-col leading-none text-right">
        <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
          Next · {session.location}
        </span>
        <span
          className={`text-[11px] font-black tracking-widest ${
            isLabelRace(session.label) ? "text-[#e10600]" : "text-white/70"
          }`}
        >
          {session.label}
        </span>
      </div>

      <div className="h-6 w-px bg-white/8 hidden sm:block" />

      {/* Countdown digits */}
      <div className="flex items-center gap-0.5 font-mono">
        <span className="text-sm font-black text-white tabular-nums">{pad(h)}</span>
        <span className="text-white/25 text-[10px] font-bold mx-0.5">H</span>
        <span className="text-sm font-black text-white tabular-nums">{pad(m)}</span>
        <span className="text-white/25 text-[10px] font-bold mx-0.5">M</span>
        <span className="text-sm font-black text-white tabular-nums">{pad(s)}</span>
        <span className="text-white/25 text-[10px] font-bold mx-0.5">S</span>
      </div>
    </div>
  );
}
