"use client";

import { useState } from "react";
import Image from "next/image";
import { DriverStanding, ConstructorStanding, StandingsResponse } from "@/types/f1";

interface Props {
  driverData: StandingsResponse<DriverStanding> | null;
  constructorData: StandingsResponse<ConstructorStanding> | null;
  driverPodiums: Record<string, number>;
  constructorPodiums: Record<string, number>;
  headshotMap: Record<string, string>;
  year: number;
}

type Tab = "drivers" | "constructors";

// ── Nationality → 3-letter code ───────────────────────────────────────────────
const NAT_MAP: Record<string, string> = {
  Italian: "ITA", British: "GBR", Dutch: "NED", Monegasque: "MON",
  Australian: "AUS", French: "FRA", Mexican: "MEX", Spanish: "ESP",
  Finnish: "FIN", German: "DEU", Canadian: "CAN", Brazilian: "BRA",
  American: "USA", Japanese: "JPN", Thai: "THA", Danish: "DEN",
  Chinese: "CHN", Argentine: "ARG", Austrian: "AUT", Belgian: "BEL",
  Swiss: "SUI", Polish: "POL", Portuguese: "POR",
  Andorran: "AND", Bahraini: "BHR", Emirati: "UAE",
};

function natCode(nat: string): string {
  if (nat.startsWith("New Z")) return "NZL";
  return NAT_MAP[nat] ?? nat.slice(0, 3).toUpperCase();
}

// ── Team colors ───────────────────────────────────────────────────────────────
const TEAM_COLORS: Record<string, string> = {
  ferrari: "#e10600",
  mclaren: "#ff8000",
  red_bull: "#3671c6",
  mercedes: "#27f4d2",
  aston_martin: "#229971",
  alpine: "#0093cc",
  williams: "#64c4ff",
  haas: "#b6babd",
  sauber: "#52e252",
  kick_sauber: "#52e252",
  rb: "#6692ff",
  alphatauri: "#6692ff",
  renault: "#ffd800",
  racing_point: "#f596c8",
  force_india: "#f596c8",
  toro_rosso: "#6692ff",
  lotus_f1: "#ffd800",
};

