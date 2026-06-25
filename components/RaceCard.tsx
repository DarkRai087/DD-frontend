import { Race, PodiumFinisher } from "@/types/f1";

interface Props {
  race: Race;
  podium?: PodiumFinisher[];
  season: number;
}

const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", USA: "🇺🇸", Canada: "🇨🇦",
  Monaco: "🇲🇨", Spain: "🇪🇸", Austria: "🇦🇹", UK: "🇬🇧", Belgium: "🇧🇪",
  Hungary: "🇭🇺", Netherlands: "🇳🇱", Italy: "🇮🇹", Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬", Mexico: "🇲🇽", Brazil: "🇧🇷", UAE: "🇦🇪",
  Qatar: "🇶🇦", Germany: "🇩🇪", France: "🇫🇷", Portugal: "🇵🇹",
  "Saudi Arabia": "🇸🇦", Bahrain: "🇧🇭", Vietnam: "🇻🇳",
};

const TEAM_COLORS: Record<string, string> = {
  mercedes: "#27F4D2",
  ferrari: "#ED1131",
  red_bull: "#3671C6",
  mclaren: "#FF8000",
  alpine: "#0093CC",
  aston_martin: "#229971",
  williams: "#1868DB",
  rb: "#6692FF",
  haas: "#9C9FA2",
  sauber: "#01C00E",
  audi: "#F50537",
  cadillac: "#000000",
  toro_rosso: "#6692FF",
  alphatauri: "#6692FF",
};

const POSITION_LABELS: Record<number, string> = {
  1: "1ST",
  2: "2ND",
  3: "3RD",
};

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? "🏁";
}

function getTeamColor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? "#555555";
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

function formatWeekendRange(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const raceDay = new Date(y, m - 1, d);
  const fri = new Date(raceDay);
  fri.setDate(fri.getDate() - 2);

  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();

  return `${fmt(fri)} – ${fmt(raceDay)}`;
}

function driverCode(finisher: PodiumFinisher): string {
  return (
    finisher.driver.code ??
    `${finisher.driver.firstName[0]}${finisher.driver.lastName.slice(0, 2)}`.toUpperCase()
  );
}

function PodiumSlot({ finisher }: { finisher: PodiumFinisher }) {
  const color = getTeamColor(finisher.constructor.id);
  const code = driverCode(finisher);

  return (
    <div className="flex-1 flex items-center gap-2 bg-[#1c1c1c] rounded-xl px-3 py-3 min-w-0">
      <span className="text-white/90 font-black text-xl italic tracking-tighter leading-none shrink-0 w-9">
        {POSITION_LABELS[finisher.position]}
      </span>

      <div
        className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center border-2"
        style={{ backgroundColor: `${color}30`, borderColor: color }}
      >
        <span className="text-[10px] font-black text-white">{code}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-white font-bold text-sm leading-none truncate">{code}</p>
        <p className="text-white/50 text-[11px] font-mono mt-1 truncate">
          {finisher.time ?? "—"}
        </p>
      </div>
    </div>
  );
}

export default function RaceCard({ race, podium, season }: Props) {
  const status = getRaceStatus(race.date);
  const flag = getFlag(race.circuit.country);
  const hasPodium = podium && podium.length > 0;

  return (
    <div className="bg-black rounded-2xl border border-white/8 overflow-hidden hover:border-white/15 transition-colors">
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/50 text-[11px] font-bold tracking-[0.2em] uppercase">
            Round {race.round}
          </span>
          <span className="flex items-center gap-1.5 text-white/60 text-[11px] font-medium bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
            <span className="text-xs">🏁</span>
            {formatWeekendRange(race.date)}
          </span>
        </div>

        {/* Country + race name */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl leading-none">{flag}</span>
          <h3 className="text-white text-2xl font-black tracking-tight">
            {race.circuit.country}
          </h3>
        </div>
        <p className="text-white/35 text-[10px] uppercase tracking-widest leading-relaxed mb-5">
          Formula 1 {race.raceName} {season}
        </p>

        {/* Podium or status */}
        {hasPodium ? (
          <div className="flex gap-2">
            {podium.map((f) => (
              <PodiumSlot key={f.position} finisher={f} />
            ))}
          </div>
        ) : (
          <div className="bg-[#1c1c1c] rounded-xl px-4 py-6 text-center">
            <p className="text-white/25 text-sm">
              {status === "upcoming"
                ? "Race not yet held"
                : status === "today"
                ? "Race day — results pending"
                : "Results unavailable"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
