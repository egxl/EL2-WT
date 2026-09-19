"use client";

import React from "react";
import { CohortSummary, UnitPreference } from "@/types";
import { formatWeight } from "@/lib/biometrics";
import { Fire, Trophy, TrendDown, Users } from "@phosphor-icons/react";

interface CohortHeroProps {
  summary: CohortSummary;
  unit: UnitPreference;
}

export function CohortHero({ summary, unit }: CohortHeroProps) {
  return (
    <div className="bezel-outer">
      <div className="bezel-inner p-5 space-y-4 bg-gradient-to-b from-[#121824] to-[#0D1117]">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Fire size={13} weight="fill" />
              <span>Elemen 2 Challenge</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Users size={13} />
              <span>{summary.memberCount} Members</span>
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Active Journey
          </span>
        </div>

        {/* Collective Weight Shed Stat */}
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Collective Weight Shed
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
              {formatWeight(summary.totalLossKg, unit)}
            </h1>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendDown size={14} weight="bold" />
              <span>Dropped</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Group started at {formatWeight(summary.collectiveStartKg, unit)} • Target: {formatWeight(summary.collectiveTargetKg, unit)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Cohort Goal Progress</span>
            <span className="text-amber-400 tabular-nums">{summary.progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-800/80 border border-white/5 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700 ease-out shadow-sm shadow-amber-500/30"
              style={{ width: `${Math.min(100, Math.max(5, summary.progressPercent))}%` }}
            />
          </div>
        </div>

        {/* Metrics Bar: Group Average BMI Drop */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-0.5">Group Average BMI</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {summary.averageInitialBmi.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-white tabular-nums">
                {summary.averageCurrentBmi.toFixed(1)}
              </span>
              <span className="text-[11px] font-bold text-emerald-400">
                (-{summary.averageBmiDrop.toFixed(1)})
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-0.5">Accountability</span>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
              <Trophy size={14} weight="fill" className="text-amber-400" />
              <span>100% Shared Logs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
