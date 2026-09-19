"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { FluidBottomNav } from "@/components/layout/FluidBottomNav";
import { getMembers, getWeightLogs, getUnitPreference, subscribeToStorage } from "@/lib/storage";
import { calculateMemberInsight, formatWeight, getGoalTypeDetails } from "@/lib/biometrics";
import { Member, WeightLog, UnitPreference, MemberInsight, GoalType } from "@/types";
import {
  Trophy,
  Fire,
  CaretRight,
  Crown,
  Target,
  Sparkle,
  Heartbeat,
  CheckCircle,
  Funnel,
  Info,
  Question,
} from "@phosphor-icons/react";
import { RankExplanationModal } from "@/components/modals/RankExplanationModal";

type SortTab = "overall" | "target" | "ideal" | "streak";
type CategoryFilter = "all" | GoalType;

export default function LeaderboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [activeTab, setActiveTab] = useState<SortTab>("overall");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  const loadData = () => {
    setMembers(getMembers());
    setLogs(getWeightLogs());
    setUnit(getUnitPreference());
  };

  useEffect(() => {
    loadData();
    return subscribeToStorage(() => loadData());
  }, []);

  const allInsights = members.map((m) => calculateMemberInsight(m, logs));

  // Filter by category
  const filteredInsights = allInsights.filter((insight) => {
    if (categoryFilter === "all") return true;
    return insight.goalType === categoryFilter;
  });

  // Sort according to activeTab
  const ranked = [...filteredInsights].sort((a, b) => {
    if (activeTab === "overall") {
      // Highest composite score first
      return b.compositeScore - a.compositeScore;
    }
    if (activeTab === "target") {
      // Closest to desired target weight first
      if (a.distanceToTargetKg !== b.distanceToTargetKg) {
        return a.distanceToTargetKg - b.distanceToTargetKg;
      }
      return b.goalProgressPercent - a.goalProgressPercent;
    }
    if (activeTab === "ideal") {
      // Closest to WHO BMI 22.0 ideal weight first
      if (a.distanceToIdealKg !== b.distanceToIdealKg) {
        return a.distanceToIdealKg - b.distanceToIdealKg;
      }
      return b.idealProximityScore - a.idealProximityScore;
    }
    if (activeTab === "streak") {
      // Longest streak first
      if (b.streakWeeks !== a.streakWeeks) {
        return b.streakWeeks - a.streakWeeks;
      }
      return b.historyCount - a.historyCount;
    }
    return 0;
  });

  const top1 = ranked[0];
  const top2 = ranked[1];
  const top3 = ranked[2];

  // Helper for rendering the primary metric on the podium
  const renderPodiumMetric = (ins: MemberInsight) => {
    switch (activeTab) {
      case "overall":
        return `${ins.compositeScore} pts`;
      case "target":
        return ins.distanceToTargetKg === 0 ? "Goal met!" : `${formatWeight(ins.distanceToTargetKg, unit)} left`;
      case "ideal":
        return ins.distanceToIdealKg === 0 ? "Ideal weight" : `±${formatWeight(ins.distanceToIdealKg, unit)}`;
      case "streak":
        return `${ins.streakWeeks}w streak`;
    }
  };

  // Helper for rendering secondary metric on the podium
  const renderPodiumSub = (ins: MemberInsight) => {
    switch (activeTab) {
      case "overall":
        return `${ins.goalProgressPercent}% goal • BMI ${ins.currentBmi}`;
      case "target":
        return `${ins.goalProgressPercent}% progress`;
      case "ideal":
        return `BMI ${ins.currentBmi} (Ideal 22.0)`;
      case "streak":
        return `${ins.historyCount} weigh-ins`;
    }
  };

  return (
    <main className="flex-1 flex flex-col pb-28">
      <TopBar />

      <div className="px-4 py-4 space-y-4">
        {/* Page Title & Mission */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Trophy size={20} className="text-volt-500" weight="fill" />
              <span>Elemen 2 Standings</span>
            </h1>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              Goal Velocity • WHO Calibration • Habit Consistency
            </p>
          </div>

          {/* How It Works Explainer Button */}
          <button
            onClick={() => setShowExplanationModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon-850 hover:bg-carbon-800 border border-white/[0.08] text-xs font-mono font-bold text-volt-400 active:scale-95 transition-all shadow-sm shrink-0"
            title="Read ranking logic & scoring breakdown"
          >
            <Info size={14} weight="bold" />
            <span>Logic</span>
          </button>
        </div>

        {/* Primary Leaderboard Sort Switcher Tabs */}
        <div className="plate-recessed grid grid-cols-4 gap-1 p-1 font-mono text-[10px] font-bold">
          <button
            onClick={() => setActiveTab("overall")}
            className={`py-2 px-1 rounded-md transition-all flex flex-col items-center gap-0.5 text-center ${
              activeTab === "overall"
                ? "bg-volt-500 text-carbon-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkle size={14} weight={activeTab === "overall" ? "fill" : "regular"} />
            <span className="truncate w-full">Index</span>
          </button>

          <button
            onClick={() => setActiveTab("target")}
            className={`py-2 px-1 rounded-md transition-all flex flex-col items-center gap-0.5 text-center ${
              activeTab === "target"
                ? "bg-volt-500 text-carbon-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Target size={14} weight={activeTab === "target" ? "fill" : "regular"} />
            <span className="truncate w-full">Target</span>
          </button>

          <button
            onClick={() => setActiveTab("ideal")}
            className={`py-2 px-1 rounded-md transition-all flex flex-col items-center gap-0.5 text-center ${
              activeTab === "ideal"
                ? "bg-volt-500 text-carbon-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Heartbeat size={14} weight={activeTab === "ideal" ? "fill" : "regular"} />
            <span className="truncate w-full">Ideal BMI</span>
          </button>

          <button
            onClick={() => setActiveTab("streak")}
            className={`py-2 px-1 rounded-md transition-all flex flex-col items-center gap-0.5 text-center ${
              activeTab === "streak"
                ? "bg-volt-500 text-carbon-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Fire size={14} weight={activeTab === "streak" ? "fill" : "regular"} />
            <span className="truncate w-full">Streak</span>
          </button>
        </div>

        {/* Goal Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold shrink-0 transition-all ${
              categoryFilter === "all"
                ? "bg-white/[0.12] border-white/30 text-white shadow-sm font-bold"
                : "bg-carbon-850 border-white/[0.06] text-slate-400 hover:bg-carbon-800"
            }`}
          >
            All Athletes ({allInsights.length})
          </button>

          <button
            onClick={() => setCategoryFilter("cutting")}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1 ${
              categoryFilter === "cutting"
                ? "bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold"
                : "bg-carbon-850 border-white/[0.06] text-slate-400 hover:bg-carbon-800"
            }`}
          >
            <span>🔥</span>
            <span>Cut ({allInsights.filter((i) => i.goalType === "cutting").length})</span>
          </button>

          <button
            onClick={() => setCategoryFilter("bulking")}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1 ${
              categoryFilter === "bulking"
                ? "bg-cobalt-500/20 border-cobalt-500/40 text-cobalt-300 font-bold"
                : "bg-carbon-850 border-white/[0.06] text-slate-400 hover:bg-carbon-800"
            }`}
          >
            <span>⚡</span>
            <span>Bulk ({allInsights.filter((i) => i.goalType === "bulking").length})</span>
          </button>

          <button
            onClick={() => setCategoryFilter("maintaining")}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold shrink-0 transition-all flex items-center gap-1 ${
              categoryFilter === "maintaining"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold"
                : "bg-carbon-850 border-white/[0.06] text-slate-400 hover:bg-carbon-800"
            }`}
          >
            <span>⚖️</span>
            <span>Maintain ({allInsights.filter((i) => i.goalType === "maintaining").length})</span>
          </button>
        </div>

        {/* Dynamic Context Banner */}
        <div className="px-3 py-1.5 rounded-lg bg-carbon-900 border border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            {activeTab === "overall" && <span>⭐ <strong>Elemen 2 Index</strong>: 45% Goal + 35% Ideal BMI + 20% Streak</span>}
            {activeTab === "target" && <span>🎯 Ranked by closest distance to personal desired goal</span>}
            {activeTab === "ideal" && <span>🌱 Ranked by closest weight to height-calibrated BMI 22.0</span>}
            {activeTab === "streak" && <span>🔥 Ranked by weekly weigh-in consistency & habit streak</span>}
          </span>
        </div>

        {/* Athletic Tiered Podium for Top 3 */}
        {ranked.length >= 3 && (
          <div className="plate-card p-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-volt-400 block text-center">
              🏆 Championship Podium ({categoryFilter === "all" ? "Cohort" : categoryFilter})
            </span>

            {/* Pedestal Structure */}
            <div className="grid grid-cols-3 gap-2 items-end pt-2 text-center">
              {/* 2nd Place */}
              <Link href={`/member/${top2.member.id}`} className="flex flex-col items-center group">
                <div className="w-11 h-11 rounded-xl ring-2 ring-slate-400 bg-carbon-850 flex items-center justify-center font-bold text-white relative shadow-md group-hover:scale-105 transition-transform mb-1.5">
                  {top2.member.avatar || top2.member.name[0]}
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-300 text-carbon-950 font-black text-[9px] font-mono flex items-center justify-center">
                    2
                  </span>
                </div>
                <span className="text-xs font-bold text-white truncate max-w-[80px]">
                  {top2.member.name}
                </span>
                <span className="text-[11px] font-mono font-black text-slate-300">
                  {renderPodiumMetric(top2)}
                </span>
                <span className="text-[9px] font-mono text-slate-400 truncate max-w-[80px]">
                  {renderPodiumSub(top2)}
                </span>

                {/* 2nd Place Pedestal Block */}
                <div className="w-full h-14 mt-2 rounded-t-lg bg-carbon-800 border-t border-x border-white/[0.08] flex items-center justify-center font-mono text-slate-400 font-bold text-xs">
                  2ND
                </div>
              </Link>

              {/* 1st Place */}
              <Link href={`/member/${top1.member.id}`} className="flex flex-col items-center group -mt-3">
                <Crown size={22} weight="fill" className="text-volt-400 mb-1 animate-bounce" />
                <div className="w-13 h-13 p-1 rounded-2xl ring-2 ring-volt-400 bg-carbon-850 flex items-center justify-center font-black text-slate-950 text-base relative shadow-volt-glow group-hover:scale-105 transition-transform mb-1.5" style={{ backgroundColor: top1.member.color || "#D4F63D" }}>
                  {top1.member.avatar || top1.member.name[0]}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-volt-500 text-carbon-950 font-black text-[10px] font-mono flex items-center justify-center shadow">
                    1
                  </span>
                </div>
                <span className="text-xs font-black text-volt-300 truncate max-w-[90px]">
                  {top1.member.name}
                </span>
                <span className="text-xs font-mono font-black text-volt-400">
                  {renderPodiumMetric(top1)}
                </span>
                <span className="text-[9px] font-mono text-slate-300 truncate max-w-[90px]">
                  {renderPodiumSub(top1)}
                </span>

                {/* 1st Place Pedestal Block (Tallest) */}
                <div className="w-full h-20 mt-2 rounded-t-lg bg-gradient-to-b from-carbon-700 to-carbon-800 border-t-2 border-x border-volt-500/40 flex flex-col items-center justify-center font-mono text-volt-400 font-extrabold text-sm shadow-volt-glow">
                  <span>1ST</span>
                  <span className="text-[9px] text-slate-400 font-normal">LEADER</span>
                </div>
              </Link>

              {/* 3rd Place */}
              <Link href={`/member/${top3.member.id}`} className="flex flex-col items-center group">
                <div className="w-11 h-11 rounded-xl ring-2 ring-amber-600 bg-carbon-850 flex items-center justify-center font-bold text-white relative shadow-md group-hover:scale-105 transition-transform mb-1.5">
                  {top3.member.avatar || top3.member.name[0]}
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white font-black text-[9px] font-mono flex items-center justify-center">
                    3
                  </span>
                </div>
                <span className="text-xs font-bold text-white truncate max-w-[80px]">
                  {top3.member.name}
                </span>
                <span className="text-[11px] font-mono font-black text-amber-400">
                  {renderPodiumMetric(top3)}
                </span>
                <span className="text-[9px] font-mono text-slate-400 truncate max-w-[80px]">
                  {renderPodiumSub(top3)}
                </span>

                {/* 3rd Place Pedestal Block */}
                <div className="w-full h-10 mt-2 rounded-t-lg bg-carbon-800 border-t border-x border-white/[0.08] flex items-center justify-center font-mono text-slate-400 font-bold text-xs">
                  3RD
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Rankings ({ranked.length})
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              By {activeTab === "overall" ? "Elemen 2 Index" : activeTab === "target" ? "Target Proximity" : activeTab === "ideal" ? "Ideal Proximity" : "Streak"}
            </span>
          </div>

          <div className="space-y-2">
            {ranked.map((insight, index) => {
              const goalDetails = getGoalTypeDetails(insight.goalType);
              return (
                <Link
                  key={insight.member.id}
                  href={`/member/${insight.member.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-carbon-850 hover:bg-carbon-800 active:scale-[0.99] border border-white/[0.06] hover:border-white/[0.14] transition-all group font-mono"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                        index === 0
                          ? "bg-volt-500 text-carbon-950 shadow-sm"
                          : index === 1
                          ? "bg-slate-300 text-carbon-950"
                          : index === 2
                          ? "bg-amber-600 text-white"
                          : "bg-carbon-900 text-slate-400 border border-white/[0.05]"
                      }`}
                    >
                      #{index + 1}
                    </div>

                    {/* Avatar & Member Info */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-slate-950 shrink-0"
                      style={{ backgroundColor: insight.member.color || "#D4F63D" }}
                    >
                      {insight.member.avatar || insight.member.name[0]}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-sans font-bold text-white group-hover:text-volt-400 transition-colors truncate">
                          {insight.member.name}
                        </span>

                        {/* Goal Tag Pill */}
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${goalDetails.badgeBg} ${goalDetails.badgeText}`}>
                          <span>{goalDetails.icon}</span>
                          <span>{goalDetails.label}</span>
                        </span>

                        {insight.streakWeeks >= 2 && (
                          <span className="flex items-center gap-0.5 text-[9px] text-volt-400 font-bold">
                            <Fire size={11} weight="fill" />
                            <span>{insight.streakWeeks}w</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span>
                          {formatWeight(insight.currentWeightKg, unit)}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>
                          Target: <strong className="text-slate-300">{formatWeight(insight.targetWeightKg, unit)}</strong>
                        </span>
                        {insight.member.heightCm > 0 && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span>Ideal: {formatWeight(insight.idealWeightKg, unit)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary Metric based on active tab */}
                  <div className="flex items-center gap-2 text-right shrink-0">
                    <div>
                      {activeTab === "overall" && (
                        <>
                          <span className="text-sm font-black text-volt-400 block tabular-nums">
                            {insight.compositeScore} <span className="text-[9px] font-normal text-slate-400">pts</span>
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {insight.goalProgressPercent}% goal • BMI {insight.currentBmi}
                          </span>
                        </>
                      )}

                      {activeTab === "target" && (
                        <>
                          <span className="text-sm font-extrabold text-emerald-400 block tabular-nums">
                            {insight.distanceToTargetKg === 0 ? "Goal Met!" : `${formatWeight(insight.distanceToTargetKg, unit)}`}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {insight.goalProgressPercent}% reached
                          </span>
                        </>
                      )}

                      {activeTab === "ideal" && (
                        <>
                          <span className="text-sm font-extrabold text-cobalt-400 block tabular-nums">
                            {insight.distanceToIdealKg === 0 ? "Ideal Match" : `±${formatWeight(insight.distanceToIdealKg, unit)}`}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            BMI {insight.currentBmi} ({insight.idealProximityScore}%)
                          </span>
                        </>
                      )}

                      {activeTab === "streak" && (
                        <>
                          <span className="text-sm font-extrabold text-volt-400 block tabular-nums">
                            {insight.streakWeeks} weeks
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {insight.historyCount} weigh-ins
                          </span>
                        </>
                      )}
                    </div>

                    <CaretRight size={13} className="text-slate-500 group-hover:text-volt-400 transition-colors" />
                  </div>
                </Link>
              );
            })}

            {ranked.length === 0 && (
              <div className="p-8 text-center rounded-xl bg-carbon-850 border border-white/[0.05] text-slate-400 text-xs font-mono">
                No members found in this category.
              </div>
            )}
          </div>
        </div>

        {/* Transparent Ranking Guide Box */}
        <div className="plate-recessed p-4 space-y-2 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Info size={15} className="text-volt-400" weight="fill" />
              <span>How Standings & Scoring Work</span>
            </div>
            <button
              onClick={() => setShowExplanationModal(true)}
              className="text-[10px] font-bold text-volt-400 hover:text-volt-300 transition-colors"
            >
              Full Guide &rarr;
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            Elemen 2 tracks 3 distinct programs (<strong>🔥 Cutting</strong>, <strong>⚡ Bulking</strong>, and <strong>⚖️ Maintaining</strong>). The <strong>Overall Index (0–100)</strong> blends <strong>45% Goal Progress</strong>, <strong>35% WHO Ideal Weight Proximity (BMI 22.0)</strong>, and <strong>20% Weigh-In Streak</strong> so everyone competes on an equal, healthy playing field.
          </p>
        </div>
      </div>

      <FluidBottomNav />

      {/* Interactive Ranking Explanation Modal */}
      <RankExplanationModal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
      />
    </main>
  );
}
