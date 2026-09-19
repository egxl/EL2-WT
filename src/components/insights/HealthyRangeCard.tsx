"use client";

import React from "react";
import { MemberInsight, UnitPreference } from "@/types";
import { formatWeight, kgToLbs } from "@/lib/biometrics";
import { ShieldCheck, Target, TrendDown, CalendarCheck } from "@phosphor-icons/react";

interface HealthyRangeCardProps {
  insight: MemberInsight;
  unit: UnitPreference;
}

export function HealthyRangeCard({ insight, unit }: HealthyRangeCardProps) {
  const { member, currentWeightKg, healthyWeightRange, kgToHealthyRange, weeklyRateKg, projectedWeeksToGoal } = insight;

  const isInHealthyZone = currentWeightKg >= healthyWeightRange.minKg && currentWeightKg <= healthyWeightRange.maxKg;

  const displayMin = unit === "lbs" ? `${kgToLbs(healthyWeightRange.minKg)} lbs` : `${healthyWeightRange.minKg} kg`;
  const displayMax = unit === "lbs" ? `${kgToLbs(healthyWeightRange.maxKg)} lbs` : `${healthyWeightRange.maxKg} kg`;

  return (
    <div className="bezel-outer">
      <div className="bezel-inner p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <ShieldCheck size={18} weight="duotone" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Healthy Range Target</h4>
              <p className="text-[11px] text-slate-400">Calculated for height: {member.heightCm} cm</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {displayMin} – {displayMax}
          </span>
        </div>

        {/* Status Callout Banner */}
        {isInHealthyZone ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-emerald-300 font-medium">
              <strong>{member.name}</strong> is in the <strong>optimal healthy BMI zone</strong>!
            </p>
          </div>
        ) : currentWeightKg > healthyWeightRange.maxKg ? (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
            <Target size={18} className="text-amber-400 shrink-0" weight="bold" />
            <p className="text-xs text-amber-300">
              Needs to shed <strong className="font-bold underline">{formatWeight(kgToHealthyRange, unit)}</strong> to reach healthy BMI (&lt;25.0).
            </p>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center gap-2.5">
            <Target size={18} className="text-sky-400 shrink-0" weight="bold" />
            <p className="text-xs text-sky-300">
              Needs to gain <strong className="font-bold">{formatWeight(kgToHealthyRange, unit)}</strong> to reach normal range (&gt;18.5).
            </p>
          </div>
        )}

        {/* Velocity and Projection Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <TrendDown size={13} className="text-emerald-400" />
              <span>Weekly Pace</span>
            </div>
            <p className="text-sm font-bold text-white tabular-nums">
              {weeklyRateKg > 0 ? `-${weeklyRateKg.toFixed(2)} kg/wk` : weeklyRateKg < 0 ? `+${Math.abs(weeklyRateKg).toFixed(2)} kg/wk` : "Steady"}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <CalendarCheck size={13} className="text-amber-400" />
              <span>Pace to Goal</span>
            </div>
            <p className="text-sm font-bold text-white tabular-nums">
              {projectedWeeksToGoal ? `~${projectedWeeksToGoal} wks remaining` : "On track"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
