import { getDrivers, getCurrentYear } from "@/lib/api";
import DriverCard from "@/components/DriverCard";
import { Driver } from "@/types/f1";

export default async function DriversPage() {
  let drivers: Driver[] = [];
  let error: string | null = null;

  try {
    drivers = await getDrivers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  const year = getCurrentYear();

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-[#e10600] text-3xl font-black tabular-nums tracking-tight">
            {year}
          </span>
          <h1 className="text-xl font-bold text-white/90 tracking-tight uppercase">
            Drivers
          </h1>
        </div>
        <p className="text-white/20 text-[11px] font-mono mt-1">
          Current grid from OpenF1
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-[#e10600]/20 bg-[#e10600]/5 p-5 mb-6">
          <p className="text-[#e10600] font-semibold text-sm">
            Could not reach the backend API
          </p>
          <p className="text-white/30 text-xs mt-1 font-mono">{error}</p>
        </div>
      )}

      {/* Grid */}
      {drivers.length > 0 ? (
        <>
          <div className="flex items-center gap-4 text-[10px] font-mono text-white/20 mb-4 uppercase tracking-wider">
            <span>{drivers.length} drivers</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {drivers.map((driver) => (
              <DriverCard key={driver.driver_number} driver={driver} />
            ))}
          </div>
        </>
      ) : (
        !error && (
          <p className="text-white/20 text-sm text-center py-20">
            No drivers found.
          </p>
        )
      )}
    </div>
  );
}
