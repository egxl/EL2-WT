"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  X,
  Plus,
  Minus,
  CheckCircle,
  CalendarBlank,
  NotePencil,
  Users,
  User,
  Check,
  Prohibit,
  TrendDown,
  TrendUp,
  Sparkle,
} from "@phosphor-icons/react";
import { Member, UnitPreference } from "@/types";
import {
  getMembers,
  addWeightLog,
  addWeightLogs,
  getUnitPreference,
  getMemberWeightLogs,
} from "@/lib/storage";
import { calculateBmi, getBmiCategoryDetails, kgToLbs, lbsToKg, formatWeight } from "@/lib/biometrics";

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMemberId?: string;
  initialMode?: "bulk" | "single";
  onSuccess?: () => void;
}

interface BulkMemberEntry {
  member: Member;
  lastWeightKg: number;
  enteredWeight: string; // string so typing decimal point works smoothly
  isAbsent: boolean;
  note?: string;
}

export function LogWeightModal({
  isOpen,
  onClose,
  preselectedMemberId,
  initialMode,
  onSuccess,
}: LogWeightModalProps) {
  const [mode, setMode] = useState<"bulk" | "single">("bulk");
  const [members, setMembers] = useState<Member[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [unit, setUnit] = useState<UnitPreference>("kg");

  // Single-log states
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [singleWeightKg, setSingleWeightKg] = useState<number>(75.0);
  const [singleWeightStr, setSingleWeightStr] = useState<string>("75.0");
  const [singleNote, setSingleNote] = useState<string>("");

  // Bulk-log states
  const [bulkEntries, setBulkEntries] = useState<BulkMemberEntry[]>([]);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (!isOpen) return;

    const loadedMembers = getMembers();
    setMembers(loadedMembers);
    setUnit(getUnitPreference());

    // Determine initial mode
    if (initialMode) {
      setMode(initialMode);
    } else if (preselectedMemberId) {
      setMode("single");
    } else {
      setMode("bulk");
    }

    // Initialize single mode active member & weight
    const activeId = preselectedMemberId || (loadedMembers.length > 0 ? loadedMembers[0].id : "");
    setSelectedMemberId(activeId);

    if (activeId) {
      const logs = getMemberWeightLogs(activeId);
      const initialWt = logs.length > 0 ? logs[logs.length - 1].weightKg : (loadedMembers.find(m => m.id === activeId)?.startingWeightKg || 75);
      setSingleWeightKg(initialWt);
      setSingleWeightStr(initialWt.toFixed(1));
    }

    // Initialize bulk entries
    const entries: BulkMemberEntry[] = loadedMembers.map((member) => {
      const logs = getMemberWeightLogs(member.id);
      const lastWeight = logs.length > 0 ? logs[logs.length - 1].weightKg : member.startingWeightKg;
      return {
        member,
        lastWeightKg: lastWeight,
        enteredWeight: "", // Empty so the maintainer types fresh measurements
        isAbsent: false,
      };
    });
    setBulkEntries(entries);
  }, [isOpen, preselectedMemberId, initialMode]);

  const handleMemberChange = (id: string) => {
    setSelectedMemberId(id);
    const logs = getMemberWeightLogs(id);
    const mem = members.find((m) => m.id === id);
    const lastWt = logs.length > 0 ? logs[logs.length - 1].weightKg : (mem?.startingWeightKg || 75);
    setSingleWeightKg(lastWt);
    setSingleWeightStr(lastWt.toFixed(1));
  };

  const handleAdjustSingleWeight = (deltaKg: number) => {
    const updated = Math.max(30, Math.round((singleWeightKg + deltaKg) * 10) / 10);
    setSingleWeightKg(updated);
    setSingleWeightStr(updated.toFixed(1));
  };

  const handleSingleWeightInput = (val: string) => {
    setSingleWeightStr(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setSingleWeightKg(num);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#F59E0B", "#10B981", "#06B6D4", "#F43F5E"],
    });
  };

  // Handle saving single weigh-in
  const handleSaveSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || singleWeightKg <= 0) return;

    addWeightLog({
      memberId: selectedMemberId,
      date,
      weightKg: Math.round(singleWeightKg * 10) / 10,
      note: singleNote.trim() || undefined,
    });

    triggerConfetti();
    if (onSuccess) onSuccess();
    onClose();
  };

  // Bulk entry updates
  const handleBulkWeightChange = (memberId: string, val: string) => {
    setBulkEntries((prev) =>
      prev.map((entry) => (entry.member.id === memberId ? { ...entry, enteredWeight: val } : entry))
    );
  };

  const handleBulkQuickAdjust = (memberId: string, deltaKg: number) => {
    setBulkEntries((prev) =>
      prev.map((entry) => {
        if (entry.member.id !== memberId) return entry;
        const currentVal = parseFloat(entry.enteredWeight) || entry.lastWeightKg;
        const nextVal = Math.max(30, Math.round((currentVal + deltaKg) * 10) / 10);
        return { ...entry, enteredWeight: nextVal.toFixed(1) };
      })
    );
  };

  const handleBulkToggleAbsent = (memberId: string) => {
    setBulkEntries((prev) =>
      prev.map((entry) => {
        if (entry.member.id !== memberId) return entry;
        return {
          ...entry,
          isAbsent: !entry.isAbsent,
          enteredWeight: !entry.isAbsent ? "" : entry.enteredWeight,
        };
      })
    );
  };

  // Pressing Enter advances to next member's input
  const handleBulkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex < bulkEntries.length) {
        const nextMemberId = bulkEntries[nextIndex].member.id;
        inputRefs.current[nextMemberId]?.focus();
        inputRefs.current[nextMemberId]?.select();
      }
    }
  };

  // Handle saving bulk session
  const handleSaveBulk = (e: React.FormEvent) => {
    e.preventDefault();
    const validLogsToSave = bulkEntries
      .filter((entry) => !entry.isAbsent && entry.enteredWeight.trim() !== "")
      .map((entry) => {
        const wt = parseFloat(entry.enteredWeight);
        return {
          memberId: entry.member.id,
          date,
          weightKg: Math.round(wt * 10) / 10,
          note: entry.note?.trim() || undefined,
        };
      })
      .filter((log) => !isNaN(log.weightKg) && log.weightKg > 0);

    if (validLogsToSave.length === 0) return;

    addWeightLogs(validLogsToSave);
    triggerConfetti();
    if (onSuccess) onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  // Single mode preview biometrics
  const activeMember = members.find((m) => m.id === selectedMemberId);
  const previewBmi = activeMember ? calculateBmi(singleWeightKg, activeMember.heightCm) : 0;
  const bmiInfo = getBmiCategoryDetails(previewBmi);
  const singleDelta = activeMember ? Math.round((singleWeightKg - activeMember.startingWeightKg) * 10) / 10 : 0;

  // Bulk stats summary
  const bulkEnteredCount = bulkEntries.filter((e) => !e.isAbsent && parseFloat(e.enteredWeight) > 0).length;
  const bulkTotalCount = bulkEntries.length;
  const bulkActiveCount = bulkEntries.filter((e) => !e.isAbsent).length;

  // Calculate cohort weekly delta for entered weights
  const validBulkEntriesWithDiff = bulkEntries.filter(
    (e) => !e.isAbsent && !isNaN(parseFloat(e.enteredWeight)) && parseFloat(e.enteredWeight) > 0
  );
  const bulkCohortDelta = Math.round(
    validBulkEntriesWithDiff.reduce(
      (sum, e) => sum + (parseFloat(e.enteredWeight) - e.lastWeightKg),
      0
    ) * 10
  ) / 10;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[#0D1117] border border-white/10 shadow-2xl relative animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                {mode === "bulk" ? <Users size={20} weight="duotone" /> : <User size={20} weight="duotone" />}
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {mode === "bulk" ? "Weekly Cohort Weigh-In" : "Log Member Weigh-In"}
                </h2>
                <p className="text-xs text-slate-400">
                  {mode === "bulk" ? "Fast bulk entry for weekly group weigh-in" : "Direct single entry"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 mt-3 p-1 rounded-xl bg-slate-900 border border-white/5">
            <button
              type="button"
              onClick={() => setMode("bulk")}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === "bulk"
                  ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users size={15} weight={mode === "bulk" ? "bold" : "regular"} />
              <span>Weekly Bulk Roster</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("single")}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === "single"
                  ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User size={15} weight={mode === "single" ? "bold" : "regular"} />
              <span>Single Member</span>
            </button>
          </div>
        </div>

        {/* ===================== MODE 1: WEEKLY BULK WEIGH-IN ===================== */}
        {mode === "bulk" && (
          <form onSubmit={handleSaveBulk} className="flex-1 flex flex-col min-h-0">
            <div className="p-4 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
              {/* Session Date Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CalendarBlank size={16} className="text-amber-400" />
                  <span>Session Date</span>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Roster Info Banner */}
              <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-medium">
                <span>Pass phone or enter as members step onto scale</span>
                <span>Press Enter for next member</span>
              </div>

              {/* Member Roster Entry Cards */}
              <div className="space-y-2">
                {bulkEntries.map((entry, index) => {
                  const numVal = parseFloat(entry.enteredWeight);
                  const hasEntered = !isNaN(numVal) && numVal > 0;
                  const diff = hasEntered ? Math.round((numVal - entry.lastWeightKg) * 10) / 10 : null;

                  return (
                    <div
                      key={entry.member.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        entry.isAbsent
                          ? "bg-slate-950/40 border-white/5 opacity-50"
                          : hasEntered
                          ? "bg-slate-900/90 border-amber-500/40 shadow-sm"
                          : "bg-slate-900/60 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Member Info */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-slate-950 shrink-0 shadow"
                            style={{ backgroundColor: entry.member.color || "#F59E0B" }}
                          >
                            {entry.member.avatar || entry.member.name[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-white truncate block">
                                {entry.member.name}
                              </span>
                              {entry.isAbsent && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-white/10">
                                  Absent
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              Last: <strong className="text-slate-300 font-semibold">{entry.lastWeightKg.toFixed(1)} kg</strong>
                            </span>
                          </div>
                        </div>

                        {/* Numeric Weight Input & Micro Steppers */}
                        {!entry.isAbsent ? (
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Live Delta Badge */}
                            {diff !== null && (
                              <div
                                className={`px-2 py-1 rounded-lg text-xs font-bold tabular-nums flex items-center gap-0.5 ${
                                  diff < 0
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : diff > 0
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                    : "bg-white/10 text-slate-300"
                                }`}
                              >
                                {diff < 0 ? <TrendDown size={13} weight="bold" /> : diff > 0 ? <TrendUp size={13} weight="bold" /> : null}
                                <span>{diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)}</span>
                              </div>
                            )}

                            {/* Weight Number Input */}
                            <div className="relative">
                              <input
                                ref={(el) => {
                                  inputRefs.current[entry.member.id] = el;
                                }}
                                type="number"
                                step="0.1"
                                inputMode="decimal"
                                placeholder={entry.lastWeightKg.toFixed(1)}
                                value={entry.enteredWeight}
                                onChange={(e) => handleBulkWeightChange(entry.member.id, e.target.value)}
                                onKeyDown={(e) => handleBulkKeyDown(e, index)}
                                className="w-24 h-11 px-2.5 pr-7 rounded-xl bg-black/60 border border-white/15 focus:border-amber-400 focus:bg-slate-900 text-white font-extrabold text-base text-right tabular-nums focus:outline-none transition-all placeholder:text-slate-600"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 pointer-events-none">
                                kg
                              </span>
                            </div>

                            {/* Absent Toggle Button */}
                            <button
                              type="button"
                              onClick={() => handleBulkToggleAbsent(entry.member.id)}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center transition-colors"
                              title="Mark member absent for this session"
                            >
                              <Prohibit size={15} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 italic">Skipped</span>
                            <button
                              type="button"
                              onClick={() => handleBulkToggleAbsent(entry.member.id)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 text-xs font-semibold"
                            >
                              Include
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky Bottom Actions Bar */}
            <div className="p-4 border-t border-white/10 bg-[#0D1117]/95 backdrop-blur-md space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs font-semibold px-1">
                <span className="text-slate-400">
                  Status: <strong className="text-white">{bulkEnteredCount} of {bulkActiveCount}</strong> weighed in
                </span>
                {bulkEnteredCount > 0 && (
                  <span className={bulkCohortDelta <= 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    Group: {bulkCohortDelta <= 0 ? `${bulkCohortDelta.toFixed(1)} kg` : `+${bulkCohortDelta.toFixed(1)} kg`} this session
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={bulkEnteredCount === 0}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} weight="bold" />
                <span>Save Weekly Weigh-In ({bulkEnteredCount} {bulkEnteredCount === 1 ? "member" : "members"})</span>
              </button>
            </div>
          </form>
        )}

        {/* ===================== MODE 2: SINGLE MEMBER LOG ===================== */}
        {mode === "single" && (
          <form onSubmit={handleSaveSingle} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
            {/* Member Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-2 block uppercase tracking-wider">
                Select Member
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {members.map((member) => {
                  const isSelected = member.id === selectedMemberId;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleMemberChange(member.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium shrink-0 transition-all ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-500/50 text-white shadow-sm shadow-amber-500/20"
                          : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] text-slate-950"
                        style={{ backgroundColor: member.color || "#F59E0B" }}
                      >
                        {member.avatar || member.name[0]}
                      </div>
                      <span>{member.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Weight Input & Steppers */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-3">
              <span className="text-xs text-slate-400 font-medium">Recorded Weight (kg)</span>

              {/* Direct numeric input with steppers */}
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdjustSingleWeight(-0.5)}
                  className="w-9 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 font-bold text-xs"
                >
                  -0.5
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustSingleWeight(-0.1)}
                  className="w-8 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 text-xs font-bold"
                >
                  <Minus size={13} weight="bold" />
                </button>

                <div className="relative inline-block mx-1">
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={singleWeightStr}
                    onChange={(e) => handleSingleWeightInput(e.target.value)}
                    className="w-32 h-12 text-center text-3xl font-extrabold text-white bg-black/50 border border-amber-500/40 rounded-xl tabular-nums focus:outline-none focus:border-amber-400"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 pointer-events-none">
                    kg
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdjustSingleWeight(0.1)}
                  className="w-8 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 text-xs font-bold"
                >
                  <Plus size={13} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustSingleWeight(0.5)}
                  className="w-9 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 font-bold text-xs"
                >
                  +0.5
                </button>
              </div>

              {/* Live Biometrics Preview Pill */}
              {activeMember && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/5 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full border ${bmiInfo.badgeBg} ${bmiInfo.badgeText} font-semibold`}>
                    {previewBmi > 0 ? `BMI ${previewBmi} (${bmiInfo.category})` : "Pending Height"}
                  </span>
                  <span className="text-slate-400">
                    Height: <strong className="text-slate-200">{activeMember.heightCm > 0 ? `${activeMember.heightCm} cm` : "Pending"}</strong>
                  </span>
                  <span className={singleDelta <= 0 ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                    {singleDelta <= 0 ? `${Math.abs(singleDelta).toFixed(1)} kg dropped` : `+${singleDelta.toFixed(1)} kg`}
                  </span>
                </div>
              )}
            </div>

            {/* Date Input */}
            <div>
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1.5">
                <CalendarBlank size={14} />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Note Input */}
            <div>
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1.5">
                <NotePencil size={14} />
                <span>Note (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Morning weigh-in, post-workout"
                value={singleNote}
                onChange={(e) => setSingleNote(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle size={18} weight="bold" />
              <span>Save Weigh-In</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
