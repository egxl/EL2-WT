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
} from "@phosphor-icons/react";

type SortTab = "overall" | "target" | "ideal" | "streak";
type CategoryFilter = "all" | GoalType;

export default function LeaderboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [activeTab, setActiveTab] = useState<SortTab>("overall");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

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
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Trophy size={22} className="text-amber-400" weight="fill" />
              <span>Elemen 2 Standings</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Rewarding goal progress, ideal health, and consistency
            </p>
          </div>
        </div>

        {/* Primary Leaderboard Sort Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-[11px] font-bold">
          <button
            onClick={() => setActiveTab("overall")}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 text-center ${
              activeTab === "overall"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkle size={15} weight={activeTab === "overall" ? "fill" : "regular"} />
            <span className="truncate w-full">Overall Index</span>
          </button>

          <button
            onClick={() => setActiveTab("target")}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 text-center ${
              activeTab === "target"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Target size={15} weight={activeTab === "target" ? "fill" : "regular"} />
            <span className="truncate w-full">Target Goal</span>
          </button>

          <button
            onClick={() => setActiveTab("ideal")}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 text-center ${
              activeTab === "ideal"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Heartbeat size={15} weight={activeTab === "ideal" ? "fill" : "regular"} />
            <span className="truncate w-full">Ideal Weight</span>
          </button>

          <button
            onClick={() => setActiveTab("streak")}
            className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 text-center ${
              activeTab === "streak"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Fire size={15} weight={activeTab === "streak" ? "fill" : "regular"} />
            <span className="truncate w-full">Streak</span>
          </button>
        </div>

        {/* Goal Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
              categoryFilter === "all"
                ? "bg-white/20 border-white/40 text-white shadow-sm"
                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            All Members ({allInsights.length})
          </button>

          <button
            onClick={() => setCategoryFilter("cutting")}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all flex items-center gap-1 ${
              categoryFilter === "cutting"
                ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm shadow-rose-500/20"
                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <span>🔥</span>
            <span>Cutting ({allInsights.filter((i) => i.goalType === "cutting").length})</span>
          </button>

          <button
            onClick={() => setCategoryFilter("bulking")}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all flex items-center gap-1 ${
              categoryFilter === "bulking"
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm shadow-indigo-500/20"
                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <span>💪</span>
            <span>Bulking ({allInsights.filter((i) => i.goalType === "bulking").length})</span>
          </button>

          <button
            onClick={() => setCategoryFilter("maintaining")}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold shrink-0 transition-all flex items-center gap-1 ${
              categoryFilter === "maintaining"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20"
                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            <span>⚖️</span>
            <span>Maintaining ({allInsights.filter((i) => i.goalType === "maintaining").length})</span>
          </button>
        </div>

        {/* Dynamic Context Banner */}
        <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            {activeTab === "overall" && <span>⭐ <strong>Elemen 2 Index</strong>: 45% Goal + 35% Ideal BMI + 20% Streak</span>}
            {activeTab === "target" && <span>🎯 Ranked by closest distance to personal desired goal</span>}
            {activeTab === "ideal" && <span>🌱 Ranked by closest weight to height-calibrated BMI 22.0</span>}
            {activeTab === "streak" && <span>🔥 Ranked by weekly weigh-in consistency & habit streak</span>}
          </span>
        </div>

        {/* Podium for Top 3 */}
        {ranked.length >= 3 && (
          <div className="bezel-outer">
            <div className="bezel-inner p-4 bg-gradient-to-b from-amber-500/10 via-[#0D1117] to-[#0D1117]">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block text-center mb-3">
                🏆 Podium ({categoryFilter === "all" ? "Cohort" : categoryFilter})
              </span>

              <div className="grid grid-cols-3 gap-2 items-end pt-2 text-center">
                {/* 2nd Place */}
                <Link href={`/member/${top2.member.id}`} className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-2xl ring-2 ring-slate-400 bg-slate-800 flex items-center justify-center font-bold text-white relative shadow-lg group-hover:scale-105 transition-transform">
                    {top2.member.avatar || top2.member.name[0]}
                    <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-slate-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white mt-1.5 truncate max-w-[85px]">
                    {top2.member.name}
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-300">
                    {renderPodiumMetric(top2)}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[85px]">
                    {renderPodiumSub(top2)}
                  </span>
                </Link>

                {/* 1st Place */}
                <Link href={`/member/${top1.member.id}`} className="flex flex-col items-center group -mt-4">
                  <Crown size={20} weight="fill" className="text-amber-400 mb-1 animate-bounce" />
                  <div className="w-14 h-14 rounded-2xl ring-2 ring-amber-400 bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-lg relative shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform">
                    {top1.member.avatar || top1.member.name[0]}
                    <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                      1
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-300 mt-1.5 truncate max-w-[95px]">
                    {top1.member.name}
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    {renderPodiumMetric(top1)}
                  </span>
                  <span className="text-[10px] text-slate-300 truncate max-w-[95px]">
                    {renderPodiumSub(top1)}
                  </span>
                </Link>

                {/* 3rd Place */}
                <Link href={`/member/${top3.member.id}`} className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-2xl ring-2 ring-amber-700 bg-slate-800 flex items-center justify-center font-bold text-white relative shadow-lg group-hover:scale-105 transition-transform">
                    {top3.member.avatar || top3.member.name[0]}
                    <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white font-black text-[10px] flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white mt-1.5 truncate max-w-[85px]">
                    {top3.member.name}
                  </span>
                  <span className="text-[11px] font-extrabold text-amber-300">
                    {renderPodiumMetric(top3)}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[85px]">
                    {renderPodiumSub(top3)}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rankings ({ranked.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Sorted by {activeTab === "overall" ? "Elemen 2 Index" : activeTab === "target" ? "Target Proximity" : activeTab === "ideal" ? "Ideal Proximity" : "Streak"}
            </span>
          </div>

          <div className="space-y-2">
            {ranked.map((insight, index) => {
              const goalDetails = getGoalTypeDetails(insight.goalType);
              return (
                <Link
                  key={insight.member.id}
                  href={`/member/${insight.member.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.99] border border-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        index === 0
                          ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/50"
                          : index === 1
                          ? "bg-slate-300 text-slate-950"
                          : index === 2
                          ? "bg-amber-700 text-white"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      #{index + 1}
                    </div>

                    {/* Avatar & Member Info */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-slate-950"
                      style={{ backgroundColor: insight.member.color || "#F59E0B" }}
                    >
                      {insight.member.avatar || insight.member.name[0]}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {insight.member.name}
                        </span>

                        {/* Goal Tag Pill */}
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border flex items-center gap-0.5 ${goalDetails.badgeBg} ${goalDetails.badgeText}`}>
                          <span>{goalDetails.icon}</span>
                          <span>{goalDetails.label}</span>
                        </span>

                        {insight.streakWeeks >= 3 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-bold">
                            <Fire size={12} weight="fill" />
                            <span>{insight.streakWeeks}w</span>
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>
                          {formatWeight(insight.currentWeightKg, unit)}
                        </span>
                        <span>•</span>
                        <span>
                          Target: <strong className="text-slate-300">{formatWeight(insight.targetWeightKg, unit)}</strong>
                        </span>
                        {insight.member.heightCm > 0 && (
                          <>
                            <span>•</span>
                            <span>Ideal: {formatWeight(insight.idealWeightKg, unit)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary Metric based on active tab */}
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      {activeTab === "overall" && (
                        <>
                          <span className="text-sm font-black text-amber-400 block tabular-nums">
                            {insight.compositeScore} <span className="text-[10px] font-normal text-slate-400">pts</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {insight.goalProgressPercent}% goal • BMI {insight.currentBmi}
                          </span>
                        </>
                      )}

                      {activeTab === "target" && (
                        <>
                          <span className="text-sm font-extrabold text-emerald-400 block tabular-nums">
                            {insight.distanceToTargetKg === 0 ? "Goal Met!" : `${formatWeight(insight.distanceToTargetKg, unit)}`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {insight.goalProgressPercent}% reached
                          </span>
                        </>
                      )}

                      {activeTab === "ideal" && (
                        <>
                          <span className="text-sm font-extrabold text-cyan-400 block tabular-nums">
                            {insight.distanceToIdealKg === 0 ? "Ideal Bullseye" : `±${formatWeight(insight.distanceToIdealKg, unit)}`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            BMI {insight.currentBmi} ({insight.idealProximityScore}%)
                          </span>
                        </>
                      )}

                      {activeTab === "streak" && (
                        <>
                          <span className="text-sm font-extrabold text-amber-400 block tabular-nums">
                            {insight.streakWeeks} weeks
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {insight.historyCount} weigh-ins
                          </span>
                        </>
                      )}
                    </div>

                    <CaretRight size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                </Link>
              );
            })}

            {ranked.length === 0 && (
              <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 text-slate-400 text-xs">
                No members found in this category.
              </div>
            )}
          </div>
        </div>
      </div>

      <FluidBottomNav />
    </main>
  );
}
