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

      <div className="px-4 py-4 space-y-4 font-mono">
        {/* Page Title */}
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2 font-sans">
            <Heartbeat size={22} className="text-volt-500" weight="fill" />
            <span>Biometric Telemetry</span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Height-Normalized WHO Zone Calibration & Body Mechanics
          </p>
        </div>

        {/* Cohort Category Distribution Bento */}
        <div className="plate-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
              <ChartPie size={16} className="text-volt-400" weight="duotone" />
              <span>Squad Health Spectrum</span>
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              Avg BMI: {cohortSummary.averageCurrentBmi > 0 ? cohortSummary.averageCurrentBmi.toFixed(1) : "Pending"}
            </span>
          </div>

          {/* Distribution Bar */}
          <div className="h-3 w-full rounded-md overflow-hidden flex bg-carbon-950 border border-white/[0.08] shadow-plate-inset p-0.5">
            {categoryCounts.Pending > 0 && (
              <div
                style={{ width: `${(categoryCounts.Pending / members.length) * 100}%` }}
                className="bg-slate-500 rounded-l-sm"
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
                className="bg-rose-500 rounded-r-sm"
                title="Obese"
              />
            )}
          </div>

          {/* Category legend pills */}
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
            <div className="p-1.5 rounded-lg bg-carbon-900 border border-white/[0.05]">
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

        {/* Athlete Deep-Dive Selector */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
            Athlete Biometric Inspector
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {insights.map((ins) => {
              const isSelected = ins.member.id === selectedMemberId;
              return (
                <button
                  key={ins.member.id}
                  onClick={() => setSelectedMemberId(ins.member.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium shrink-0 transition-all ${
                    isSelected
                      ? "bg-volt-500/20 border-volt-500/50 text-white shadow-sm font-bold"
                      : "bg-carbon-850 border-white/[0.06] text-slate-400 hover:bg-carbon-800"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] text-slate-950"
                    style={{ backgroundColor: ins.member.color || "#D4F63D" }}
                  >
                    {ins.member.avatar || ins.member.name[0]}
                  </div>
                  <span className="font-sans">{ins.member.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Member Biometrics Card */}
        {activeInsight && (
          <div className="space-y-3">
            {/* Header info */}
            <div className="p-3.5 rounded-xl bg-carbon-850 border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-slate-950 text-base shadow-sm"
                  style={{ backgroundColor: activeInsight.member.color || "#D4F63D" }}
                >
                  {activeInsight.member.avatar || activeInsight.member.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-sans">{activeInsight.member.name}</h3>
                  <p className="text-[11px] text-slate-400">
                    Height:{" "}
                    <strong className="text-volt-400 font-bold">
                      {activeInsight.member.heightCm > 0 ? `${activeInsight.member.heightCm} cm` : "Pending measurement"}
                    </strong>
                  </p>
                </div>
              </div>

              <Link
                href={`/member/${activeInsight.member.id}`}
                className="px-2.5 py-1.5 rounded-lg bg-carbon-800 hover:bg-carbon-700 text-xs font-semibold text-volt-400 flex items-center gap-1 border border-white/[0.06]"
              >
                <span>Profile</span>
                <CaretRight size={13} weight="bold" />
              </Link>
            </div>

            {/* Continuous BMI Gauge */}
            <div className="plate-card p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block font-sans">
                Precision Caliper Spectrum
              </span>
              <BMIScaleGauge bmi={activeInsight.currentBmi} />
            </div>

            {/* Healthy Range Target Card */}
            <HealthyRangeCard insight={activeInsight} unit={unit} />
          </div>
        )}

        {/* Informational WHO Guide */}
        <div className="plate-recessed p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 font-sans">
            <Info size={15} className="text-volt-400" />
            <span>WHO Biometric Standards</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
            BMI is calculated as <code>weight (kg) / [height (m)]²</code>. Because height is permanently calibrated for every Elemen 2 athlete, individual target brackets (18.5 – 24.9) are tailored to avoid generic, unscientific weight targets.
          </p>
        </div>
      </div>

      <FluidBottomNav />
    </main>
  );
}
