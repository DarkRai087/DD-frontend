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
            http://localhost:3000
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const currentYear = getCurrentYear();
  const year = Math.min(
    Math.max(Number(params.year ?? currentYear), 1950),
    currentYear
  );

  return (
    <div className="px-5 py-6">
      {/* Page header */}
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

      {/* Race grid — streamed */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <RaceGrid year={year} />
      </Suspense>
    </div>
  );
}
