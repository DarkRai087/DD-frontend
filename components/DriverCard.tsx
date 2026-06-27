import Image from "next/image";
import { Driver } from "@/types/f1";

interface Props {
  driver: Driver;
}

export default function DriverCard({ driver }: Props) {
  const teamColor = driver.team_colour ? `#${driver.team_colour}` : "#e10600";

  return (
    <div className="group relative bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/[0.06] hover:border-white/[0.1] hover:bg-[#111] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
      {/* Team color bar */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[3px]"
        style={{ backgroundColor: teamColor }}
      />

      {/* Car number watermark */}
      <span
        className="absolute top-2 right-3 text-5xl font-black opacity-[0.04] leading-none select-none transition-opacity duration-300 group-hover:opacity-[0.08]"
        style={{ color: teamColor }}
      >
        {driver.driver_number}
      </span>

      <div className="p-4 pl-5 flex gap-3.5 items-start">
        {/* Headshot */}
        <div className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden bg-white/[0.03] ring-2 ring-black/40">
          {driver.headshot_url ? (
            <Image
              src={driver.headshot_url}
              alt={driver.full_name}
              fill
              className="object-cover object-top scale-[1.3]"
              sizes="56px"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-lg font-bold"
              style={{ color: teamColor }}
            >
              {driver.name_acronym}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-bold tabular-nums"
              style={{ color: teamColor }}
            >
              #{driver.driver_number}
            </span>
            {driver.country_code && (
              <span className="text-[10px] text-white/25 uppercase tracking-widest">
                {driver.country_code}
              </span>
            )}
          </div>

          <h3 className="text-white font-bold text-sm leading-tight truncate">
            <span className="text-white/50 font-medium">{driver.first_name}</span>{" "}
            <span className="uppercase">{driver.last_name}</span>
          </h3>

          <p 
            className="text-[10px] mt-1 font-bold tracking-widest" 
            style={{ color: teamColor }}
          >
            {driver.name_acronym}
          </p>

          {/* Team */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <div 
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: teamColor }}
            />
            <span className="text-white/35 text-[10px] truncate font-medium">
              {driver.team_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
