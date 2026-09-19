"use client";

import React from "react";
import Link from "next/link";
import { MemberInsight, UnitPreference } from "@/types";
import { formatWeight, getBmiCategoryDetails, getGoalTypeDetails } from "@/lib/biometrics";
import { Plus, CaretRight, Fire, Sparkle } from "@phosphor-icons/react";

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
    <div className="bezel-outer transition-all duration-200 hover:border-white/20">
      <div className="bezel-inner p-4 space-y-3">
        {/* Header Row: Avatar, Name, Goal Badge, Height */}
        <div className="flex items-center justify-between">
          <Link href={`/member/${member.id}`} className="flex items-center gap-3 group flex-1">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-slate-950 text-base shadow-md group-hover:scale-105 transition-transform shrink-0"
              style={{ backgroundColor: member.color || "#F59E0B" }}
            >
              {member.avatar || member.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {member.name}
                </h3>

                {/* Goal Tag Badge */}
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${goalDetails.badgeBg} ${goalDetails.badgeText}`}>
                  <span>{goalDetails.icon}</span>
                  <span>{goalDetails.label}</span>
                </span>

                {streakWeeks >= 3 && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Fire size={12} weight="fill" />
                    <span>{streakWeeks}w</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>
                  Height:{" "}
                  <strong className="text-slate-300 font-semibold">
                    {member.heightCm > 0 ? `${member.heightCm} cm` : "Pending"}
                  </strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <Sparkle size={11} weight="fill" />
                  <span>Index: <strong>{compositeScore}</strong></span>
                </span>
              </div>
            </div>
          </Link>

          {/* Quick Log Button for this Member */}
          <button
            onClick={() => onQuickLog(member.id)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 border border-white/10 flex items-center justify-center text-slate-300 transition-all active:scale-90 shrink-0"
            title={`Log weigh-in for ${member.name}`}
          >
            <Plus size={16} weight="bold" />
          </button>
        </div>

        {/* Weights Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/5 border border-white/5 text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Start</span>
            <span className="text-xs font-semibold text-slate-300 tabular-nums">
              {formatWeight(startingWeightKg, unit)}
            </span>
          </div>
          <div className="border-x border-white/10">
            <span className="text-[10px] text-amber-400 font-bold block">Current</span>
            <span className="text-sm font-black text-white tabular-nums">
              {formatWeight(currentWeightKg, unit)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Target</span>
            <span className="text-xs font-semibold text-slate-300 tabular-nums">
              {targetWeightKg > 0 ? formatWeight(targetWeightKg, unit) : "TBD"}
            </span>
          </div>
        </div>

        {/* Biometrics, Delta Pill, and Target Proximity */}
        <div className="flex items-center justify-between text-xs pt-1">
          {/* Direction-Aware Delta Pill */}
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold px-2 py-0.5 rounded-full text-xs tabular-nums border ${
                netChangeKg === 0
                  ? "bg-white/5 text-slate-400 border-white/10"
                  : isPositiveDirection
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 border-rose-500/30"
              }`}
            >
              {netChangeKg > 0 ? `+${formatWeight(netChangeKg, unit)}` : netChangeKg < 0 ? `-${formatWeight(Math.abs(netChangeKg), unit)}` : "0.0 kg"}
              {distanceToTargetKg === 0 ? " (Met)" : ` (${formatWeight(distanceToTargetKg, unit)} to go)`}
            </span>
          </div>

          {/* BMI Pill */}
          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${bmiInfo.badgeBg} ${bmiInfo.badgeText}`}>
            {currentBmi > 0 ? `BMI ${currentBmi} (${bmiInfo.category})` : "Pending Height"}
          </span>
        </div>

        {/* Progress Bar towards personal target */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Goal Journey ({goalDetails.label})</span>
            <span className="text-slate-200 font-bold tabular-nums">
              {goalProgressPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                goalType === "bulking"
                  ? "bg-gradient-to-r from-indigo-500 to-emerald-400"
                  : goalType === "cutting"
                  ? "bg-gradient-to-r from-amber-500 to-emerald-400"
                  : "bg-gradient-to-r from-teal-500 to-emerald-400"
              }`}
              style={{ width: `${Math.min(100, Math.max(2, goalProgressPercent))}%` }}
            />
          </div>
        </div>

        {/* Link to Detail Page */}
        <Link
          href={`/member/${member.id}`}
          className="w-full pt-2 flex items-center justify-between text-xs text-slate-400 hover:text-amber-400 transition-colors border-t border-white/5"
        >
          <span>View BMI graph & log history</span>
          <CaretRight size={14} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
