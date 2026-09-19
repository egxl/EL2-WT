"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { X, Plus, Minus, CheckCircle, CalendarBlank, Smiley, NotePencil } from "@phosphor-icons/react";
import { Member, UnitPreference } from "@/types";
import { getMembers, addWeightLog, getUnitPreference, getMemberWeightLogs } from "@/lib/storage";
import { calculateBmi, getBmiCategoryDetails, kgToLbs, lbsToKg } from "@/lib/biometrics";

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMemberId?: string;
  onSuccess?: () => void;
}

export function LogWeightModal({
  isOpen,
  onClose,
  preselectedMemberId,
  onSuccess,
}: LogWeightModalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [weightKg, setWeightKg] = useState<number>(75.0);
  const [note, setNote] = useState<string>("");
  const [mood, setMood] = useState<"great" | "good" | "steady" | "tough">("great");
  const [unit, setUnit] = useState<UnitPreference>("kg");

  useEffect(() => {
    const loadedMembers = getMembers();
    setMembers(loadedMembers);
    setUnit(getUnitPreference());

    const activeId = preselectedMemberId || (loadedMembers.length > 0 ? loadedMembers[0].id : "");
    setSelectedMemberId(activeId);

    if (activeId) {
      const logs = getMemberWeightLogs(activeId);
      if (logs.length > 0) {
        setWeightKg(logs[logs.length - 1].weightKg);
      } else {
        const mem = loadedMembers.find((m) => m.id === activeId);
        if (mem) setWeightKg(mem.startingWeightKg);
      }
    }
  }, [preselectedMemberId, isOpen]);

  const handleMemberChange = (id: string) => {
    setSelectedMemberId(id);
    const logs = getMemberWeightLogs(id);
    if (logs.length > 0) {
      setWeightKg(logs[logs.length - 1].weightKg);
    } else {
      const mem = members.find((m) => m.id === id);
      if (mem) setWeightKg(mem.startingWeightKg);
    }
  };

  const activeMember = members.find((m) => m.id === selectedMemberId);

  const handleAdjustWeight = (deltaKg: number) => {
    setWeightKg((prev) => Math.max(30, Math.round((prev + deltaKg) * 10) / 10));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#F59E0B", "#10B981", "#06B6D4", "#F43F5E"],
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || weightKg <= 0) return;

    addWeightLog({
      memberId: selectedMemberId,
      date,
      weightKg,
      note: note.trim() || undefined,
      mood,
    });

    triggerConfetti();
    if (onSuccess) onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  // Real-time preview metrics
  const previewBmi = activeMember ? calculateBmi(weightKg, activeMember.heightCm) : 0;
  const bmiInfo = getBmiCategoryDetails(previewBmi);
  const deltaFromStart = activeMember
    ? Math.round((activeMember.startingWeightKg - weightKg) * 10) / 10
    : 0;

  const displayWeight = unit === "lbs" ? kgToLbs(weightKg) : weightKg;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#0D1117] border border-white/10 p-5 shadow-2xl relative animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Log Member Weigh-in</h2>
            <p className="text-xs text-slate-400">Elemen 2 official check-in record</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-4">
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

          {/* Weight Stepper & Display */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-center">
            <span className="text-xs text-slate-400 font-medium">Recorded Weight</span>
            
            <div className="flex items-center justify-center gap-3 my-3">
              <button
                type="button"
                onClick={() => handleAdjustWeight(-0.5)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 font-bold text-sm"
              >
                -0.5
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWeight(-0.1)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 text-xs font-bold"
              >
                <Minus size={14} weight="bold" />
              </button>

              <div className="min-w-[120px] text-center">
                <span className="text-4xl font-extrabold text-white tracking-tight tabular-nums">
                  {displayWeight.toFixed(1)}
                </span>
                <span className="text-base font-semibold text-amber-400 ml-1.5">{unit}</span>
              </div>

              <button
                type="button"
                onClick={() => handleAdjustWeight(0.1)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 text-xs font-bold"
              >
                <Plus size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWeight(0.5)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 flex items-center justify-center text-slate-200 font-bold text-sm"
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
                <span className={deltaFromStart >= 0 ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                  {deltaFromStart >= 0 ? `-${deltaFromStart.toFixed(1)} kg lost` : `+${Math.abs(deltaFromStart).toFixed(1)} kg`}
                </span>
              </div>
            )}
          </div>

          {/* Date & Mood Row */}
          <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1.5">
                <Smiley size={14} />
                <span>Feeling / Energy</span>
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-[#0D1117] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="great">🔥 Great (High Energy)</option>
                <option value="good">⚡ Good (Solid Pacing)</option>
                <option value="steady">🧘 Steady (Consistent)</option>
                <option value="tough">💪 Tough (Pushing Through)</option>
              </select>
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-1.5">
              <NotePencil size={14} />
              <span>Note (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Post 5k run, fasting day, gym session"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <CheckCircle size={18} weight="bold" />
            <span>Save Elemen 2 Weigh-In</span>
          </button>
        </form>
      </div>
    </div>
  );
}
