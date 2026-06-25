import Image from "next/image";
import Link from "next/link";
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
  "Great Britain": "🇬🇧", "United States": "🇺🇸", "United Arab Emirates": "🇦🇪",
};

const TEAM_COLORS: Record<string, string> = {
  mercedes: "#27F4D2", ferrari: "#ED1131", red_bull: "#3671C6",
  mclaren: "#FF8000", alpine: "#0093CC", aston_martin: "#229971",
  williams: "#1868DB", rb: "#6692FF", haas: "#9C9FA2",
  sauber: "#01C00E", kick_sauber: "#01C00E", alphatauri: "#6692FF",
  toro_rosso: "#6692FF",
};

const CIRCUIT_SVGS: Record<string, string> = {
  bahrain: "M40 25 L60 20 L80 30 L85 50 L75 70 L50 75 L30 60 L35 40 Z",
  jeddah: "M20 70 L25 30 L35 20 L50 25 L55 40 L70 35 L85 50 L80 70 L60 75 Z",
  albert_park: "M30 50 L40 25 L70 20 L85 35 L80 60 L60 75 L35 70 Z",
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

function formatDateRange(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const raceDay = new Date(y, m - 1, d);
  const fri = new Date(raceDay);
  fri.setDate(fri.getDate() - 2);
  
  const dayFri = fri.getDate().toString().padStart(2, "0");
  const daySun = raceDay.getDate().toString().padStart(2, "0");
  const month = MONTHS[raceDay.getMonth()].toUpperCase();
  
  return `${dayFri} - ${daySun} ${month}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getCircuitPath(circuitId: string): string {
  const key = circuitId.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return CIRCUIT_SVGS[key] || CIRCUIT_SVGS.default;
}

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

function getHeadshotUrl(driverCode: string): string {
  return DRIVER_HEADSHOTS[driverCode.toUpperCase()] || 
    "https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/driver_fallback_image.png";
}

const POSITION_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

function PodiumDriver({ 
  finisher, 
  position 
}: { 
  finisher: PodiumFinisher; 
  position: number;
}) {
  const teamColor = getTeamColor(finisher.constructor.id);
  const code = driverCode(finisher);
  const headshotUrl = getHeadshotUrl(code);
  
  return (
    <div className="flex items-center gap-2.5 bg-[#0c0c12] px-2 py-1.5 min-w-0">
      {/* Team color bar - the signature F1 timing element */}
      <div 
        className="w-[3px] h-7 rounded-[1px] shrink-0"
        style={{ backgroundColor: teamColor }}
      />
      
      {/* Position */}
      <span 
        className="text-sm font-black w-4 text-right tabular-nums shrink-0"
        style={{ color: position === 1 ? "#fff" : "rgba(255,255,255,0.6)" }}
      >
        {position}
      </span>
      
      {/* Driver headshot */}
      <div 
        className="relative w-6 h-6 rounded-full overflow-hidden shrink-0"
      >
        <Image
          src={headshotUrl}
          alt={code}
          fill
          className="object-cover object-top scale-[1.4]"
          sizes="24px"
        />
      </div>
      
      {/* Driver code + gap */}
      <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
        <span 
          className="text-[11px] font-bold tracking-wide"
          style={{ color: teamColor }}
        >
          {code}
        </span>
        <span className="text-[10px] font-mono text-white/35 tabular-nums truncate">
          {position === 1 ? (finisher.time ?? "") : finisher.time ? `+${finisher.time}` : ""}
        </span>
      </div>
    </div>
  );
}

function CircuitSilhouette({ circuitId }: { circuitId: string }) {
  const path = getCircuitPath(circuitId);
  
  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full opacity-15"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      />
    </svg>
  );
}

export default function RaceCard({ race, podium, season }: Props) {
  const status = getRaceStatus(race.date);
  const flag = getFlag(race.circuit.country);
  const hasPodium = !!podium && podium.length > 0;
  const isLive = status === "today";
  const isUpcoming = status === "upcoming";

  return (
    <Link 
      href={`/race/${season}/${race.round}`}
      className={`block relative bg-[#0f0f14] rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer hover:bg-[#121218] hover:border-white/10 ${isLive ? "border-[#e10600]/40" : "border-white/[0.04]"}`}
    >
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#e10600]" />
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold tracking-widest text-white/25 uppercase">
            R{race.round.toString().padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#e10600] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e10600] live-indicator" />
                Live
              </span>
            )}
            <span className="text-[10px] font-mono text-white/30 tabular-nums">
              {formatDateRange(race.date)}
            </span>
          </div>
        </div>

        {/* Country + flag */}
        <div className="flex items-center gap-2.5 mb-0.5">
          <span className="text-xl leading-none">{flag}</span>
          <h3 className="text-base font-black text-white tracking-tight leading-tight">
            {race.circuit.country === "UK" ? "Great Britain" : race.circuit.country}
          </h3>
        </div>

        {/* Circuit name */}
        <p className="text-[10px] text-white/30 uppercase tracking-wide leading-tight mb-4 line-clamp-1 pl-8">
          {race.circuit.name}
        </p>

        {/* Podium results or circuit silhouette */}
        {hasPodium ? (
          <div className="rounded overflow-hidden border border-white/[0.04]">
            {podium!.slice(0, 3).map((finisher) => (
              <PodiumDriver 
                key={finisher.position} 
                finisher={finisher} 
                position={finisher.position} 
              />
            ))}
          </div>
        ) : (
          <div className="relative h-20">
            <CircuitSilhouette circuitId={race.circuit.id} />
            <div className="absolute inset-0 flex items-center justify-center">
              {isUpcoming && (
                <span className="text-sm font-mono font-medium text-white/15 tabular-nums">
                  {formatDateRange(race.date)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
