"use client";

import React from "react";
import { X, Trophy, Target, Heartbeat, Fire, Sparkle, ShieldCheck, CheckCircle } from "@phosphor-icons/react";

interface RankExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RankExplanationModal({ isOpen, onClose }: RankExplanationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#0D1117] border border-white/10 p-5 shadow-2xl relative animate-in slide-in-from-bottom-6 duration-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy size={20} weight="fill" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                How Elemen 2 Rankings Work
              </h2>
              <p className="text-xs text-slate-400">Holistic, goal-aware scoring & fairness rules</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* Section 1: Why Not Pure Weight Loss? */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <ShieldCheck size={16} weight="fill" />
            <span>Why Not Just "% Weight Lost"?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            A naive weight loss leaderboard has a serious flaw: it punishes members who are already at their healthy weight, and harms members who need to <strong>bulk</strong> (gain muscle). In Elemen 2, we recognize that health goals are diverse—some members are cutting, some are bulking, and some are maintaining peak health.
          </p>
        </div>

        {/* Section 2: The 3 Goal Tracks */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            The 3 Goal Program Tracks
          </span>

          <div className="space-y-2 text-xs">
            {/* Cutting */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <div className="flex items-center justify-between font-bold text-rose-300">
                <span className="flex items-center gap-1.5">
                  <span>🔥</span>
                  <span>Cutting (Caloric Deficit)</span>
                </span>
                <span className="text-[11px] font-mono">Target &lt; Start</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Targeting body fat loss. Progress increases as you shed kilograms toward your goal weight. Weight loss is celebrated with emerald badges.
              </p>
            </div>

            {/* Bulking */}
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
              <div className="flex items-center justify-between font-bold text-indigo-300">
                <span className="flex items-center gap-1.5">
                  <span>💪</span>
                  <span>Bulking (Caloric Surplus)</span>
                </span>
                <span className="text-[11px] font-mono">Target &gt; Start</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Targeting lean muscle and body mass gain. Gaining weight is treated positively with emerald badges and increases your goal progress.
              </p>
            </div>

            {/* Maintaining */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex items-center justify-between font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <span>⚖️</span>
                  <span>Maintaining (Recomp / Optimal Weight)</span>
                </span>
                <span className="text-[11px] font-mono">Target ≈ Start</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Targeting body recomposition or weight stability. Staying within ±0.5 kg of your target awards full 100% goal performance.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: The 4 Leaderboard Tabs */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            The 4 Leaderboard Views
          </span>

          <div className="space-y-2 text-xs">
            {/* Overall Index */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Sparkle size={15} weight="fill" />
                <span>⭐ Overall Index (Elemen 2 Composite Score)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                A 0–100 comprehensive rating calculated from three weighted pillars:
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="block text-amber-400 font-extrabold text-xs">45%</span>
                  <span className="text-slate-300">Goal Progress</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="block text-cyan-400 font-extrabold text-xs">35%</span>
                  <span className="text-slate-300">Ideal BMI</span>
                </div>
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                  <span className="block text-emerald-400 font-extrabold text-xs">20%</span>
                  <span className="text-slate-300">Streak Habit</span>
                </div>
              </div>
            </div>

            {/* Target Goal */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Target size={15} className="text-emerald-400" weight="fill" />
                <span>🎯 Target Goal (Desired Weight Proximity)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Ranked purely by who is closest in kilograms to their personal target line (<code>|current - target|</code>), followed by % of goal completed.
              </p>
            </div>

            {/* Ideal Weight */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Heartbeat size={15} className="text-cyan-400" weight="fill" />
                <span>🌱 Ideal Weight (WHO BMI 22.0 Proximity)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Ranked by closest distance to optimal body mass for your height:
                <br />
                <code className="text-cyan-300 font-mono text-[10px]">
                  Ideal Weight (kg) = 22.0 × (Height in meters)²
                </code>
                <br />
                Anyone inside the healthy normal range (BMI 18.5 – 24.9) scores 85–100 pts, with 22.0 as the bullseye.
              </p>
            </div>

            {/* Streak */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Fire size={15} className="text-amber-400" weight="fill" />
                <span>🔥 Consistency Streak (Discipline & Habit)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Ranked by consecutive weeks of weigh-in logs. Rewards the discipline of stepping on the scale and holding yourself accountable with the cohort.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Fairness Guarantee */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
            <CheckCircle size={15} weight="fill" />
            <span>Fairness Guarantee</span>
          </div>
          <p className="text-[11px] text-emerald-200/90 leading-relaxed">
            Members who start in great shape cannot simply sit idle and dominate the leaderboard—they must maintain their habits and weigh in. At the same time, members with ambitious transformation goals are celebrated every step of the way!
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
        >
          Got it! Back to Standings
        </button>
      </div>
    </div>
  );
}
