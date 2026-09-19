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
import { calculateMemberInsight, formatWeight, calculateBmi } from "@/lib/biometrics";
import { isMaintainerUnlocked, subscribeToAuthChanges } from "@/lib/auth";
import { Member, WeightLog, UnitPreference } from "@/types";
import { CaretLeft, Plus, PencilSimple, Trash, Fire, CalendarBlank, Target } from "@phosphor-icons/react";

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

      <div className="px-4 py-4 space-y-5">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <CaretLeft size={16} weight="bold" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEditMember}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            >
              <PencilSimple size={14} />
              <span>Edit</span>
            </button>

            <button
              onClick={handleAddLog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-xs font-bold text-slate-950 transition-all shadow-md shadow-amber-500/20"
            >
              <Plus size={14} weight="bold" />
              <span>Log Weight</span>
            </button>
          </div>
        </div>

        {/* Member Profile Hero */}
        <div className="bezel-outer">
          <div className="bezel-inner p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-slate-950 text-2xl shadow-xl shadow-black"
                style={{ backgroundColor: member.color || "#F59E0B" }}
              >
                {member.avatar || member.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-white">{member.name}</h1>
                  {insight.streakWeeks >= 3 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20">
                      <Fire size={13} weight="fill" />
                      <span>{insight.streakWeeks}w streak</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>
                    Height:{" "}
                    <strong className="text-cyan-400 font-bold">
                      {member.heightCm > 0 ? `${member.heightCm} cm` : "Pending"}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>{insight.historyCount} weigh-ins</span>
                </div>
                {member.notes && (
                  <p className="text-xs text-slate-300 italic mt-1.5">"{member.notes}"</p>
                )}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center">
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Start</span>
                <span className="text-xs font-bold text-slate-300 tabular-nums">
                  {formatWeight(insight.startingWeightKg, unit)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-amber-400 font-bold block mb-0.5">Current</span>
                <span className="text-sm font-extrabold text-white tabular-nums">
                  {formatWeight(insight.currentWeightKg, unit)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5">
                <span className="text-[10px] text-slate-400 block mb-0.5">Target</span>
                <span className="text-xs font-bold text-slate-300 tabular-nums">
                  {insight.targetWeightKg > 0 && insight.targetWeightKg !== insight.startingWeightKg
                    ? formatWeight(insight.targetWeightKg, unit)
                    : "TBD"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Weight Chart */}
        <div className="bezel-outer">
          <div className="bezel-inner p-4 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Weight Trend & 7-Day Moving Avg
            </span>
            <InteractiveWeightChart
              logs={logs}
              heightCm={member.heightCm}
              targetWeightKg={member.targetWeightKg}
              unit={unit}
            />
          </div>
        </div>

        {/* Continuous BMI Scale Gauge */}
        <div className="bezel-outer">
          <div className="bezel-inner p-4 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Continuous BMI Gauge
            </span>
            <BMIScaleGauge bmi={insight.currentBmi} />
          </div>
        </div>

        {/* Height-Calibrated Healthy Target Card */}
        <HealthyRangeCard insight={insight} unit={unit} />

        {/* Historical Weigh-in Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Weigh-in History ({reverseLogs.length})
            </span>
            <span className="text-[11px] text-slate-400">Latest first</span>
          </div>

          <div className="space-y-2">
            {reverseLogs.map((log) => {
              const logBmi = calculateBmi(log.weightKg, member.heightCm);
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white tabular-nums">
                        {formatWeight(log.weightKg, unit)}
                      </span>
                      {member.heightCm > 0 && (
                        <span className="text-[11px] font-mono text-cyan-400">
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
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <CalendarBlank size={12} />
                        <span>{log.date}</span>
                      </span>
                      {log.note && <span>• "{log.note}"</span>}
                    </div>
                  </div>

                  {/* Delete button (maintainer only) */}
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
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
