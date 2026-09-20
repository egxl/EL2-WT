"use client";

import React from "react";
import { CohortSummary, UnitPreference } from "@/types";
import { formatWeight } from "@/lib/biometrics";
import { Fire, Trophy, TrendDown, Users, Sparkle, Barbell, Scales } from "@phosphor-icons/react";

interface CohortHeroProps {
  summary: CohortSummary;
  unit: UnitPreference;
}

export function CohortHero({ summary, unit }: CohortHeroProps) {
  const isNetLoss = summary.totalLossKg >= 0;

  return (
    <div className="plate-card p-5 space-y-4">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-volt-500/10 text-volt-400 border border-volt-500/25">
            <Fire size={12} weight="fill" className="text-volt-500" />
            <span>Cohort Runway</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Users size={13} />
            <span>{summary.memberCount} Athletes</span>
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Phase</span>
        </span>
      </div>

      {/* Program Distribution Chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
        <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium flex items-center gap-1.5">
          <Fire size={12} weight="fill" className="text-rose-400 shrink-0" />
          <span>{summary.cuttingCount} Cut</span>
        </span>
        <span className="px-2 py-0.5 rounded-md bg-cobalt-500/10 border border-cobalt-500/20 text-cobalt-400 font-medium flex items-center gap-1.5">
          <Barbell size={12} weight="bold" className="text-cobalt-400 shrink-0" />
          <span>{summary.bulkingCount} Bulk</span>
        </span>
        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium flex items-center gap-1.5">
          <Scales size={12} weight="bold" className="text-emerald-400 shrink-0" />
          <span>{summary.maintainingCount} Maintain</span>
        </span>
      </div>

      {/* Collective Delta Readout */}
      <div className="pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Collective Metabolic Delta
          </span>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
              isNetLoss
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-cobalt-500/10 text-cobalt-400 border-cobalt-500/25"
            }`}
          >
            <TrendDown size={14} weight="bold" className={isNetLoss ? "" : "rotate-180"} />
            <span>{isNetLoss ? "Net Shed" : "Net Mass Gain"}</span>
          </span>
        </div>

        <div className="flex items-baseline gap-3 mt-1">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums font-mono">
            {formatWeight(Math.abs(summary.totalLossKg), unit)}
          </h1>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1.5">
          <span>Start: <strong className="text-slate-300">{formatWeight(summary.collectiveStartKg, unit)}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Target: <strong className="text-volt-400">{formatWeight(summary.collectiveTargetKg, unit)}</strong></span>
        </div>
      </div>

      {/* The Cohort Milestone Runway Track */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400 text-[11px] font-medium">Cohort Target Runway</span>
          <span className="text-volt-400 font-bold tabular-nums">{summary.progressPercent}% Met</span>
        </div>

        {/* Calibrated Runway Gauge */}
        <div className="relative">
          <div className="h-3 w-full rounded-lg bg-carbon-900 border border-white/[0.08] overflow-hidden p-0.5 shadow-plate-inset">
            <div
              className="h-full rounded-md bg-gradient-to-r from-volt-500 via-emerald-400 to-cobalt-400 transition-all duration-700 ease-out shadow-sm shadow-volt-500/40"
              style={{ width: `${Math.min(100, Math.max(4, summary.progressPercent))}%` }}
            />
          </div>

          {/* Runway Ticks */}
          <div className="flex justify-between text-[9px] font-mono text-slate-400 px-0.5 pt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>GOAL 100%</span>
          </div>
        </div>
      </div>

      {/* Recessed Telemetry Panel: Average BMI & Index */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <div className="plate-recessed p-3 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Squad Average BMI
          </span>
          {summary.averageCurrentBmi > 0 ? (
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 line-through tabular-nums font-mono">
                {summary.averageInitialBmi.toFixed(1)}
              </span>
              <span className="text-base font-extrabold text-white tabular-nums font-mono">
                {summary.averageCurrentBmi.toFixed(1)}
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                (-{summary.averageBmiDrop.toFixed(1)})
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-mono">Awaiting heights</span>
          )}
        </div>

        <div className="plate-recessed p-3 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Squad Index
          </span>
          <div className="flex items-baseline gap-1.5">
            <Sparkle size={13} weight="fill" className="text-volt-400" />
            <span className="text-base font-extrabold text-white tabular-nums font-mono">
              {summary.averageCompositeScore}
            </span>
            <span className="text-[10px] font-mono text-slate-400">/ 100 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
