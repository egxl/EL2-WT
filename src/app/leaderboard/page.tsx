"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { FluidBottomNav } from "@/components/layout/FluidBottomNav";
import { getMembers, getWeightLogs, getUnitPreference, subscribeToStorage } from "@/lib/storage";
import { calculateMemberInsight, formatWeight } from "@/lib/biometrics";
import { Member, WeightLog, UnitPreference, MemberInsight } from "@/types";
import { Trophy, Medal, Fire, CaretRight, Crown } from "@phosphor-icons/react";

export default function LeaderboardPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [sortBy, setSortBy] = useState<"percent" | "absolute">("percent");

  const loadData = () => {
    setMembers(getMembers());
    setLogs(getWeightLogs());
    setUnit(getUnitPreference());
  };

  useEffect(() => {
    loadData();
    return subscribeToStorage(() => loadData());
  }, []);

  const insights = members.map((m) => calculateMemberInsight(m, logs));

  // Sort by selected criteria
  const ranked = [...insights].sort((a, b) => {
    if (sortBy === "percent") {
      return b.percentLoss - a.percentLoss;
    }
    return b.totalLossKg - a.totalLossKg;
  });

  const top1 = ranked[0];
  const top2 = ranked[1];
  const top3 = ranked[2];

  return (
    <main className="flex-1 flex flex-col pb-28">
      <TopBar />

      <div className="px-4 py-4 space-y-5">
        {/* Header & Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Trophy size={22} className="text-amber-400" weight="fill" />
              <span>Elemen 2 Standings</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Transparent group progress & rankings</p>
          </div>

          {/* Metric Sort Toggle */}
          <div className="p-1 rounded-xl bg-white/5 border border-white/10 flex text-[11px] font-semibold">
            <button
              onClick={() => setSortBy("percent")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === "percent"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              % Lost
            </button>
            <button
              onClick={() => setSortBy("absolute")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sortBy === "absolute"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Total kg
            </button>
          </div>
        </div>

        {/* Podium for Top 3 (if at least 3 members) */}
        {ranked.length >= 3 && (
          <div className="bezel-outer">
            <div className="bezel-inner p-4 bg-gradient-to-b from-amber-500/10 via-[#0D1117] to-[#0D1117]">
              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 block text-center mb-3">
                🏆 Group Podium
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
                  <span className="text-xs font-bold text-white mt-1.5 truncate max-w-[80px]">
                    {top2.member.name}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-400">
                    {sortBy === "percent" ? `${top2.percentLoss}%` : formatWeight(top2.totalLossKg, unit)}
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
                  <span className="text-xs font-bold text-amber-300 mt-1.5 truncate max-w-[90px]">
                    {top1.member.name}
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    {sortBy === "percent" ? `${top1.percentLoss}%` : formatWeight(top1.totalLossKg, unit)}
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
                  <span className="text-xs font-bold text-white mt-1.5 truncate max-w-[80px]">
                    {top3.member.name}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-400">
                    {sortBy === "percent" ? `${top3.percentLoss}%` : formatWeight(top3.totalLossKg, unit)}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Full Leaderboard Rankings
          </span>

          <div className="space-y-2">
            {ranked.map((insight, index) => {
              const isTop = index === 0;
              return (
                <Link
                  key={insight.member.id}
                  href={`/member/${insight.member.id}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.99] border border-white/5 transition-all group"
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
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {insight.member.name}
                        </span>
                        {insight.streakWeeks >= 3 && (
                          <Fire size={13} weight="fill" className="text-amber-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {formatWeight(insight.startingWeightKg, unit)} →{" "}
                        <strong className="text-slate-200">{formatWeight(insight.currentWeightKg, unit)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Metrics & Delta */}
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="text-sm font-extrabold text-emerald-400 block tabular-nums">
                        {sortBy === "percent"
                          ? `-${insight.percentLoss}%`
                          : `-${formatWeight(insight.totalLossKg, unit)}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        BMI {insight.currentBmi}
                      </span>
                    </div>
                    <CaretRight size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <FluidBottomNav />
    </main>
  );
}
