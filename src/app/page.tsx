"use client";

import React, { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { FluidBottomNav } from "@/components/layout/FluidBottomNav";
import { CohortHero } from "@/components/dashboard/CohortHero";
import { MemberCard } from "@/components/dashboard/MemberCard";
import { LogWeightModal } from "@/components/modals/LogWeightModal";
import { MemberModal } from "@/components/modals/MemberModal";
import { MaintainerAuthModal } from "@/components/modals/MaintainerAuthModal";
import { getMembers, getWeightLogs, getUnitPreference, subscribeToStorage } from "@/lib/storage";
import { calculateCohortSummary, calculateMemberInsight } from "@/lib/biometrics";
import { isMaintainerUnlocked, subscribeToAuthChanges } from "@/lib/auth";
import { Member, WeightLog, UnitPreference } from "@/types";
import { Plus, UserPlus, Sparkle, Users } from "@phosphor-icons/react";

export default function HomePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [unlocked, setUnlocked] = useState(false);

  // Modal states
  const [showLogModal, setShowLogModal] = useState(false);
  const [logMode, setLogMode] = useState<"bulk" | "single">("bulk");
  const [targetMemberId, setTargetMemberId] = useState<string | undefined>(undefined);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"log" | "addMember" | null>(null);

  const loadData = () => {
    setMembers(getMembers());
    setLogs(getWeightLogs());
    setUnit(getUnitPreference());
    setUnlocked(isMaintainerUnlocked());
  };

  useEffect(() => {
    loadData();
    const unsubStorage = subscribeToStorage(() => loadData());
    const unsubAuth = subscribeToAuthChanges((status) => setUnlocked(status));

    return () => {
      unsubStorage();
      unsubAuth();
    };
  }, []);

  const cohortSummary = calculateCohortSummary(members, logs);
  const memberInsights = members.map((m) => calculateMemberInsight(m, logs));

  const handleWeeklyBulkLog = () => {
    setTargetMemberId(undefined);
    setLogMode("bulk");
    if (unlocked) {
      setShowLogModal(true);
    } else {
      setPendingAction("log");
      setShowAuthModal(true);
    }
  };

  const handleQuickLog = (memberId: string) => {
    setTargetMemberId(memberId);
    setLogMode("single");
    if (unlocked) {
      setShowLogModal(true);
    } else {
      setPendingAction("log");
      setShowAuthModal(true);
    }
  };

  const handleAddMember = () => {
    if (unlocked) {
      setShowMemberModal(true);
    } else {
      setPendingAction("addMember");
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingAction === "log") {
      setShowLogModal(true);
    } else if (pendingAction === "addMember") {
      setShowMemberModal(true);
    }
    setPendingAction(null);
  };

  return (
    <main className="flex-1 flex flex-col pb-28">
      <TopBar />

      <div className="px-4 py-4 space-y-5">
        {/* Cohort Hero Banner */}
        <CohortHero summary={cohortSummary} unit={unit} />

        {/* Weekly Weigh-In Maintainer Action Banner */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleWeeklyBulkLog}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-volt-500 hover:bg-volt-400 text-carbon-950 font-black text-xs shadow-lg shadow-volt-500/20 active:scale-[0.98] transition-all tracking-tight"
          >
            <Users size={17} weight="bold" />
            <span>START WEEKLY WEIGH-IN SESSION</span>
          </button>

          <button
            onClick={handleAddMember}
            className="flex items-center gap-1.5 py-3 px-3.5 rounded-xl bg-carbon-850 hover:bg-carbon-800 active:scale-95 border border-white/[0.08] text-xs font-bold text-slate-200 transition-all shrink-0"
            title="Add Athlete"
          >
            <UserPlus size={16} className="text-volt-400" />
            <span className="hidden sm:inline">Add Athlete</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Squad Roster
            </h2>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-carbon-800 text-volt-400 border border-white/[0.06]">
              {members.length} ATHLETES
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">TAP CARD FOR TELEMETRY</span>
        </div>

        {/* Members Grid */}
        <div className="space-y-3">
          {memberInsights.map((insight) => (
            <MemberCard
              key={insight.member.id}
              insight={insight}
              unit={unit}
              onQuickLog={handleQuickLog}
            />
          ))}

          {members.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <p className="text-sm text-slate-400">No members in Elemen 2 yet.</p>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Add First Member
              </button>
            </div>
          )}
        </div>
      </div>

      <FluidBottomNav />

      {/* Modals */}
      {showLogModal && (
        <LogWeightModal
          isOpen={showLogModal}
          onClose={() => {
            setShowLogModal(false);
            setTargetMemberId(undefined);
          }}
          preselectedMemberId={targetMemberId}
          initialMode={logMode}
        />
      )}

      {showMemberModal && (
        <MemberModal
          isOpen={showMemberModal}
          onClose={() => setShowMemberModal(false)}
        />
      )}

      {showAuthModal && (
        <MaintainerAuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
          actionDescription={pendingAction === "addMember" ? "add a new member" : "log a weigh-in"}
        />
      )}
    </main>
  );
}
