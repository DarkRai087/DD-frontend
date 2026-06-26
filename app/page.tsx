import { Suspense } from "react";
import { getRaceCalendarFull, getCurrentYear } from "@/lib/api";
import RaceCard from "@/components/RaceCard";
import YearDropdown from "@/components/YearDropdown";

interface Props {
  searchParams: Promise<{ year?: string }>;
}

async function RaceGrid({ year }: { year: number }) {
  // Single API call instead of 2 parallel calls - reduces latency significantly
  const data = await getRaceCalendarFull(year).catch(() => null);

  if (!data) {
    return (
      <div className="rounded-lg border border-[#e10600]/20 bg-[#e10600]/5 p-5">
        <p className="text-[#e10600] font-semibold text-sm">
          Could not fetch the {year} schedule
        </p>
        <p className="text-white/30 text-xs mt-2 font-mono">
          Backend must be running on localhost:5000
        </p>
      </div>
    );
  }

  const podiums = data.podiums ?? {};
  const winnerCount = Object.keys(podiums).length;

  return (
    <>
      <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 mb-4 uppercase tracking-wider">
        <span>{data.total} rounds</span>
        <span className="w-px h-3 bg-white/10" />
        <span>{winnerCount} completed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.races.map((race) => (
          <RaceCard
            key={race.round}
            race={race}
            podium={podiums[race.round]}
            season={year}
          />
        ))}
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-[#0f0f14] rounded-lg border border-white/[0.04] p-4 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="h-3 w-10 bg-white/5 rounded" />
            <div className="h-3 w-20 bg-white/5 rounded" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-white/5 rounded" />
            <div className="h-4 w-24 bg-white/5 rounded" />
          </div>
          <div className="h-2.5 w-32 bg-white/[0.03] rounded mb-4 ml-8" />
          <div className="rounded overflow-hidden border border-white/[0.04]">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-9 bg-[#0c0c12] border-b border-white/[0.03] last:border-0" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const currentYear = getCurrentYear();
  const year = Math.min(
    Math.max(Number(params.year ?? currentYear), 1950),
    currentYear
  );

  return (
    <div className="px-5 py-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-[#e10600] text-3xl font-black tabular-nums tracking-tight">
              {year}
            </span>
            <h1 className="text-xl font-bold text-white/90 tracking-tight uppercase">
              Race Calendar
            </h1>
          </div>
          <p className="text-white/20 text-[11px] font-mono mt-1">
            {year === currentYear ? "Current season" : "Historical data"}
          </p>
        </div>

        <Suspense fallback={
          <div className="w-36 h-9 bg-white/[0.03] rounded-lg animate-pulse" />
        }>
          <YearDropdown />
        </Suspense>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <RaceGrid year={year} />
      </Suspense>
    </div>
  );
}
