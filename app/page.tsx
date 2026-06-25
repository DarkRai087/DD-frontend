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

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr className="border-b border-white/8">
              <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-left w-10">
                Rnd
              </th>
              <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-left">
                Grand Prix
              </th>
              <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-left hidden md:table-cell">
                Circuit
              </th>
              <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-left hidden sm:table-cell">
                Date
              </th>
              <th className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-right">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {scheduleRes.races.map((race) => (
              <RaceCard
                key={race.round}
                race={race}
                podium={podiums[race.round]}
                season={year}
              />
            ))}
          </tbody>
        </table>
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse">
              <thead>
                <tr className="border-b border-white/8">
                  {["Rnd", "Grand Prix", "Circuit", "Date", "Result"].map((h) => (
                    <th key={h} className="py-3 text-[10px] font-bold tracking-widest text-white/25 uppercase text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[0.05]">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="py-4 pr-6">
                        <div className="h-4 rounded-full bg-white/5 animate-pulse" style={{ width: j === 1 ? "120px" : j === 2 ? "160px" : "60px" }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      >
        <RaceGrid year={year} />
      </Suspense>
    </div>
  );
}
