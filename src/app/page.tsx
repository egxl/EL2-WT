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
import { Plus, UserPlus, Sparkle } from "@phosphor-icons/react";

export default function HomePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [unlocked, setUnlocked] = useState(false);

  // Modal states
  const [showLogModal, setShowLogModal] = useState(false);
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

  const handleQuickLog = (memberId: string) => {
    setTargetMemberId(memberId);
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

        {/* Section Header & Add Member Trigger */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Elemen 2 Members</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              {members.length}
            </span>
          </div>

          <button
            onClick={handleAddMember}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
          >
            <UserPlus size={15} className="text-amber-400" />
            <span>Add Member</span>
          </button>
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
