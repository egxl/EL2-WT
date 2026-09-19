"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { FluidBottomNav } from "@/components/layout/FluidBottomNav";
import { InteractiveWeightChart } from "@/components/charts/InteractiveWeightChart";
import { BMIScaleGauge } from "@/components/insights/BMIScaleGauge";
import { HealthyRangeCard } from "@/components/insights/HealthyRangeCard";
import { LogWeightModal } from "@/components/modals/LogWeightModal";
import { MemberModal } from "@/components/modals/MemberModal";
import { MaintainerAuthModal } from "@/components/modals/MaintainerAuthModal";
import { getMemberById, getMemberWeightLogs, getUnitPreference, deleteWeightLog, subscribeToStorage } from "@/lib/storage";
import { calculateMemberInsight, formatWeight, calculateBmi, getGoalTypeDetails } from "@/lib/biometrics";
import { isMaintainerUnlocked, subscribeToAuthChanges } from "@/lib/auth";
import { Member, WeightLog, UnitPreference } from "@/types";
import { CaretLeft, Plus, PencilSimple, Trash, Fire, CalendarBlank, Target, Sparkle } from "@phosphor-icons/react";

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const [member, setMember] = useState<Member | undefined>(undefined);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [unlocked, setUnlocked] = useState(false);

  // Modals
  const [showLogModal, setShowLogModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"log" | "edit" | "deleteLog" | null>(null);
  const [targetLogIdToDelete, setTargetLogIdToDelete] = useState<string | null>(null);

  const loadData = () => {
    const mem = getMemberById(memberId);
    setMember(mem);
    setLogs(getMemberWeightLogs(memberId));
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
  }, [memberId]);

  if (!member) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-slate-400 text-sm mb-3">Member not found in Elemen 2.</p>
        <Link href="/" className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
          Back to Dashboard
        </Link>
      </main>
    );
  }

  const insight = calculateMemberInsight(member, logs);

  const handleEditMember = () => {
    if (unlocked) {
      setShowEditMemberModal(true);
    } else {
      setPendingAction("edit");
      setShowAuthModal(true);
    }
  };

  const handleAddLog = () => {
    if (unlocked) {
      setShowLogModal(true);
    } else {
      setPendingAction("log");
      setShowAuthModal(true);
    }
  };

  const handleDeleteLog = (logId: string) => {
    if (unlocked) {
      deleteWeightLog(logId);
    } else {
      setTargetLogIdToDelete(logId);
      setPendingAction("deleteLog");
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingAction === "edit") {
      setShowEditMemberModal(true);
    } else if (pendingAction === "log") {
      setShowLogModal(true);
    } else if (pendingAction === "deleteLog" && targetLogIdToDelete) {
      deleteWeightLog(targetLogIdToDelete);
      setTargetLogIdToDelete(null);
    }
    setPendingAction(null);
  };

  // Reverse logs for display in timeline
  const reverseLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="flex-1 flex flex-col pb-28">
      <TopBar />

      <div className="px-4 py-4 space-y-4 font-mono">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <CaretLeft size={16} weight="bold" />
            <span>Squad Roster</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEditMember}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon-850 hover:bg-carbon-800 active:scale-95 border border-white/[0.08] text-xs font-semibold text-slate-200 transition-all"
            >
              <PencilSimple size={13} />
              <span>Edit</span>
            </button>

            <button
              onClick={handleAddLog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-volt-500 hover:bg-volt-400 active:scale-95 text-xs font-black text-carbon-950 transition-all shadow-volt-glow"
            >
              <Plus size={14} weight="bold" />
              <span>Log Weigh-In</span>
            </button>
          </div>
        </div>

        {/* Athlete Profile Hero */}
        <div className="plate-card p-5 space-y-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-slate-950 text-xl shadow-md shrink-0 border border-white/10"
              style={{ backgroundColor: member.color || "#D4F63D" }}
            >
              {member.avatar || member.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-black text-white font-sans truncate">{member.name}</h1>
                
                {/* Goal Badge */}
                {(() => {
                  const goalDetails = getGoalTypeDetails(insight.goalType);
                  return (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${goalDetails.badgeBg} ${goalDetails.badgeText}`}>
                      <span>{goalDetails.icon}</span>
                      <span>{goalDetails.label}</span>
                    </span>
                  );
                })()}

                {insight.streakWeeks >= 2 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-volt-400 px-1.5 py-0.2 rounded bg-volt-500/10 border border-volt-500/25">
                    <Fire size={12} weight="fill" />
                    <span>{insight.streakWeeks}w streak</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                <span>
                  H: <strong className="text-slate-300 font-bold">{member.heightCm > 0 ? `${member.heightCm}cm` : "Pending"}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span>{insight.historyCount} logs</span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Sparkle size={11} weight="fill" className="text-volt-400" />
                  <span>Index: <strong className="text-volt-400">{insight.compositeScore}</strong> pts</span>
                </span>
              </div>
              {member.notes && (
                <p className="text-[11px] text-slate-400 italic mt-1 font-sans">"{member.notes}"</p>
              )}
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.06] text-center">
            <div className="plate-recessed p-2.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Start</span>
              <span className="text-xs font-bold text-slate-300 tabular-nums">
                {formatWeight(insight.startingWeightKg, unit)}
              </span>
            </div>
            <div className="plate-recessed p-2.5 border-volt-500/30 bg-volt-500/[0.04]">
              <span className="text-[9px] uppercase tracking-wider text-volt-400 font-bold block mb-0.5">Current</span>
              <span className="text-sm font-black text-white tabular-nums">
                {formatWeight(insight.currentWeightKg, unit)}
              </span>
            </div>
            <div className="plate-recessed p-2.5">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">Target</span>
              <span className="text-xs font-bold text-slate-300 tabular-nums">
                {formatWeight(insight.targetWeightKg, unit)}
              </span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">
                {insight.distanceToTargetKg === 0 ? "Met!" : `${formatWeight(insight.distanceToTargetKg, unit)} left`}
              </span>
            </div>
            <div className="plate-recessed p-2.5">
              <span className="text-[9px] uppercase tracking-wider text-cobalt-400 font-bold block mb-0.5">Ideal (22.0)</span>
              <span className="text-xs font-bold text-cobalt-200 tabular-nums">
                {insight.idealWeightKg > 0 ? formatWeight(insight.idealWeightKg, unit) : "Pending"}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {insight.distanceToIdealKg === 0 ? "Bullseye" : `±${formatWeight(insight.distanceToIdealKg, unit)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Weight Chart */}
        <div className="plate-card p-4 space-y-2">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider block font-sans">
            Telemetry Trend & 7-Day Moving Average
          </span>
          <InteractiveWeightChart
            logs={logs}
            heightCm={member.heightCm}
            targetWeightKg={member.targetWeightKg}
            unit={unit}
          />
        </div>

        {/* Continuous BMI Scale Gauge */}
        <div className="plate-card p-4 space-y-2">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider block font-sans">
            WHO Caliper Scale
          </span>
          <BMIScaleGauge bmi={insight.currentBmi} />
        </div>

        {/* Height-Calibrated Healthy Target Card */}
        <HealthyRangeCard insight={insight} unit={unit} />

        {/* Historical Weigh-in Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Weigh-In Timeline ({reverseLogs.length})
            </span>
            <span className="text-[10px] text-slate-400">Chronological</span>
          </div>

          <div className="space-y-2">
            {reverseLogs.map((log) => {
              const logBmi = calculateBmi(log.weightKg, member.heightCm);
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-carbon-850 border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white tabular-nums">
                        {formatWeight(log.weightKg, unit)}
                      </span>
                      {member.heightCm > 0 && (
                        <span className="text-[10px] text-cobalt-400">
                          BMI {logBmi}
                        </span>
                      )}
                      {log.mood && (
                        <span className="text-xs">
                          {log.mood === "great" && "🔥"}
                          {log.mood === "good" && "⚡"}
                          {log.mood === "steady" && "🧘"}
                          {log.mood === "tough" && "💪"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <CalendarBlank size={12} />
                        <span>{log.date}</span>
                      </span>
                      {log.note && <span className="font-sans">"{log.note}"</span>}
                    </div>
                  </div>

                  {/* Delete button (maintainer only) */}
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="w-7 h-7 rounded-lg bg-carbon-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                    title="Delete this weigh-in"
                  >
                    <Trash size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FluidBottomNav />

      {/* Modals */}
      {showLogModal && (
        <LogWeightModal
          isOpen={showLogModal}
          onClose={() => setShowLogModal(false)}
          preselectedMemberId={member.id}
          initialMode="single"
        />
      )}

      {showEditMemberModal && (
        <MemberModal
          isOpen={showEditMemberModal}
          onClose={() => setShowEditMemberModal(false)}
          memberToEdit={member}
          onSaved={() => {
            setShowEditMemberModal(false);
            loadData();
          }}
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
          actionDescription={
            pendingAction === "edit"
              ? `edit ${member.name}'s details`
              : pendingAction === "deleteLog"
              ? "delete this weigh-in record"
              : "log a weigh-in"
          }
        />
      )}
    </main>
  );
}
