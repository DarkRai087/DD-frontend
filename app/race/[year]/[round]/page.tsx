import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getRaceDetails } from "@/lib/api";
import RaceDetailClient from "./RaceDetailClient";

interface Props {
  params: Promise<{ year: string; round: string }>;
}

async function RaceContent({ year, round }: { year: number; round: number }) {
  const details = await getRaceDetails(year, round).catch(() => null);

  if (!details) {
    notFound();
  }

  return <RaceDetailClient details={details} />;
}

function LoadingSkeleton() {
  return (
    <div className="px-5 py-6 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-lg" />
        <div>
          <div className="h-6 w-48 bg-white/10 rounded mb-2" />
          <div className="h-4 w-32 bg-white/5 rounded" />
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-white/5 rounded-lg" />
        ))}
      </div>
      <div className="bg-[#15151e] rounded-xl p-6">
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function RaceDetailPage({ params }: Props) {
  const { year, round } = await params;
  const yearNum = parseInt(year, 10);
  const roundNum = parseInt(round, 10);

  if (isNaN(yearNum) || isNaN(roundNum)) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RaceContent year={yearNum} round={roundNum} />
    </Suspense>
  );
}
