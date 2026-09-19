"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Trophy, Heartbeat, Gear, Plus } from "@phosphor-icons/react";
import { isMaintainerUnlocked, subscribeToAuthChanges } from "@/lib/auth";
import { MaintainerAuthModal } from "@/components/modals/MaintainerAuthModal";
import { LogWeightModal } from "@/components/modals/LogWeightModal";

export function FluidBottomNav() {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    setUnlocked(isMaintainerUnlocked());
    return subscribeToAuthChanges((status) => setUnlocked(status));
  }, []);

  const handleLogClick = () => {
    if (unlocked) {
      setShowLogModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const navItems = [
    { label: "Home", href: "/", icon: House },
    { label: "Ranks", href: "/leaderboard", icon: Trophy },
    { label: "Insights", href: "/insights", icon: Heartbeat },
    { label: "Settings", href: "/settings", icon: Gear },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-safe pt-1 pointer-events-none">
        <div className="pointer-events-auto mb-2 px-3 py-1.5 rounded-2xl bg-carbon-900/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl shadow-black/80 flex items-center justify-between">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
              pathname === "/" ? "text-volt-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <House size={20} weight={pathname === "/" ? "fill" : "regular"} />
            <span className="text-[10px] tracking-tight">Squad</span>
            {pathname === "/" && (
              <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-volt-500 shadow-volt-glow" />
            )}
          </Link>

          {/* Leaderboard */}
          <Link
            href="/leaderboard"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
              pathname === "/leaderboard" ? "text-volt-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Trophy size={20} weight={pathname === "/leaderboard" ? "fill" : "regular"} />
            <span className="text-[10px] tracking-tight">Ranks</span>
            {pathname === "/leaderboard" && (
              <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-volt-500 shadow-volt-glow" />
            )}
          </Link>

          {/* Center Prominent Kinetic Volt "+ Log" Action Button */}
          <div className="flex items-center justify-center -my-3 px-1">
            <button
              onClick={handleLogClick}
              className="w-12 h-12 rounded-2xl bg-volt-500 text-carbon-950 font-black flex items-center justify-center shadow-lg shadow-volt-500/30 active:scale-90 hover:scale-105 transition-all duration-200 border-2 border-carbon-950"
              title="Record weigh-in"
            >
              <Plus size={24} weight="bold" />
            </button>
          </div>

          {/* Insights */}
          <Link
            href="/insights"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
              pathname === "/insights" ? "text-volt-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Heartbeat size={20} weight={pathname === "/insights" ? "fill" : "regular"} />
            <span className="text-[10px] tracking-tight">Telemetry</span>
            {pathname === "/insights" && (
              <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-volt-500 shadow-volt-glow" />
            )}
          </Link>

          {/* Settings */}
          <Link
            href="/settings"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
              pathname === "/settings" ? "text-volt-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gear size={20} weight={pathname === "/settings" ? "fill" : "regular"} />
            <span className="text-[10px] tracking-tight">Config</span>
            {pathname === "/settings" && (
              <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-volt-500 shadow-volt-glow" />
            )}
          </Link>
        </div>
      </nav>

      {/* Maintainer Auth Modal */}
      {showAuthModal && (
        <MaintainerAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            setShowLogModal(true);
          }}
          actionDescription="log a new weigh-in"
        />
      )}

      {/* Log Weight Modal */}
      {showLogModal && (
        <LogWeightModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          initialMode="bulk"
        />
      )}
    </>
  );
}
