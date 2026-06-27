import { Suspense } from "react";
import { getRaceCalendarFull, getCurrentYear } from "@/lib/api";
import RaceCard from "@/components/RaceCard";
import YearDropdown from "@/components/YearDropdown";

interface Props {
  searchParams: Promise<{ year?: string }>;
}

async function RaceGrid({ year }: { year: number }) {
  const data = await getRaceCalendarFull(year).catch(() => null);

  if (!data) {
    return (
      <div className="rounded-xl border border-[#e10600]/20 bg-[#e10600]/5 p-6 animate-fade-in">
        <p className="text-[#e10600] font-bold text-sm">
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
      <div className="flex items-center gap-4 text-label mb-5 animate-fade-in">
        <span>{data.total} rounds</span>
        <span className="w-px h-3 bg-white/[0.08]" />
        <span>{winnerCount} completed</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
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
          className="bg-[#0a0a0a] rounded-xl border border-white/[0.06] p-4"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex justify-between mb-3">
            <div className="h-3 w-10 skeleton" />
            <div className="h-3 w-20 skeleton" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 skeleton rounded-lg" />
            <div className="h-4 w-24 skeleton" />
          </div>
          <div className="h-2.5 w-32 skeleton mb-4 ml-8" />
          <div className="rounded-lg overflow-hidden border border-white/[0.06]">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-10 bg-black/30 border-b border-white/[0.04] last:border-0" />
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
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap animate-slide-up">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-[#e10600] text-4xl text-display">
              {year}
            </span>
            <h1 className="text-xl text-heading text-white/90">
              Race Calendar
            </h1>
          </div>
          <p className="text-white/25 text-[11px] font-mono mt-1.5 tracking-wide">
            {year === currentYear ? "Current season" : "Historical data"}
          </p>
        </div>

        <Suspense fallback={
          <div className="w-36 h-10 skeleton rounded-lg" />
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
