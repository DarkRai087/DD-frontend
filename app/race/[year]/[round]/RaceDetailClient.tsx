"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  RaceDetailsResponse,
  RaceResult,
  QualifyingResult,
  SessionResultRow,
} from "@/types/f1";

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", USA: "🇺🇸", Canada: "🇨🇦",
  Monaco: "🇲🇨", Spain: "🇪🇸", Austria: "🇦🇹", UK: "🇬🇧", Belgium: "🇧🇪",
  Hungary: "🇭🇺", Netherlands: "🇳🇱", Italy: "🇮🇹", Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬", Mexico: "🇲🇽", Brazil: "🇧🇷", UAE: "🇦🇪",
  Qatar: "🇶🇦", Germany: "🇩🇪", France: "🇫🇷", Portugal: "🇵🇹",
  "Saudi Arabia": "🇸🇦", Bahrain: "🇧🇭", Vietnam: "🇻🇳",
  "Great Britain": "🇬🇧", "United States": "🇺🇸", "United Arab Emirates": "🇦🇪",
};

const TEAM_COLORS: Record<string, string> = {
  mercedes: "#27F4D2", ferrari: "#ED1131", red_bull: "#3671C6",
  mclaren: "#FF8000", alpine: "#0093CC", aston_martin: "#229971",
  williams: "#1868DB", rb: "#6692FF", haas: "#9C9FA2",
  sauber: "#01C00E", kick_sauber: "#01C00E", alphatauri: "#6692FF",
  toro_rosso: "#6692FF",
};

const DRIVER_HEADSHOTS: Record<string, string> = {
  VER: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
  HAM: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png",
  NOR: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png",
  LEC: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png",
  SAI: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png",
  RUS: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png",
  PER: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png",
  ALO: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png",
  STR: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png",
  GAS: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png",
  OCO: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png",
  ALB: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png",
  TSU: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png",
  MAG: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png",
  HUL: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png",
  BOT: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png",
  ZHO: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png",
  PIA: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png",
  RIC: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png",
  LAW: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png",
  SAR: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png",
  ANT: "https://media.formula1.com/image/upload/c_lfill,w_64/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/mercedes/andant01/2026mercedesandant01right.webp",
  BEA: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png",
  HAD: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png",
  DOO: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/J/JACDOO01_Jack_Doohan/jacdoo01.png",
  BOR: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBAR01_Gabriel_Bortoleto/gabbar01.png",
  COL: "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png",
};

const CIRCUIT_SVGS: Record<string, string> = {
  albert_park: "M30 50 L40 25 L70 20 L85 35 L80 60 L60 75 L35 70 Z",
  bahrain: "M40 25 L60 20 L80 30 L85 50 L75 70 L50 75 L30 60 L35 40 Z",
  jeddah: "M20 70 L25 30 L35 20 L50 25 L55 40 L70 35 L85 50 L80 70 L60 75 Z",
  suzuka: "M20 40 L35 20 L55 15 L75 25 L85 45 L70 70 L45 80 L25 65 Z",
  monaco: "M25 60 L35 30 L55 20 L80 35 L75 65 L50 80 L30 75 Z",
  silverstone: "M30 35 L50 15 L75 25 L85 50 L70 75 L40 80 L20 60 Z",
  spa: "M25 55 L40 20 L70 25 L85 45 L75 75 L45 85 L20 70 Z",
  monza: "M35 75 L30 40 L45 20 L70 25 L80 50 L75 70 L55 80 Z",
  interlagos: "M40 70 L25 45 L35 20 L65 15 L85 40 L75 65 L55 80 Z",
  yas_marina: "M30 50 L45 20 L75 25 L85 55 L70 80 L35 75 Z",
  red_bull_ring: "M35 65 L30 35 L55 20 L80 30 L75 60 L50 75 Z",
  hungaroring: "M25 50 L40 20 L70 25 L80 50 L65 75 L35 70 Z",
  zandvoort: "M30 55 L45 25 L75 30 L80 55 L60 75 L35 70 Z",
  default: "M30 50 L45 20 L75 30 L80 55 L65 75 L35 70 Z",
};

