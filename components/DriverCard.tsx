import Image from "next/image";
import { Driver } from "@/types/f1";

interface Props {
  driver: Driver;
}

export default function DriverCard({ driver }: Props) {
  const teamColor = driver.team_colour ? `#${driver.team_colour}` : "#e10600";

  return (
    <div className="relative bg-[#1a1a2e] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
      {/* Team color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: teamColor }}
      />

      {/* Car number watermark */}
      <span
        className="absolute top-3 right-4 text-6xl font-black opacity-10 leading-none select-none"
        style={{ color: teamColor }}
      >
        {driver.driver_number}
      </span>

      <div className="p-5 pt-6 flex gap-4 items-start">
        {/* Headshot */}
        <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10">
          {driver.headshot_url ? (
            <Image
              src={driver.headshot_url}
              alt={driver.full_name}
              fill
              className="object-cover object-top"
              sizes="80px"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-2xl font-bold"
              style={{ color: teamColor }}
            >
              {driver.name_acronym}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${teamColor}25`, color: teamColor }}
            >
              #{driver.driver_number}
            </span>
            {driver.country_code && (
              <span className="text-xs text-white/40 uppercase tracking-wider">
                {driver.country_code}
              </span>
            )}
          </div>

          <h3 className="text-white font-bold text-base leading-tight truncate">
            {driver.first_name}{" "}
            <span className="uppercase">{driver.last_name}</span>
          </h3>

          <p className="text-white/40 text-xs mt-0.5 font-mono tracking-widest">
            {driver.name_acronym}
          </p>

          {/* Team */}
          <div className="mt-3 flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: teamColor }}
            />
            <span className="text-white/60 text-xs truncate">
              {driver.team_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
