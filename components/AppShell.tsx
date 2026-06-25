"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0d0d1a] text-white overflow-hidden">
      {/* Hover trigger strip — always visible on left edge, opens sidebar on mouse enter */}
      <div
        className="fixed top-0 left-0 h-full w-2 z-40 cursor-pointer"
        onMouseEnter={() => setSidebarOpen(true)}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMouseLeave={() => setSidebarOpen(false)}
      />

      {/* Main content — full width since sidebar now overlays */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
