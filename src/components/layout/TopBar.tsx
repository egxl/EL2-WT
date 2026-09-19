"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LockSimple, LockSimpleOpen, Barbell } from "@phosphor-icons/react";
import { isMaintainerUnlocked, lockMaintainer, subscribeToAuthChanges } from "@/lib/auth";
import { getUnitPreference, setUnitPreference, subscribeToStorage } from "@/lib/storage";
import { UnitPreference } from "@/types";
import { MaintainerAuthModal } from "@/components/modals/MaintainerAuthModal";

export function TopBar() {
  const [unlocked, setUnlocked] = useState(false);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setUnlocked(isMaintainerUnlocked());
    setUnit(getUnitPreference());

    const unsubAuth = subscribeToAuthChanges((status) => setUnlocked(status));
    const unsubStorage = subscribeToStorage(() => setUnit(getUnitPreference()));

    return () => {
      unsubAuth();
      unsubStorage();
    };
  }, []);

  const handleToggleUnit = () => {
    const nextUnit = unit === "kg" ? "lbs" : "kg";
    setUnit(nextUnit);
    setUnitPreference(nextUnit);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 pt-safe pb-2.5 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="flex items-center justify-between">
          {/* Logo & Cohort Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-carbon-850 border border-white/[0.12] flex items-center justify-center text-white shadow-plate group-active:scale-95 transition-all duration-200">
              <span className="font-extrabold text-xs tracking-wider text-volt-500 font-mono">EL2</span>
              {/* Micro Status Dot */}
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-volt-500 ring-2 ring-carbon-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">ELEMEN 2</span>
                <span className="text-[9px] font-bold font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-volt-500/15 text-volt-400 border border-volt-500/30">
                  SQUAD
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Athletic Weight & Biometrics</p>
            </div>
          </Link>

          {/* Controls: Segmented Unit Toggle & Maintainer Status */}
          <div className="flex items-center gap-2">
            {/* Tactile Segmented Unit Switch */}
            <div className="flex items-center p-0.5 rounded-lg bg-carbon-900 border border-white/[0.08] text-[11px] font-mono">
              <button
                onClick={() => {
                  if (unit !== "kg") {
                    setUnit("kg");
                    setUnitPreference("kg");
                  }
                }}
                className={`px-2 py-1 rounded-md transition-all font-semibold ${
                  unit === "kg"
                    ? "bg-carbon-800 text-volt-400 shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Use Kilograms (kg)"
              >
                kg
              </button>
              <button
                onClick={() => {
                  if (unit !== "lbs") {
                    setUnit("lbs");
                    setUnitPreference("lbs");
                  }
                }}
                className={`px-2 py-1 rounded-md transition-all font-semibold ${
                  unit === "lbs"
                    ? "bg-carbon-800 text-volt-400 shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Use Pounds (lbs)"
              >
                lbs
              </button>
            </div>

            {/* Hardware Maintainer PIN Status Indicator */}
            {unlocked ? (
              <button
                onClick={() => lockMaintainer()}
                className="h-7 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                title="Maintainer active (Tap to lock)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <LockSimpleOpen size={13} weight="bold" />
                <span className="text-[10px] font-mono">ADMIN</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="h-7 px-2.5 rounded-lg bg-carbon-850 hover:bg-carbon-800 border border-white/[0.08] text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
                title="Read-only mode (Tap to unlock PIN)"
              >
                <LockSimple size={13} weight="bold" />
                <span className="text-[10px] font-mono text-slate-400">PIN</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Maintainer PIN Modal */}
      {showAuthModal && (
        <MaintainerAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