const CIRCUIT_INFO: Record<string, { length: string; distance: string }> = {
  albert_park: { length: "5.278 km", distance: "306.124 km" },
  bahrain: { length: "5.412 km", distance: "308.238 km" },
  jeddah: { length: "6.174 km", distance: "308.450 km" },
  suzuka: { length: "5.807 km", distance: "307.471 km" },
  monaco: { length: "3.337 km", distance: "260.286 km" },
  silverstone: { length: "5.891 km", distance: "306.198 km" },
  spa: { length: "7.004 km", distance: "308.052 km" },
  monza: { length: "5.793 km", distance: "306.720 km" },
  interlagos: { length: "4.309 km", distance: "305.879 km" },
  yas_marina: { length: "5.281 km", distance: "306.183 km" },
  red_bull_ring: { length: "4.318 km", distance: "306.452 km" },
  hungaroring: { length: "4.381 km", distance: "306.630 km" },
  zandvoort: { length: "4.259 km", distance: "306.587 km" },
};

type TabType = "results" | "info";

const SESSION_LABELS: Record<string, string> = {
  FP1: "Free practice",
  FP2: "FP2",
  FP3: "FP3",
  SQ: "Sprint quali",
  SR: "Sprint",
  Q: "Qualifying",
  R: "Race",
};

function resolveTeamColor(name: string, color?: string | null, id?: string) {
  if (color) return color;
  if (id) return getTeamColor(id);
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return TEAM_COLORS[key] ?? "#666";
}

function driverCodeFromRow(row: SessionResultRow | QualifyingResult | RaceResult) {
  const d = row.driver;
  return (
    d.code ??
    `${d.firstName[0]}${d.lastName.slice(0, 2)}`.toUpperCase()
  );
}

function pickDefaultSession(sessions: string[]): string {
  if (sessions.includes("R")) return "R";
  return sessions[sessions.length - 1] ?? "R";
}

function getFlag(country: string) {
  return COUNTRY_FLAGS[country] ?? "🏁";
}

function getTeamColor(id: string) {
  const key = id.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return TEAM_COLORS[key] ?? "#666";
}

function getHeadshotUrl(driverCode: string): string {
  return DRIVER_HEADSHOTS[driverCode?.toUpperCase()] || 
    "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/driver_fallback_image.png";
}

function getCircuitPath(circuitId: string): string {
  const key = circuitId.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return CIRCUIT_SVGS[key] || CIRCUIT_SVGS.default;
}

function getCircuitInfo(circuitId: string) {
  const key = circuitId.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return CIRCUIT_INFO[key] || { length: "~5.0 km", distance: "~305 km" };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "TBC";
  const parts = dateStr.split("-");
  if (parts.length < 3) return "TBC";
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return "TBC";
  const day = d.toString().padStart(2, "0");
  return `${day} ${MONTHS[m - 1]} ${y}`;
}

function calculateGap(result: RaceResult, winner: RaceResult | undefined): string {
  if (!winner || result.position === 1) {
    return result.time || "-";
  }
  if (result.status !== "Finished" && result.status !== "+1 Lap" && !result.status.includes("Lap")) {
    return result.status;
  }
  if (result.time) {
    return `+${result.time}`;
  }
  if (result.status.includes("Lap")) {
    return result.status;
  }
  return "-";
}

function getPositionChange(grid: number, position: number): { change: number; color: string } {
  const change = grid - position;
  if (change > 0) return { change, color: "#22c55e" };
  if (change < 0) return { change, color: "#ef4444" };
  return { change: 0, color: "#666" };
}

interface Props {
  details: RaceDetailsResponse;
}

