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
      <header className="sticky top-0 z-40 w-full px-4 pt-safe pb-3 bg-[#07090E]/85 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between">
          {/* Logo & Cohort Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-active:scale-95 transition-transform duration-200">
              <Barbell size={20} weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-white tracking-tight">Elemen 2</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  Cohort
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">Close Group Tracker</p>
            </div>
          </Link>

          {/* Controls: Unit Toggle & Maintainer Status */}
          <div className="flex items-center gap-2">
            {/* Unit Toggle Button */}
            <button
              onClick={handleToggleUnit}
              className="h-8 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 flex items-center gap-1"
              title="Toggle weight unit"
            >
              <span className={unit === "kg" ? "text-amber-400 font-bold" : "text-slate-400"}>kg</span>
              <span className="text-slate-600">/</span>
              <span className={unit === "lbs" ? "text-amber-400 font-bold" : "text-slate-400"}>lbs</span>
            </button>

            {/* Maintainer PIN Lock / Unlock */}
            {unlocked ? (
              <button
                onClick={() => lockMaintainer()}
                className="h-8 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
                title="Maintainer mode active (Click to lock)"
              >
                <LockSimpleOpen size={14} weight="bold" />
                <span className="hidden xs:inline text-[11px]">Maintainer</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="h-8 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
                title="Read-only mode (Click to unlock maintainer access)"
              >
                <LockSimple size={14} weight="bold" />
                <span className="hidden xs:inline text-[11px]">Locked</span>
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
