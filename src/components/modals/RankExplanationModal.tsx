"use client";

import React from "react";
import { X, Trophy, Target, Heartbeat, Fire, Sparkle, ShieldCheck, CheckCircle, Barbell, Scales, Plant } from "@phosphor-icons/react";

interface RankExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RankExplanationModal({ isOpen, onClose }: RankExplanationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-carbon-950/80 backdrop-blur-md">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl plate-card border-carbon-700/80 p-5 sm:p-6 shadow-plate relative animate-in slide-in-from-bottom-6 duration-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-carbon-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-volt-400/15 border border-volt-400/30 flex items-center justify-center text-volt-400">
              <Trophy size={20} weight="fill" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Squad Telemetry & Rankings
              </h2>
              <p className="text-xs text-slate-400 font-medium">Holistic, goal-aware scoring & biomechanical fairness</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-carbon-800/80 hover:bg-carbon-700 border border-carbon-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Section 1: Why Not Pure Weight Loss? */}
        <div className="p-3.5 rounded-xl plate-recessed border border-carbon-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-volt-400">
            <ShieldCheck size={16} weight="fill" />
            <span>Beyond Naive Weight Loss Metrics</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            A naive weight loss leaderboard has a fatal flaw: it penalizes athletes already at optimal body mass, and punishes members on a <strong>hypertrophy bulk</strong>. Elemen 2 calibrates telemetry based on designated directives: cutting fat mass, building lean tissue, or sustaining baseline performance.
          </p>
        </div>

        {/* Section 2: The 3 Goal Tracks */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            The 3 Telemetry Directives
          </span>

          <div className="space-y-2 text-xs">
            {/* Cutting */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="flex items-center justify-between font-bold text-rose-300">
                <span className="flex items-center gap-1.5">
                  <Fire size={14} weight="fill" className="text-rose-400 shrink-0" />
                  <span>Cutting (Deficit & Fat Reduction)</span>
                </span>
                <span className="text-[10px] font-mono text-rose-300/80">Target &lt; Baseline</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Optimized for fat tissue reduction. Progress scores increase as body mass trends closer to the target line.
              </p>
            </div>

            {/* Bulking */}
            <div className="p-3 rounded-xl bg-cobalt-500/10 border border-cobalt-500/20 space-y-1">
              <div className="flex items-center justify-between font-bold text-cobalt-300">
                <span className="flex items-center gap-1.5">
                  <Barbell size={14} weight="bold" className="text-cobalt-400 shrink-0" />
                  <span>Bulking (Hypertrophy Surplus)</span>
                </span>
                <span className="text-[10px] font-mono text-cobalt-300/80">Target &gt; Baseline</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Optimized for lean muscular accrual. Strategic mass increases are scored positively and accelerate leaderboard progress.
              </p>
            </div>

            {/* Maintaining */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <Scales size={14} weight="bold" className="text-emerald-400 shrink-0" />
                  <span>Maintaining (Recomposition & Peak Stability)</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-300/80">Target ≈ Baseline</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Optimized for stability and body recomposition. Holding mass within ±0.5 kg of target awards a flawless 100% performance rating.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: The 4 Leaderboard Tabs */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            The 4 Leaderboard Telemetry Filters
          </span>

          <div className="space-y-2 text-xs">
            {/* Overall Index */}
            <div className="p-3.5 rounded-xl plate-recessed border border-volt-400/30 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-volt-400">
                <Sparkle size={15} weight="fill" />
                <span>Overall Index (Elemen 2 Composite Score)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                A 0–100 comprehensive athletic rating calculated from three weighted pillars:
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold">
                <div className="p-2 rounded-lg bg-carbon-900/90 border border-carbon-700/60">
                  <span className="block text-volt-400 font-extrabold font-mono text-xs">45%</span>
                  <span className="text-slate-300">Goal Target</span>
                </div>
                <div className="p-2 rounded-lg bg-carbon-900/90 border border-carbon-700/60">
                  <span className="block text-cobalt-400 font-extrabold font-mono text-xs">35%</span>
                  <span className="text-slate-300">Ideal Caliper</span>
                </div>
                <div className="p-2 rounded-lg bg-carbon-900/90 border border-carbon-700/60">
                  <span className="block text-emerald-400 font-extrabold font-mono text-xs">20%</span>
                  <span className="text-slate-300">Weekly Habit</span>
                </div>
              </div>
            </div>

            {/* Target Goal */}
            <div className="p-3 rounded-xl plate-recessed border border-carbon-700/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Target size={15} className="text-emerald-400" weight="fill" />
                <span>Target Goal Proximity</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Ranked purely by remaining kilograms to individual target threshold (<code>|current - target|</code>), followed by percentage of program completed.
              </p>
            </div>

            {/* Ideal Weight */}
            <div className="p-3 rounded-xl plate-recessed border border-carbon-700/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Heartbeat size={15} className="text-cobalt-400" weight="fill" />
                <span>Biomechanical Index (WHO BMI 22.0 Proximity)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Ranked by distance to optimal anthropometric body mass:
                <br />
                <code className="text-cobalt-300 font-mono text-[10px]">
                  Optimal Mass (kg) = 22.0 × (Height in meters)²
                </code>
                <br />
                Athletes inside the healthy normal band (BMI 18.5 – 24.9) score 85–100 pts.
              </p>
            </div>

            {/* Streak */}
            <div className="p-3 rounded-xl plate-recessed border border-carbon-700/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Fire size={15} className="text-volt-400" weight="fill" />
                <span>Consistency Streak (Cadence & Discipline)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Ranked by consecutive weekly weigh-in entries. Honors accountability and discipline over short-term volatility.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Fairness Guarantee */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
            <CheckCircle size={15} weight="fill" />
            <span>Cohort Integrity Guarantee</span>
          </div>
          <p className="text-[11px] text-emerald-200/90 leading-relaxed">
            Athletes who begin at their target cannot remain idle and claim top rank—they must maintain regular telemetry weigh-ins. Meanwhile, squad members undergoing transformative journeys are recognized at every stage.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-volt-400 hover:bg-volt-300 text-carbon-950 font-extrabold text-xs tracking-wide shadow-volt-glow transition-all"
        >
          Acknowledge & Return to Standings
        </button>
      </div>
    </div>
  );
}