export default function RaceDetailClient({ details }: Props) {
  const availableSessions = details.availableSessions?.length
    ? details.availableSessions
    : [
        ...(details.qualifyingResults.length ? ["Q"] : []),
        ...(details.raceResults.length ? ["R"] : []),
      ];

  const [activeTab, setActiveTab] = useState<TabType>("results");
  const [session, setSession] = useState<string>(() =>
    pickDefaultSession(availableSessions)
  );

  const flag = getFlag(details.circuit.country);
  const circuitInfo = getCircuitInfo(details.circuit.id);
  const winner = details.raceResults[0];

  const tabs: { id: TabType; label: string }[] = [
    { id: "results", label: "Results" },
    { id: "info", label: "Info" },
  ];

  return (
    <div className="px-5 py-6">
      {/* Back link */}
      <Link 
        href={`/?year=${details.season}`}
        className="inline-flex items-center gap-2 text-white/40 hover:text-white/60 text-sm mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to calendar
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="text-3xl">{flag}</div>
        <div className="flex-1">
          <h1 className="text-xl font-black tracking-tight uppercase">
            {details.circuit.country === "UK" ? "Great Britain" : details.circuit.country}
          </h1>
          <p className="text-white/30 text-xs mt-0.5">{details.circuit.name}</p>
          {details.isSprintWeekend && (
            <span className="inline-flex items-center gap-1.5 mt-2 text-[9px] font-bold uppercase tracking-widest text-[#e10600]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e10600]" />
              Sprint weekend
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">R{details.round.toString().padStart(2, "0")}</p>
          <p className="text-xs text-white/50 font-mono tabular-nums mt-0.5">{formatDate(details.date)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              activeTab === tab.id
                ? "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all bg-[#e10600] text-white"
                : "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results Tab */}
      {activeTab === "results" && (
        <div className="bg-[#0f0f14] rounded-lg border border-white/[0.04] overflow-hidden">
          {/* Session selector */}
          <div className="flex gap-1.5 p-3 border-b border-white/[0.04] overflow-x-auto bg-[#0c0c10]">
            {availableSessions.map((code) => (
              <button
                key={code}
                onClick={() => setSession(code)}
                className={
                  session === code
                    ? "px-3 py-1.5 text-xs font-bold rounded transition-all bg-white/10 text-white shrink-0 uppercase tracking-wide"
                    : "px-3 py-1.5 text-xs font-bold rounded transition-all text-white/30 hover:text-white/50 hover:bg-white/[0.03] shrink-0 uppercase tracking-wide"
                }
              >
                {SESSION_LABELS[code] ?? code}
              </button>
            ))}
          </div>

          {/* Results table */}
          <SessionContent details={details} session={session} winner={winner} />
        </div>
      )}

      {/* Info Tab */}
      {activeTab === "info" && (
        <div className="bg-[#0f0f14] rounded-lg border border-white/[0.04] p-6">
          <div className="flex items-start gap-8 flex-wrap lg:flex-nowrap">
            {/* Circuit map */}
            <div className="flex-1 min-w-[280px]">
              <h2 className="text-sm font-bold uppercase tracking-wide text-white/80 mb-4">{details.circuit.name}</h2>
              <div className="relative bg-[#0c0c10] rounded-lg p-6 border border-white/[0.04]">
                <svg 
                  viewBox="0 0 100 100" 
                  className="w-full max-w-sm mx-auto h-44"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d={getCircuitPath(details.circuit.id)}
                    fill="rgba(255, 255, 255, 0.03)"
                    stroke="url(#trackGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#e10600" />
                      <stop offset="100%" stopColor="#fff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Circuit stats */}
            <div className="w-full lg:w-56 space-y-0">
              <div className="flex justify-between items-center py-3 border-b border-white/[0.04]">
                <span className="text-white/30 text-xs uppercase tracking-wide">City</span>
                <span className="font-semibold text-sm">{details.circuit.locality}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/[0.04]">
                <span className="text-white/30 text-xs uppercase tracking-wide">Laps</span>
                <span className="font-semibold text-sm tabular-nums">{details.totalLaps}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/[0.04]">
                <span className="text-white/30 text-xs uppercase tracking-wide">Length</span>
                <span className="font-semibold text-sm">{circuitInfo.length}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-white/30 text-xs uppercase tracking-wide">Distance</span>
                <span className="font-semibold text-sm">{circuitInfo.distance}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionContent({
  details,
  session,
  winner,
}: {
  details: RaceDetailsResponse;
  session: string;
  winner: RaceResult | undefined;
}) {
  const alphaSession = details.sessions?.[session];

  if (session === "R" && details.raceResults.length > 0) {
    return <RaceResultsTable results={details.raceResults} winner={winner} />;
  }

  if (session === "Q" && details.qualifyingResults.length > 0) {
    return <QualifyingResultsTable results={details.qualifyingResults} />;
  }

  if (session === "SR" && details.sprintResults.length > 0) {
    return <SprintResultsTable results={details.sprintResults} />;
  }

  if (alphaSession?.results?.length) {
    if (session === "FP1" || session === "FP2" || session === "FP3") {
      return <PracticeResultsTable results={alphaSession.results} />;
    }
    if (session === "SQ") {
      return (
        <AlphaQualifyingTable
          results={alphaSession.results}
          keys={["SQ1", "SQ2", "SQ3"]}
          labels={["SQ1", "SQ2", "SQ3"]}
        />
      );
    }
    if (session === "SR") {
      return <AlphaRaceTable results={alphaSession.results} />;
    }
    if (session === "Q") {
      return (
        <AlphaQualifyingTable
          results={alphaSession.results}
          keys={["Q1", "Q2", "Q3"]}
          labels={["Q1", "Q2", "Q3"]}
        />
      );
    }
    if (session === "R") {
      return <AlphaRaceTable results={alphaSession.results} />;
    }
    return <PracticeResultsTable results={alphaSession.results} />;
  }

  return (
    <div className="p-8 text-center text-white/40">
      <p>{SESSION_LABELS[session] ?? session} results not available yet</p>
    </div>
  );
}

function DriverCell({
  row,
  teamColor,
}: {
  row: SessionResultRow | QualifyingResult | RaceResult;
  teamColor: string;
}) {
  const code = driverCodeFromRow(row);
  const headshotUrl = getHeadshotUrl(code);
  const teamName =
    "constructor" in row && row.constructor
      ? row.constructor.name
      : "";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative w-8 h-8 rounded-full overflow-hidden shrink-0"
      >
        <Image
          src={headshotUrl}
          alt={code}
          fill
          className="object-cover object-top scale-[1.4]"
          sizes="32px"
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wide" style={{ color: teamColor }}>
            {code}
          </span>
          <span className="text-white/50 text-sm truncate">
            {row.driver.lastName}
          </span>
        </div>
        <span className="text-white/20 text-[10px] block truncate">{teamName}</span>
      </div>
    </div>
  );
}

function PosCell({ position, teamColor }: { position: number; teamColor: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-[3px] h-7 rounded-[1px]"
        style={{ backgroundColor: teamColor }}
      />
      <span className="font-black text-sm tabular-nums w-5 text-right" style={{ color: position <= 3 ? "#fff" : "rgba(255,255,255,0.6)" }}>
        {position}
      </span>
    </div>
  );
}

function PracticeResultsTable({ results }: { results: SessionResultRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-white/20 text-[10px] uppercase tracking-widest">
            <th className="text-left py-2.5 px-4 font-semibold">Pos</th>
            <th className="text-left py-2.5 px-4 font-semibold">Driver</th>
            <th className="text-center py-2.5 px-4 font-semibold">Laps</th>
            <th className="text-right py-2.5 px-4 font-semibold">Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const teamColor = resolveTeamColor(
              result.constructor.name,
              result.constructor.color
            );
            return (
              <tr
                key={result.position}
                className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-4">
                  <PosCell position={result.position} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4">
                  <DriverCell row={result} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4 text-center text-white/40 text-sm tabular-nums">
                  {result.laps ?? "-"}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-xs text-white/50 tabular-nums">
                  {result.time ?? "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AlphaQualifyingTable({
  results,
  keys,
  labels,
}: {
  results: SessionResultRow[];
  keys: string[];
  labels: string[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-white/20 text-[10px] uppercase tracking-widest">
            <th className="text-left py-2.5 px-4 font-semibold">Pos</th>
            <th className="text-left py-2.5 px-4 font-semibold">Driver</th>
            {labels.map((label) => (
              <th key={label} className="text-right py-2.5 px-4 font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const teamColor = resolveTeamColor(
              result.constructor.name,
              result.constructor.color
            );
            return (
              <tr
                key={result.position}
                className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-4">
                  <PosCell position={result.position} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4">
                  <DriverCell row={result} teamColor={teamColor} />
                </td>
                {keys.map((key) => (
                  <td
                    key={key}
                    className="py-2.5 px-4 text-right font-mono text-xs text-white/50 tabular-nums"
                  >
                    {result.components[key]?.time ?? "-"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AlphaRaceTable({ results }: { results: SessionResultRow[] }) {
  const winner = results[0];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-white/20 text-[10px] uppercase tracking-widest">
            <th className="text-left py-2.5 px-4 font-semibold">Pos</th>
            <th className="text-left py-2.5 px-4 font-semibold">Driver</th>
            <th className="text-center py-2.5 px-4 font-semibold">Laps</th>
            <th className="text-center py-2.5 px-4 font-semibold">Pts</th>
            <th className="text-right py-2.5 px-4 font-semibold">Gap</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const teamColor = resolveTeamColor(
              result.constructor.name,
              result.constructor.color
            );
            const gap =
              result.position === 1
                ? result.time ?? "-"
                : result.time
                  ? `+${result.time}`
                  : result.status ?? "-";

            return (
              <tr
                key={result.position}
                className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-4">
                  <PosCell position={result.position} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4">
                  <DriverCell row={result} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4 text-center text-white/40 text-sm tabular-nums">
                  {result.laps ?? "-"}
                </td>
                <td className="py-2.5 px-4 text-center font-bold text-sm">
                  {result.points ?? "-"}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-xs text-white/50 tabular-nums">
                  {gap}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SprintResultsTable({ results }: { results: RaceResult[] }) {
  const winner = results[0];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-white/20 text-[10px] uppercase tracking-widest">
            <th className="text-left py-2.5 px-4 font-semibold">Pos</th>
            <th className="text-left py-2.5 px-4 font-semibold">Driver</th>
            <th className="text-center py-2.5 px-4 font-semibold">Grid</th>
            <th className="text-center py-2.5 px-4 font-semibold">Laps</th>
            <th className="text-center py-2.5 px-4 font-semibold">Pts</th>
            <th className="text-right py-2.5 px-4 font-semibold">Gap</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const teamColor = getTeamColor(result.constructor.id);
            const posChange = getPositionChange(result.grid, result.position);

            return (
              <tr
                key={result.position}
                className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-[3px] h-7 rounded-[1px]"
                      style={{ backgroundColor: teamColor }}
                    />
                    <span className="font-black text-sm tabular-nums w-5 text-right" style={{ color: result.position <= 3 ? "#fff" : "rgba(255,255,255,0.6)" }}>
                      {result.position}
                    </span>
                    {posChange.change !== 0 && (
                      <span
                        className="text-[9px] font-bold"
                        style={{ color: posChange.color }}
                      >
                        {posChange.change > 0
                          ? `▲${posChange.change}`
                          : `▼${Math.abs(posChange.change)}`}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <DriverCell row={result} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4 text-center text-white/40 text-sm tabular-nums">
                  {result.grid}
                </td>
                <td className="py-2.5 px-4 text-center text-white/40 text-sm tabular-nums">
                  {result.laps}
                </td>
                <td className="py-2.5 px-4 text-center font-bold text-sm">
                  {result.points}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-xs text-white/50 tabular-nums">
                  {calculateGap(result, winner)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RaceResultsTable({ results, winner }: { results: RaceResult[]; winner: RaceResult | undefined }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-white/20 text-[10px] uppercase tracking-widest">
            <th className="text-left py-2.5 px-4 font-semibold">Pos</th>
            <th className="text-left py-2.5 px-4 font-semibold">Driver</th>
            <th className="text-center py-2.5 px-4 font-semibold">Grid</th>
            <th className="text-center py-2.5 px-4 font-semibold">Laps</th>
            <th className="text-center py-2.5 px-4 font-semibold">Pts</th>
            <th className="text-right py-2.5 px-4 font-semibold">Gap</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const teamColor = getTeamColor(result.constructor.id);
            const posChange = getPositionChange(result.grid, result.position);

            return (
              <tr 
                key={result.position}
                className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-[3px] h-7 rounded-[1px]"
                      style={{ backgroundColor: teamColor }}
                    />
                    <span className="font-black text-sm tabular-nums w-5 text-right" style={{ color: result.position <= 3 ? "#fff" : "rgba(255,255,255,0.6)" }}>
                      {result.position}
                    </span>
                    {posChange.change !== 0 && (
                      <span 
                        className="text-[9px] font-bold"
                        style={{ color: posChange.color }}
                      >
                        {posChange.change > 0 ? `▲${posChange.change}` : `▼${Math.abs(posChange.change)}`}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <DriverCell row={result} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4 text-center text-white/40 text-sm tabular-nums">{result.grid}</td>
                <td className="py-2.5 px-4 text-center text-white/40 text-sm tabular-nums">{result.laps}</td>
                <td className="py-2.5 px-4 text-center font-bold text-sm">{result.points}</td>
                <td className="py-2.5 px-4 text-right font-mono text-xs text-white/50 tabular-nums">
                  {calculateGap(result, winner)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function QualifyingResultsTable({ results }: { results: QualifyingResult[] }) {
  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-white/30 text-sm">
        Qualifying results not available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-white/20 text-[10px] uppercase tracking-widest">
            <th className="text-left py-2.5 px-4 font-semibold">Pos</th>
            <th className="text-left py-2.5 px-4 font-semibold">Driver</th>
            <th className="text-right py-2.5 px-4 font-semibold">Q1</th>
            <th className="text-right py-2.5 px-4 font-semibold">Q2</th>
            <th className="text-right py-2.5 px-4 font-semibold">Q3</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const teamColor = getTeamColor(result.constructor.id);

            return (
              <tr 
                key={result.position}
                className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 px-4">
                  <PosCell position={result.position} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4">
                  <DriverCell row={result} teamColor={teamColor} />
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-xs text-white/50 tabular-nums">
                  {result.q1 || "-"}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-xs text-white/50 tabular-nums">
                  {result.q2 || "-"}
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-xs text-white/50 tabular-nums">
                  {result.q3 || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