function teamColor(id: string): string {
  const key = id.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return TEAM_COLORS[key] ?? "#888";
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function posColor(pos: number) {
  if (pos === 1) return "text-yellow-400";
  if (pos === 2) return "text-slate-300";
  if (pos === 3) return "text-amber-600";
  return "text-white/35";
}

// ── Sub-components ────────────────────────────────────────────────────────────
function ToggleGroup({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center bg-white/5 rounded-xl p-1 gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            value === opt.value
              ? "bg-[#e10600] text-white shadow"
              : "text-white/40 hover:text-white/70"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Avatar({
  color, firstName, lastName, headshotUrl,
}: {
  color: string; firstName: string; lastName: string; headshotUrl?: string;
}) {
  if (headshotUrl) {
    return (
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-black/40 bg-white/5">
        <Image
          src={headshotUrl}
          alt={`${firstName} ${lastName}`}
          width={36}
          height={36}
          className="w-full h-full object-cover object-top"
        />
      </div>
    );
  }
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 ring-2 ring-black/40"
      style={{ background: `linear-gradient(135deg, ${color}cc 0%, ${color}55 100%)` }}
    >
      {initials(firstName, lastName)}
    </div>
  );
}

function TeamDot({ color, name }: { color: string; name: string }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 ring-2 ring-black/30"
        style={{ background: `linear-gradient(135deg, ${color}cc 0%, ${color}44 100%)` }}
      >
        {name.slice(0, 1).toUpperCase()}
      </div>
      <span className="text-sm font-medium text-white truncate">{name}</span>
    </div>
  );
}

function ColHeader({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase whitespace-nowrap ${
        right ? "text-right pr-0" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Badges({ wins, podiums }: { wins: number; podiums: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-end">
      {wins > 0 && (
        <span className="bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {wins}W
        </span>
      )}
      {podiums > 0 && (
        <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
          P{podiums}
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StandingsClient({
  driverData, constructorData, driverPodiums, constructorPodiums, headshotMap, year,
}: Props) {
  const [tab, setTab] = useState<Tab>("drivers");
  const [showGap, setShowGap] = useState(false);

  const driverRows = driverData?.standings ?? [];
  const constructorRows = constructorData?.standings ?? [];

  const leaderDriverPts = driverRows[0]?.points ?? 0;
  const leaderConstructorPts = constructorRows[0]?.points ?? 0;

  return (
    <div className="px-5 py-6">
      {/* Page header + controls */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-[#e10600]">{year}</span> Standings
          </h1>
          <p className="text-white/30 text-xs mt-0.5">
            {tab === "drivers" ? "Driver" : "Constructor"} Championship · After round{" "}
            {tab === "drivers" ? (driverData?.round ?? "—") : (constructorData?.round ?? "—")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <ToggleGroup
            value={tab}
            onChange={(v) => setTab(v as Tab)}
            options={[
              { value: "drivers", label: "Drivers" },
              { value: "constructors", label: "Constructors" },
            ]}
          />
          <button
            onClick={() => setShowGap((g) => !g)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              showGap
                ? "bg-[#e10600]/15 border-[#e10600]/40 text-[#e10600]"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white/70"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            Gap to P1
          </button>
        </div>
      </div>

      {/* ── DRIVER TABLE ── */}
      {tab === "drivers" && (
        !driverData ? (
          <ErrorState message={`No driver standings available for ${year}`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr className="border-b border-white/8">
                  <ColHeader>Pos.</ColHeader>
                  <ColHeader>Driver</ColHeader>
                  <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-left hidden sm:table-cell">
                    Nationality
                  </th>
                  <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-left hidden md:table-cell">
                    Team
                  </th>
                  <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-right hidden sm:table-cell" />
                  <ColHeader right>Pts.</ColHeader>
                </tr>
              </thead>
              <tbody>
                {driverRows.map((s) => {
                  const color = teamColor(s.constructors[0]?.id ?? "");
                  const gap = leaderDriverPts - s.points;
                  const pods = driverPodiums[s.driver.id] ?? 0;
                  return (
                    <tr
                      key={s.driver.id}
                      className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                    >
                      {/* POS */}
                      <td className={`py-4 pr-4 text-sm font-black w-12 ${posColor(s.position)}`}>
                        {s.position}
                      </td>

                      {/* DRIVER */}
                      <td className="py-4 pr-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            color={color}
                            firstName={s.driver.firstName}
                            lastName={s.driver.lastName}
                            headshotUrl={headshotMap[s.driver.lastName.toLowerCase()]}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white leading-tight whitespace-nowrap">
                              {s.driver.firstName}{" "}
                              <span className="font-black">{s.driver.lastName}</span>
                            </p>
                            {s.driver.code && (
                              <p className="text-[10px] font-mono text-white/25 tracking-widest mt-0.5">
                                {s.driver.code}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* NATIONALITY */}
                      <td className="py-4 pr-6 hidden sm:table-cell">
                        <span className="text-sm font-mono font-semibold text-white/50 tracking-widest">
                          {natCode(s.driver.nationality)}
                        </span>
                      </td>

                      {/* TEAM */}
                      <td className="py-4 pr-6 hidden md:table-cell min-w-[160px]">
                        <TeamDot
                          color={color}
                          name={s.constructors[0]?.name ?? "—"}
                        />
                      </td>

                      {/* BADGES */}
                      <td className="py-4 pr-5 hidden sm:table-cell whitespace-nowrap">
                        <Badges wins={s.wins} podiums={pods} />
                      </td>

                      {/* POINTS */}
                      <td className="py-4 text-right whitespace-nowrap">
                        {showGap && gap > 0 ? (
                          <div>
                            <p className="text-sm font-black text-[#e10600]">
                              −{gap}
                            </p>
                            <p className="text-[10px] text-white/25 font-mono">{s.points} pts</p>
                          </div>
                        ) : (
                          <p className="text-sm font-black text-white">{s.points}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── CONSTRUCTOR TABLE ── */}
      {tab === "constructors" && (
        !constructorData ? (
          <ErrorState message={`No constructor standings available for ${year}`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse">
              <thead>
                <tr className="border-b border-white/8">
                  <ColHeader>Pos.</ColHeader>
                  <ColHeader>Constructor</ColHeader>
                  <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-left hidden sm:table-cell">
                    Nationality
                  </th>
                  <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-right hidden sm:table-cell" />
                  <ColHeader right>Pts.</ColHeader>
                </tr>
              </thead>
              <tbody>
                {constructorRows.map((s) => {
                  const color = teamColor(s.constructor.id);
                  const gap = leaderConstructorPts - s.points;
                  const pods = constructorPodiums[s.constructor.id] ?? 0;
                  return (
                    <tr
                      key={s.constructor.id}
                      className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors"
                    >
                      {/* POS */}
                      <td className={`py-4 pr-4 text-sm font-black w-12 ${posColor(s.position)}`}>
                        {s.position}
                      </td>

                      {/* CONSTRUCTOR */}
                      <td className="py-4 pr-6">
                        <TeamDot color={color} name={s.constructor.name} />
                      </td>

                      {/* NATIONALITY */}
                      <td className="py-4 pr-6 hidden sm:table-cell">
                        <span className="text-sm font-mono font-semibold text-white/50 tracking-widest">
                          {natCode(s.constructor.nationality)}
                        </span>
                      </td>

                      {/* BADGES */}
                      <td className="py-4 pr-5 hidden sm:table-cell whitespace-nowrap">
                        <Badges wins={s.wins} podiums={pods} />
                      </td>

                      {/* POINTS */}
                      <td className="py-4 text-right whitespace-nowrap">
                        {showGap && gap > 0 ? (
                          <div>
                            <p className="text-sm font-black text-[#e10600]">−{gap}</p>
                            <p className="text-[10px] text-white/25 font-mono">{s.points} pts</p>
                          </div>
                        ) : (
                          <p className="text-sm font-black text-white">{s.points}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
      <p className="text-red-400 font-semibold text-sm">{message}</p>
      <p className="text-white/30 text-xs mt-2">
        Make sure the backend is running on{" "}
        <code className="font-mono bg-white/5 px-1 rounded">http://localhost:5000</code>
      </p>
    </div>
  );
}
