"use client";

import React from "react";
import Link from "next/link";
import { MemberInsight, UnitPreference } from "@/types";
import { formatWeight, getBmiCategoryDetails, getGoalTypeDetails } from "@/lib/biometrics";
import { Plus, CaretRight, Fire, Sparkle } from "@phosphor-icons/react";
import { GoalBadge } from "@/components/ui/GoalIcon";

interface MemberCardProps {
  insight: MemberInsight;
  unit: UnitPreference;
  onQuickLog: (memberId: string) => void;
}

export function MemberCard({ insight, unit, onQuickLog }: MemberCardProps) {
  const {
    member,
    currentWeightKg,
    startingWeightKg,
    targetWeightKg,
    netChangeKg,
    goalType,
    goalProgressPercent,
    distanceToTargetKg,
    compositeScore,
    currentBmi,
    streakWeeks,
  } = insight;

  const bmiInfo = getBmiCategoryDetails(currentBmi);
  const goalDetails = getGoalTypeDetails(goalType);

  // Direction-aware progress styling
  const isBulkingSuccess = goalType === "bulking" && netChangeKg > 0;
  const isCuttingSuccess = goalType === "cutting" && netChangeKg < 0;
  const isMaintainingSuccess = goalType === "maintaining" && Math.abs(netChangeKg) <= 0.5;
  const isPositiveDirection = isBulkingSuccess || isCuttingSuccess || isMaintainingSuccess;

  return (
    <div className="plate-card-interactive p-4 space-y-3">
      {/* Header Row: Athlete Monogram, Name, Goal Badge, Quick Log */}
      <div className="flex items-center justify-between">
        <Link href={`/member/${member.id}`} className="flex items-center gap-3 group flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-slate-950 text-base shadow-sm group-hover:scale-105 transition-transform shrink-0 border border-white/10"
            style={{ backgroundColor: member.color || "#D4F63D" }}
          >
            {member.avatar || member.name[0]}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-extrabold text-white group-hover:text-volt-400 transition-colors truncate">
                {member.name}
              </h3>

              {/* Goal Tag Badge with Vector Icon */}
              <GoalBadge goalType={goalType} size="xs" />

              {streakWeeks >= 2 && (
                <span className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-volt-400 px-1.5 py-0.2 rounded bg-volt-500/10 border border-volt-500/25">
                  <Fire size={11} weight="fill" className="text-volt-400" />
                  <span>{streakWeeks}w</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
              <span>
                H: <strong className="text-slate-300 font-semibold">{member.heightCm > 0 ? `${member.heightCm}cm` : "Pending"}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Sparkle size={10} weight="fill" className="text-volt-400" />
                <span>Index: <strong className="text-volt-400">{compositeScore}</strong></span>
              </span>
            </div>
          </div>
        </Link>

        {/* Quick Log Button for this Athlete */}
        <button
          onClick={() => onQuickLog(member.id)}
          className="w-8 h-8 rounded-lg bg-carbon-900 hover:bg-volt-500 hover:text-carbon-950 border border-white/[0.08] flex items-center justify-center text-slate-300 transition-all active:scale-90 shrink-0"
          title={`Log weigh-in for ${member.name}`}
        >
          <Plus size={16} weight="bold" />
        </button>
      </div>

      {/* Telemetry Data Well */}
      <div className="plate-recessed grid grid-cols-3 gap-2 py-2 px-3 text-center font-mono">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Start</span>
          <span className="text-xs font-semibold text-slate-300 tabular-nums">
            {formatWeight(startingWeightKg, unit)}
          </span>
        </div>
        <div className="border-x border-white/[0.08]">
          <span className="text-[9px] uppercase tracking-wider text-volt-400 font-bold block">Current</span>
          <span className="text-sm font-black text-white tabular-nums">
            {formatWeight(currentWeightKg, unit)}
          </span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Target</span>
          <span className="text-xs font-semibold text-slate-300 tabular-nums">
            {targetWeightKg > 0 ? formatWeight(targetWeightKg, unit) : "TBD"}
          </span>
        </div>
      </div>

      {/* Biometrics, Delta Pill, and Target Proximity */}
      <div className="flex items-center justify-between text-xs font-mono pt-0.5">
        {/* Direction-Aware Delta Pill */}
        <div className="flex items-center gap-1.5">
          <span
            className={`font-bold px-2 py-0.5 rounded text-[11px] tabular-nums border ${
              netChangeKg === 0
                ? "bg-white/5 text-slate-400 border-white/10"
                : isPositiveDirection
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-rose-500/10 text-rose-400 border-rose-500/25"
            }`}
          >
            {netChangeKg > 0 ? `+${formatWeight(netChangeKg, unit)}` : netChangeKg < 0 ? `-${formatWeight(Math.abs(netChangeKg), unit)}` : "0.0 kg"}
            {distanceToTargetKg === 0 ? " (Met)" : ` (${formatWeight(distanceToTargetKg, unit)} left)`}
          </span>
        </div>

        {/* BMI Tag */}
        <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${bmiInfo.badgeBg} ${bmiInfo.badgeText}`}>
          {currentBmi > 0 ? `BMI ${currentBmi} • ${bmiInfo.category}` : "Pending Height"}
        </span>
      </div>

      {/* Personal Runway Track */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>{goalDetails.label} Track</span>
          <span className="text-slate-200 font-bold tabular-nums">
            {goalProgressPercent}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded bg-carbon-900 border border-white/[0.05] overflow-hidden">
          <div
            className={`h-full rounded transition-all duration-500 ${
              goalType === "bulking"
                ? "bg-gradient-to-r from-cobalt-500 to-volt-400"
                : goalType === "cutting"
                ? "bg-gradient-to-r from-volt-500 to-emerald-400"
                : "bg-gradient-to-r from-teal-400 to-emerald-400"
            }`}
            style={{ width: `${Math.min(100, Math.max(2, goalProgressPercent))}%` }}
          />
        </div>
      </div>

      {/* Link to Detail Page */}
      <Link
        href={`/member/${member.id}`}
        className="w-full pt-2 flex items-center justify-between text-xs font-mono text-slate-400 hover:text-volt-400 transition-colors border-t border-white/[0.06]"
      >
        <span>Telemetry & Weigh-in History</span>
        <CaretRight size={13} weight="bold" />
      </Link>
    </div>
  );
}
