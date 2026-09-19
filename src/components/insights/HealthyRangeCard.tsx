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
  const hasHeight = member.heightCm > 0;

  const isInHealthyZone = hasHeight && currentWeightKg >= healthyWeightRange.minKg && currentWeightKg <= healthyWeightRange.maxKg;

  const displayMin = unit === "lbs" ? `${kgToLbs(healthyWeightRange.minKg)} lbs` : `${healthyWeightRange.minKg} kg`;
  const displayMax = unit === "lbs" ? `${kgToLbs(healthyWeightRange.maxKg)} lbs` : `${healthyWeightRange.maxKg} kg`;

  return (
    <div className="plate-card p-4 space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cobalt-500/15 border border-cobalt-500/30 text-cobalt-400 flex items-center justify-center">
            <ShieldCheck size={18} weight="duotone" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Optimal WHO Target</h4>
            <p className="text-[10px] text-slate-400">
              {hasHeight ? `Calibrated for: ${member.heightCm} cm` : "Height metric pending"}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-volt-400">
          {hasHeight ? `${displayMin} – ${displayMax}` : "Pending"}
        </span>
      </div>

      {/* Status Callout Banner */}
      {!hasHeight ? (
        <div className="p-2.5 rounded-lg bg-carbon-900 border border-white/[0.08] flex items-center gap-2.5">
          <Target size={16} className="text-slate-400 shrink-0" weight="bold" />
          <p className="text-[11px] text-slate-300 font-sans">
            Optimal target range (BMI 18.5 – 24.9) will be mathematically generated once height is recorded.
          </p>
        </div>
      ) : isInHealthyZone ? (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[11px] text-emerald-300 font-sans">
            <strong>{member.name}</strong> is in the <strong>optimal healthy BMI zone</strong>!
          </p>
        </div>
      ) : currentWeightKg > healthyWeightRange.maxKg ? (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-center gap-2.5">
          <Target size={16} className="text-rose-400 shrink-0" weight="bold" />
          <p className="text-[11px] text-rose-300 font-sans">
            Needs to shed <strong className="font-bold underline font-mono">{formatWeight(kgToHealthyRange, unit)}</strong> to reach healthy BMI (&lt;25.0).
          </p>
        </div>
      ) : (
        <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center gap-2.5">
          <Target size={16} className="text-sky-400 shrink-0" weight="bold" />
          <p className="text-[11px] text-sky-300 font-sans">
            Needs to gain <strong className="font-bold font-mono">{formatWeight(kgToHealthyRange, unit)}</strong> to reach normal range (&gt;18.5).
          </p>
        </div>
      )}

      {/* Velocity and Projection Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
        <div className="plate-recessed p-2.5">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
            <TrendDown size={12} className="text-emerald-400" />
            <span>Weekly Pace</span>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-white tabular-nums">
            {weeklyRateKg > 0 ? `-${weeklyRateKg.toFixed(2)} kg/wk` : weeklyRateKg < 0 ? `+${Math.abs(weeklyRateKg).toFixed(2)} kg/wk` : "Steady"}
          </p>
        </div>

        <div className="plate-recessed p-2.5">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
            <CalendarCheck size={12} className="text-volt-400" />
            <span>Estimated Horizon</span>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-white tabular-nums">
            {projectedWeeksToGoal ? `~${projectedWeeksToGoal} wks remaining` : "On track"}
          </p>
        </div>
      </div>
    </div>
  );
}
