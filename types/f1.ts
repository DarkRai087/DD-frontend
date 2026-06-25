// ── OpenF1 ────────────────────────────────────────────────────────────────────
export interface Driver {
  meeting_key: number;
  session_key: number;
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  first_name: string;
  last_name: string;
  headshot_url: string | null;
  country_code: string | null;
}

// ── Ergast / Jolpica ──────────────────────────────────────────────────────────
export interface Circuit {
  id: string;
  name: string;
  locality: string;
  country: string;
  lat: string;
  long: string;
  url?: string;
}

export interface Race {
  round: number;
  raceName: string;
  date: string;
  time: string | null;
  circuit: Circuit;
  url?: string;
}

export interface PodiumFinisher {
  position: number;
  driver: {
    id: string;
    code: string | null;
    firstName: string;
    lastName: string;
    nationality: string;
  };
  constructor: {
    id: string;
    name: string;
  };
  time: string | null;
}

export interface RaceWinner extends PodiumFinisher {
  round: number;
  raceName: string;
  date: string;
  laps: number;
}

export interface RaceScheduleResponse {
  season: string;
  total: number;
  races: Race[];
}

export interface WinnersResponse {
  season: string;
  winners: Record<number, RaceWinner>;
  podiums: Record<number, PodiumFinisher[]>;
}

export interface DriverStanding {
  position: number;
  points: number;
  wins: number;
  driver: {
    id: string;
    code: string | null;
    firstName: string;
    lastName: string;
    nationality: string;
    url: string;
  };
  constructors: Array<{ id: string; name: string; nationality: string }>;
}

export interface ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  constructor: {
    id: string;
    name: string;
    nationality: string;
    url: string;
  };
}

export interface StandingsResponse<T> {
  season: string;
  round: number;
  standings: T[];
}

// ── News ───────────────────────────────────────────────────────────────────────
export interface NewsArticle {
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  page: number;
  pageSize: number;
  articles: NewsArticle[];
  lastUpdated: number;
  fromCache: boolean;
  nextUpdate: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

// ── Race Details ────────────────────────────────────────────────────────────

export interface RaceResultDriver {
  id: string;
  code: string | null;
  firstName: string;
  lastName: string;
  nationality: string;
  dateOfBirth?: string;
}

export interface RaceResultConstructor {
  id: string;
  name: string;
  nationality?: string;
}

export interface FastestLap {
  rank: number;
  lap: number;
  time: string | null;
  speed: {
    value: string;
    units: string;
  } | null;
}

export interface RaceResult {
  position: number;
  positionText: string;
  number: number;
  driver: RaceResultDriver;
  constructor: RaceResultConstructor;
  grid: number;
  laps: number;
  status: string;
  time: string | null;
  millis: number | null;
  points: number;
  fastestLap: FastestLap | null;
}

export interface QualifyingResult {
  position: number;
  number: number;
  driver: {
    id: string;
    code: string | null;
    firstName: string;
    lastName: string;
  };
  constructor: {
    id: string;
    name: string;
  };
  q1: string | null;
  q2: string | null;
  q3: string | null;
}

export interface SessionResultRow {
  position: number;
  positionText: string;
  number: number;
  driver: {
    code: string | null;
    firstName: string;
    lastName: string;
  };
  constructor: {
    name: string;
    color: string | null;
  };
  time: string | null;
  laps: number | null;
  status: string | null;
  isClassified: boolean;
  points: number | null;
  grid: number | null;
  components: Record<string, { key: string; name: string; position: number; time: string }>;
}

export interface SessionData {
  code: string;
  title: string;
  results: SessionResultRow[];
}

export interface RaceDetailsResponse {
  season: string;
  round: number;
  raceName: string;
  date: string;
  time: string | null;
  url: string;
  circuit: Circuit;
  totalLaps: number;
  isSprintWeekend: boolean;
  availableSessions: string[];
  raceResults: RaceResult[];
  qualifyingResults: QualifyingResult[];
  sprintResults: RaceResult[];
  sessions: Record<string, SessionData>;
}
