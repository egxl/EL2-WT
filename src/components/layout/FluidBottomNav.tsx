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
      <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-safe pt-1 pointer-events-none">
        <div className="pointer-events-auto mb-2.5 px-3 py-2 rounded-2xl bg-[#0D1117]/90 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/80 flex items-center justify-between">
          {/* First 2 items */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              pathname === "/" ? "text-amber-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <House size={20} weight={pathname === "/" ? "fill" : "regular"} />
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          <Link
            href="/leaderboard"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              pathname === "/leaderboard" ? "text-amber-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Trophy size={20} weight={pathname === "/leaderboard" ? "fill" : "regular"} />
            <span className="text-[10px] tracking-tight">Ranks</span>
          </Link>

          {/* Center Prominent "+ Log" Action Button */}
          <div className="flex items-center justify-center -my-2">
            <button
              onClick={handleLogClick}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-extrabold flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-90 hover:scale-105 transition-all duration-200"
              title="Record weigh-in"
            >
              <Plus size={22} weight="bold" />
            </button>
          </div>

          {/* Last 2 items */}
          <Link
            href="/insights"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              pathname === "/insights" ? "text-amber-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Heartbeat size={20} weight={pathname === "/insights" ? "fill" : "regular"} />
            <span className="text-[10px] tracking-tight">Insights</span>
          </Link>

          <Link
            href="/settings"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              pathname === "/settings" ? "text-amber-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Gear size={20} weight={pathname === "/settings" ? "fill" : "regular"} />
            <span className="text-[10px] tracking-tight">Settings</span>
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
        />
      )}
    </>
  );
}
