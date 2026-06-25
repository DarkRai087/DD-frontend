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
