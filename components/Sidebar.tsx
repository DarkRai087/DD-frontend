"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  onMouseLeave: () => void;
}

const navLinks = [
  {
    href: "/",
    label: "Race Calendar",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/drivers",
    label: "Drivers",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/standings",
    label: "Standings",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/news",
    label: "News",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
];

export default function Sidebar({ open, onClose, onMouseLeave }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-x-0 shadow-2xl shadow-black/80" : "-translate-x-full"}`}
        onMouseLeave={onMouseLeave}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06] shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#e10600] flex items-center justify-center font-black text-sm text-white shrink-0 shadow-lg shadow-[#e10600]/20">
            F1
          </div>
          <div className="min-w-0">
            <span className="font-bold text-white tracking-tight whitespace-nowrap block">
              F1 Dashboard
            </span>
            <span className="text-[10px] text-white/30 font-mono">
              Live Data
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-label px-3 mb-3">
            Navigation
          </p>
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap active:scale-[0.98] ${active ? "bg-[#e10600] text-white shadow-lg shadow-[#e10600]/20" : "text-white/50 hover:text-white hover:bg-white/[0.06]"}`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.06] shrink-0">
          <p className="text-[10px] text-white/25 font-mono whitespace-nowrap">
            Powered by OpenF1 & Ergast
          </p>
        </div>
      </aside>
    </>
  );
}
