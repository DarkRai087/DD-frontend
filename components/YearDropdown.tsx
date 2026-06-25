"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getYearRange, getCurrentYear } from "@/lib/api";

export default function YearDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const years = getYearRange();
  const current = getCurrentYear();
  const selected = Number(searchParams.get("year") ?? current);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const year = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="relative">
      <select
        value={selected}
        onChange={handleChange}
        className="appearance-none bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl px-4 py-2 pr-8 hover:bg-white/10 focus:outline-none focus:border-[#e10600]/50 cursor-pointer transition-colors"
      >
        {years.map((y) => (
          <option key={y} value={y} className="bg-[#12122a]">
            {y} {y === current ? "(Current)" : ""}
          </option>
        ))}
      </select>
      {/* Chevron */}
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
