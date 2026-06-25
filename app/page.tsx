import { Suspense } from "react";
import { getRaceSchedule, getRaceWinners, getCurrentYear } from "@/lib/api";
import RaceCard from "@/components/RaceCard";
import YearDropdown from "@/components/YearDropdown";

interface Props {
  searchParams: Promise<{ year?: string }>;
}

async function RaceGrid({ year }: { year: number }) {
  const [scheduleRes, winnersRes] = await Promise.all([
    getRaceSchedule(year).catch(() => null),
    getRaceWinners(year).catch(() => null),
  ]);

  if (!scheduleRes) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
        <p className="text-red-400 font-semibold text-sm">
          Could not fetch the {year} schedule.
        </p>
        <p className="text-white/30 text-xs mt-2">
          Make sure the backend is running on{" "}
          <code className="font-mono bg-white/5 px-1 rounded">
            http://localhost:5000
          </code>
        </p>
      </div>
    );
  }

  const podiums = winnersRes?.podiums ?? {};
  const winnerCount = Object.keys(podiums).length;
  const winnersFailed = !winnersRes && scheduleRes;

  return (
    <>
      {winnersFailed && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 mb-4">
          <p className="text-amber-400 text-sm font-semibold">
            Race winners could not be loaded
          </p>
          <p className="text-white/30 text-xs mt-1">
            Restart the backend so the latest code is running:{" "}
            <code className="font-mono bg-white/5 px-1 rounded">
              cd F1/backend &amp;&amp; npm start
            </code>
          </p>
        </div>
      )}

      <p className="text-white/25 text-xs font-mono mb-4">
        {scheduleRes.total} races · {winnerCount} completed
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {scheduleRes.races.map((race) => (
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
          className="bg-[#15151e] rounded-xl border border-white/5 p-4 animate-pulse"
        >
          <div className="flex justify-between mb-3">
            <div className="h-3 w-16 bg-white/10 rounded" />
            <div className="h-3 w-20 bg-white/10 rounded" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-white/10 rounded-full" />
            <div className="h-5 w-28 bg-white/10 rounded" />
          </div>
          <div className="h-3 w-full bg-white/5 rounded mb-4" />
          <div className="space-y-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-10 bg-white/5 rounded-lg" />
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
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-[#e10600]">{year}</span> Race Calendar
          </h1>
          <p className="text-white/30 text-xs mt-0.5">
            {year === currentYear ? "Current season" : `${year} season`}
          </p>
        </div>

        <Suspense fallback={
          <div className="w-36 h-9 bg-white/5 rounded-xl animate-pulse" />
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
