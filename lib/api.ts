import {
  Driver,
  RaceScheduleResponse,
  WinnersResponse,
  DriverStanding,
  ConstructorStanding,
  StandingsResponse,
  NewsResponse,
} from "@/types/f1";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/** All years from current down to 1950 for the year picker. */
export function getYearRange(): number[] {
  const current = getCurrentYear();
  return Array.from({ length: current - 1950 + 1 }, (_, i) => current - i);
}

async function apiFetch<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ── OpenF1 ────────────────────────────────────────────────────────────────────

export async function getDrivers(sessionKey?: number): Promise<Driver[]> {
  const qs = sessionKey ? `?session_key=${sessionKey}` : `?session_key=latest`;
  const data = await apiFetch<Driver[]>(`/drivers${qs}`, 60);

  const seen = new Map<number, Driver>();
  for (const d of data) {
    if (
      !seen.has(d.driver_number) ||
      d.session_key > seen.get(d.driver_number)!.session_key
    ) {
      seen.set(d.driver_number, d);
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.driver_number - b.driver_number);
}

// ── Ergast / Jolpica ──────────────────────────────────────────────────────────

export async function getRaceSchedule(year: number): Promise<RaceScheduleResponse> {
  return apiFetch<RaceScheduleResponse>(`/races/${year}`, 300);
}

export async function getRaceWinners(year: number): Promise<WinnersResponse> {
  return apiFetch<WinnersResponse>(`/races/${year}/winners`, 300);
}

// ── Standings ─────────────────────────────────────────────────────────────────

export async function getDriverStandings(
  year: number
): Promise<StandingsResponse<DriverStanding>> {
  return apiFetch<StandingsResponse<DriverStanding>>(
    `/standings/${year}/drivers`,
    300
  );
}

export async function getConstructorStandings(
  year: number
): Promise<StandingsResponse<ConstructorStanding>> {
  return apiFetch<StandingsResponse<ConstructorStanding>>(
    `/standings/${year}/constructors`,
    300
  );
}

// ── News ─────────────────────────────────────────────────────────────────────

export async function getNews(
  pageSize = 12,
  page = 1,
  sortBy: "publishedAt" | "relevancy" | "popularity" = "publishedAt"
): Promise<NewsResponse> {
  return apiFetch<NewsResponse>(
    `/news?pageSize=${pageSize}&page=${page}&sortBy=${sortBy}`,
    300
  );
}
