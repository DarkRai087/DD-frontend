import {
  getCurrentYear,
  getDriverStandings,
  getConstructorStandings,
  getRaceWinners,
  getDrivers,
} from "@/lib/api";
import { DriverStanding, ConstructorStanding, StandingsResponse } from "@/types/f1";
import StandingsClient from "@/components/StandingsClient";

export default async function StandingsPage() {
  const year = getCurrentYear();

  const [driverData, constructorData, winnersData, openF1Drivers] = await Promise.all([
    getDriverStandings(year).catch((): null => null),
    getConstructorStandings(year).catch((): null => null),
    getRaceWinners(year).catch((): null => null),
    getDrivers().catch((): [] => []),
  ]);

  // Build podium count maps from all top-3 finishers across every round
  const driverPodiums: Record<string, number> = {};
  const constructorPodiums: Record<string, number> = {};

  if (winnersData?.podiums) {
    for (const finishers of Object.values(winnersData.podiums)) {
      for (const f of finishers) {
        driverPodiums[f.driver.id] = (driverPodiums[f.driver.id] ?? 0) + 1;
        constructorPodiums[f.constructor.id] =
          (constructorPodiums[f.constructor.id] ?? 0) + 1;
      }
    }
  }

  // Build lastName (lowercase) → headshot_url map from OpenF1
  const headshotMap: Record<string, string> = {};
  for (const d of openF1Drivers) {
    if (d.headshot_url) {
      headshotMap[d.last_name.toLowerCase()] = d.headshot_url;
    }
  }

  return (
    <StandingsClient
      driverData={driverData as StandingsResponse<DriverStanding> | null}
      constructorData={constructorData as StandingsResponse<ConstructorStanding> | null}
      driverPodiums={driverPodiums}
      constructorPodiums={constructorPodiums}
      headshotMap={headshotMap}
      year={year}
    />
  );
}
