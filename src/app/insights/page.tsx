"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { FluidBottomNav } from "@/components/layout/FluidBottomNav";
import { BMIScaleGauge } from "@/components/insights/BMIScaleGauge";
import { HealthyRangeCard } from "@/components/insights/HealthyRangeCard";
import { getMembers, getWeightLogs, getUnitPreference, subscribeToStorage } from "@/lib/storage";
import { calculateMemberInsight, calculateCohortSummary } from "@/lib/biometrics";
import { Member, WeightLog, UnitPreference } from "@/types";
import { Heartbeat, Info, ShieldCheck, CaretRight, ChartPie } from "@phosphor-icons/react";

export default function InsightsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");

  const loadData = () => {
    const mems = getMembers();
    setMembers(mems);
    setLogs(getWeightLogs());
    setUnit(getUnitPreference());
    if (mems.length > 0 && !selectedMemberId) {
      setSelectedMemberId(mems[0].id);
    }
  };

  useEffect(() => {
    loadData();
    return subscribeToStorage(() => loadData());
  }, []);

  const cohortSummary = calculateCohortSummary(members, logs);
  const insights = members.map((m) => calculateMemberInsight(m, logs));
  const activeInsight = insights.find((i) => i.member.id === selectedMemberId) || insights[0];

  // Distribution across categories
  const categoryCounts = {
    Pending: insights.filter((i) => i.bmiCategory === "Pending" || !i.member.heightCm || i.member.heightCm <= 0).length,
    Underweight: insights.filter((i) => i.member.heightCm > 0 && i.bmiCategory === "Underweight").length,
    Normal: insights.filter((i) => i.member.heightCm > 0 && i.bmiCategory === "Normal").length,
    Overweight: insights.filter((i) => i.member.heightCm > 0 && i.bmiCategory === "Overweight").length,
    Obese: insights.filter((i) => i.member.heightCm > 0 && i.bmiCategory.startsWith("Obese")).length,
  };

  return (
    <main className="flex-1 flex flex-col pb-28">
      <TopBar />

      <div className="px-4 py-4 space-y-5">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Heartbeat size={22} className="text-cyan-400" weight="fill" />
            <span>Biometric Insights</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Height-normalized BMI analysis & healthy range targets
          </p>
        </div>

        {/* Cohort Category Distribution Bento */}
        <div className="bezel-outer">
          <div className="bezel-inner p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ChartPie size={16} className="text-amber-400" weight="duotone" />
                <span>Elemen 2 Health Distribution</span>
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                Avg BMI: {cohortSummary.averageCurrentBmi > 0 ? cohortSummary.averageCurrentBmi.toFixed(1) : "Pending"}
              </span>
            </div>

            {/* Distribution Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-900 border border-white/5">
              {categoryCounts.Pending > 0 && (
                <div
                  style={{ width: `${(categoryCounts.Pending / members.length) * 100}%` }}
                  className="bg-slate-500"
                  title="Pending Height"
                />
              )}
              {categoryCounts.Underweight > 0 && (
                <div
                  style={{ width: `${(categoryCounts.Underweight / members.length) * 100}%` }}
                  className="bg-sky-400"
                  title="Underweight"
                />
              )}
              {categoryCounts.Normal > 0 && (
                <div
                  style={{ width: `${(categoryCounts.Normal / members.length) * 100}%` }}
                  className="bg-emerald-500"
                  title="Normal"
                />
              )}
              {categoryCounts.Overweight > 0 && (
                <div
                  style={{ width: `${(categoryCounts.Overweight / members.length) * 100}%` }}
                  className="bg-amber-500"
                  title="Overweight"
                />
              )}
              {categoryCounts.Obese > 0 && (
                <div
                  style={{ width: `${(categoryCounts.Obese / members.length) * 100}%` }}
                  className="bg-rose-500"
                  title="Obese"
                />
              )}
            </div>

            {/* Category legend pills */}
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                <span className="block text-slate-400 font-bold">{categoryCounts.Pending}</span>
                <span className="text-slate-400">Pending</span>
              </div>
              <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <span className="block text-sky-400 font-bold">{categoryCounts.Underweight}</span>
                <span className="text-sky-300">Under</span>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="block text-emerald-400 font-bold">{categoryCounts.Normal}</span>
                <span className="text-emerald-300 font-semibold">Normal</span>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="block text-amber-400 font-bold">{categoryCounts.Overweight}</span>
                <span className="text-amber-300 font-semibold">Over</span>
              </div>
              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="block text-rose-400 font-bold">{categoryCounts.Obese}</span>
                <span className="text-rose-300">Obese</span>
              </div>
            </div>
          </div>
        </div>

        {/* Member Deep-Dive Selector */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Member Deep-Dive
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {insights.map((ins) => {
              const isSelected = ins.member.id === selectedMemberId;
              return (
                <button
                  key={ins.member.id}
                  onClick={() => setSelectedMemberId(ins.member.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium shrink-0 transition-all ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-500/50 text-white shadow-sm shadow-amber-500/20"
                      : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-950"
                    style={{ backgroundColor: ins.member.color || "#F59E0B" }}
                  >
                    {ins.member.avatar || ins.member.name[0]}
                  </div>
                  <span>{ins.member.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Member Biometrics Card */}
        {activeInsight && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-slate-950 text-lg shadow-md"
                  style={{ backgroundColor: activeInsight.member.color || "#F59E0B" }}
                >
                  {activeInsight.member.avatar || activeInsight.member.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{activeInsight.member.name}</h3>
                  <p className="text-xs text-slate-400">
                    Height:{" "}
                    <strong className="text-cyan-400 font-bold">
                      {activeInsight.member.heightCm > 0 ? `${activeInsight.member.heightCm} cm` : "Pending measurement"}
                    </strong>
                  </p>
                </div>
              </div>

              <Link
                href={`/member/${activeInsight.member.id}`}
                className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-amber-400 flex items-center gap-1"
              >
                <span>Profile</span>
                <CaretRight size={13} weight="bold" />
              </Link>
            </div>

            {/* Continuous BMI Gauge */}
            <div className="bezel-outer">
              <div className="bezel-inner p-4 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Continuous BMI Spectrum
                </span>
                <BMIScaleGauge bmi={activeInsight.currentBmi} />
              </div>
            </div>

            {/* Healthy Range Target Card */}
            <HealthyRangeCard insight={activeInsight} unit={unit} />
          </div>
        )}

        {/* Informational WHO Guide */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Info size={16} className="text-cyan-400" />
            <span>WHO BMI Reference Standards</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            BMI is calculated as <code>weight (kg) / [height (m)]²</code>. Because height is permanently saved for every Elemen 2 member, individual target ranges (18.5 – 24.9) are mathematically tailored to avoid generic, uncalibrated weight loss targets.
          </p>
        </div>
      </div>

      <FluidBottomNav />
    </main>
  );
}
