import { getDrivers, getCurrentYear } from "@/lib/api";
import DriverCard from "@/components/DriverCard";

export default async function DriversPage() {
  let drivers = [];
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
        <h1 className="text-2xl font-black tracking-tight">
          <span className="text-[#e10600]">{year}</span> Drivers
        </h1>
        <p className="text-white/30 text-xs mt-0.5">
          Current grid from OpenF1 live data
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 mb-6">
          <p className="text-red-400 font-semibold text-sm">
            Could not reach the backend API
          </p>
          <p className="text-red-400/60 text-xs mt-1">{error}</p>
        </div>
      )}

      {/* Grid */}
      {drivers.length > 0 ? (
        <>
          <p className="text-white/25 text-xs font-mono mb-4">
            {drivers.length} drivers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
