import { Race, PodiumFinisher } from "@/types/f1";

interface Props {
  race: Race;
  podium?: PodiumFinisher[];
  season: number;
}

// ── Static maps ───────────────────────────────────────────────────────────────
const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", USA: "🇺🇸", Canada: "🇨🇦",
  Monaco: "🇲🇨", Spain: "🇪🇸", Austria: "🇦🇹", UK: "🇬🇧", Belgium: "🇧🇪",
  Hungary: "🇭🇺", Netherlands: "🇳🇱", Italy: "🇮🇹", Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬", Mexico: "🇲🇽", Brazil: "🇧🇷", UAE: "🇦🇪",
  Qatar: "🇶🇦", Germany: "🇩🇪", France: "🇫🇷", Portugal: "🇵🇹",
  "Saudi Arabia": "🇸🇦", Bahrain: "🇧🇭", Vietnam: "🇻🇳",
};

const TEAM_COLORS: Record<string, string> = {
  mercedes: "#27F4D2", ferrari: "#ED1131", red_bull: "#3671C6",
  mclaren: "#FF8000", alpine: "#0093CC", aston_martin: "#229971",
  williams: "#1868DB", rb: "#6692FF", haas: "#9C9FA2",
  sauber: "#01C00E", kick_sauber: "#01C00E", alphatauri: "#6692FF",
  toro_rosso: "#6692FF",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getFlag(country: string) {
  return COUNTRY_FLAGS[country] ?? "🏁";
}

function getTeamColor(id: string) {
  const key = id.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return TEAM_COLORS[key] ?? "#666";
}

function driverCode(f: PodiumFinisher) {
  return (
    f.driver.code ??
    `${f.driver.firstName[0]}${f.driver.lastName.slice(0, 2)}`.toUpperCase()
  );
}

function getRaceStatus(dateStr: string): "upcoming" | "completed" | "today" {
  const [y, m, d] = dateStr.split("-").map(Number);
  const raceDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  raceDate.setHours(0, 0, 0, 0);
  if (raceDate.getTime() === today.getTime()) return "today";
  return raceDate < today ? "completed" : "upcoming";
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const raceDay = new Date(y, m - 1, d);
  const fri = new Date(raceDay);
  fri.setDate(fri.getDate() - 2);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
  return `${fmt(fri)} – ${fmt(raceDay)}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function PodiumResult({ podium }: { podium: PodiumFinisher[] }) {
  const [p1, p2, p3] = podium;
  if (!p1) return null;

  const winColor = getTeamColor(p1.constructor.id);

  return (
    <div className="flex flex-col items-end gap-1">
      {/* Winner */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: winColor }}
        />
        <span className="text-sm font-bold text-white">{driverCode(p1)}</span>
      </div>
      {/* P2 & P3 */}
      {(p2 || p3) && (
        <div className="flex items-center gap-2.5">
          {[p2, p3].filter(Boolean).map((f) => (
            <div key={f!.position} className="flex items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: getTeamColor(f!.constructor.id) }}
              />
              <span className="text-[10px] font-semibold text-white/40">
                {driverCode(f!)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "upcoming" | "completed" | "today" }) {
  if (status === "today") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#e10600]/15 border border-[#e10600]/30 text-[#e10600]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] animate-pulse" />
        Race Day
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="inline-flex text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/30">
        Upcoming
      </span>
    );
  }
  return (
    <span className="inline-flex text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/20">
      No data
    </span>
  );
}

// ── Main row ──────────────────────────────────────────────────────────────────
export default function RaceCard({ race, podium, season: _season }: Props) {
  const status = getRaceStatus(race.date);
  const flag = getFlag(race.circuit.country);
  const hasPodium = !!podium && podium.length > 0;

  return (
    <tr className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors group">
      {/* RND */}
      <td className="py-4 pr-4 w-10 align-middle">
        <span className="text-xs font-black font-mono text-white/25">
          {String(race.round).padStart(2, "0")}
        </span>
      </td>

      {/* GRAND PRIX */}
      <td className="py-4 pr-6 align-middle">
        <div className="flex items-center gap-3">
          <span className="text-xl leading-none shrink-0">{flag}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight whitespace-nowrap">
              {race.circuit.country}
            </p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest truncate mt-0.5">
              {race.raceName.replace(/Grand Prix/i, "GP")}
            </p>
          </div>
        </div>
      </td>

      {/* CIRCUIT */}
      <td className="py-4 pr-6 hidden md:table-cell align-middle min-w-[180px]">
        <p className="text-sm text-white/55 truncate">{race.circuit.name}</p>
        <p className="text-[10px] text-white/25 mt-0.5">
          {race.circuit.locality}, {race.circuit.country}
        </p>
      </td>

      {/* DATE */}
      <td className="py-4 pr-6 hidden sm:table-cell align-middle whitespace-nowrap">
        <span className="text-xs font-mono text-white/40">{formatDate(race.date)}</span>
      </td>

      {/* RESULT */}
      <td className="py-4 align-middle text-right">
        {hasPodium ? (
          <PodiumResult podium={podium!} />
        ) : (
          <StatusBadge status={status} />
        )}
      </td>
    </tr>
  );
}
