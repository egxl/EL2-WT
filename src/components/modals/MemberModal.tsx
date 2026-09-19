"use client";

import React, { useState, useEffect } from "react";
import { X, UserPlus, CheckCircle, Trash, Heartbeat, Sparkle, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Member, GoalType } from "@/types";
import { saveMember, deleteMember } from "@/lib/storage";
import {
  calculateBmi,
  getHealthyWeightRange,
  getBmiCategoryDetails,
  getTargetWeightSuggestions,
  determineGoalType,
} from "@/lib/biometrics";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
  onSaved?: () => void;
}

const COLOR_PALETTE = [
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#F97316", // Orange
  "#14B8A6", // Teal
];

export function MemberModal({
  isOpen,
  onClose,
  memberToEdit,
  onSaved,
}: MemberModalProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [heightCm, setHeightCm] = useState<number | string>("");
  const [startingWeightKg, setStartingWeightKg] = useState<number | string>(80.0);
  const [targetWeightKg, setTargetWeightKg] = useState<number | string>(70.0);
  const [goalType, setGoalType] = useState<GoalType | "auto">("auto");
  const [isCustomTarget, setIsCustomTarget] = useState(false);
  const [notes, setNotes] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setAvatar(memberToEdit.avatar);
      setColor(memberToEdit.color || COLOR_PALETTE[0]);
      setHeightCm(memberToEdit.heightCm > 0 ? memberToEdit.heightCm : "");
      setStartingWeightKg(memberToEdit.startingWeightKg);
      setTargetWeightKg(memberToEdit.targetWeightKg);
      setGoalType(memberToEdit.goalType || "auto");
      setNotes(memberToEdit.notes || "");
      setIsCustomTarget(true);
    } else {
      setName("");
      setAvatar("");
      setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
      setHeightCm("");
      setStartingWeightKg(80.0);
      const sug = getTargetWeightSuggestions(0, 80.0);
      setTargetWeightKg(sug.defaultTargetKg);
      setGoalType("auto");
      setNotes("");
      setIsCustomTarget(false);
    }
    setShowDeleteConfirm(false);
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const numHeight = Number(heightCm) || 0;
  const numStarting = Number(startingWeightKg) || 0;
  const numTarget = Number(targetWeightKg) || numStarting;

  const healthyRange = getHealthyWeightRange(numHeight);
  const suggestions = getTargetWeightSuggestions(numHeight, numStarting);
  const startBmi = calculateBmi(numStarting, numHeight);
  const targetBmi = calculateBmi(numTarget, numHeight);
  const startBmiInfo = getBmiCategoryDetails(startBmi);
  const detectedGoal = determineGoalType(numStarting, numTarget, goalType === "auto" ? undefined : goalType);

  const handleHeightChange = (val: number | string) => {
    setHeightCm(val);
    if (!isCustomTarget) {
      const h = Number(val) || 0;
      const sug = getTargetWeightSuggestions(h, numStarting);
      setTargetWeightKg(sug.defaultTargetKg);
    }
  };

  const handleStartingWeightChange = (val: number | string) => {
    setStartingWeightKg(val);
    if (!isCustomTarget) {
      const s = Number(val) || 0;
      const sug = getTargetWeightSuggestions(numHeight, s);
      setTargetWeightKg(sug.defaultTargetKg);
    }
  };

  const handleTargetWeightChange = (val: number | string) => {
    setIsCustomTarget(true);
    setTargetWeightKg(val);
  };

  const handleApplyPreset = (targetKg: number) => {
    if (targetKg <= 0) return;
    setTargetWeightKg(targetKg);
    setIsCustomTarget(true);
  };

  const handleResetToAuto = () => {
    setIsCustomTarget(false);
    const sug = getTargetWeightSuggestions(numHeight, numStarting);
    setTargetWeightKg(sug.defaultTargetKg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || numStarting <= 0) return;

    const member: Member = {
      id: memberToEdit ? memberToEdit.id : `mem-${Date.now()}`,
      name: name.trim(),
      avatar: (avatar.trim() || name.trim()[0]).toUpperCase(),
      color,
      heightCm: numHeight,
      startingWeightKg: numStarting,
      targetWeightKg: numTarget,
      goalType: goalType === "auto" ? undefined : goalType,
      joinDate: memberToEdit ? memberToEdit.joinDate : new Date().toISOString().split("T")[0],
      notes: notes.trim() || undefined,
    };

    saveMember(member);
    if (onSaved) onSaved();
    onClose();
  };

  const handleDelete = () => {
    if (memberToEdit) {
      deleteMember(memberToEdit.id);
      if (onSaved) onSaved();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#0D1117] border border-white/10 p-5 shadow-2xl relative animate-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {memberToEdit ? `Edit ${memberToEdit.name}` : "Add New Elemen 2 Member"}
            </h2>
            <p className="text-xs text-slate-400">Height is mandatory for deep BMI calculations</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name & Avatar Initial */}
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-3">
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Budi"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!avatar && e.target.value.trim().length > 0) {
                    setAvatar(e.target.value.trim()[0].toUpperCase());
                  }
                }}
                required
                className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Initial</label>
              <input
                type="text"
                maxLength={2}
                placeholder="B"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value.toUpperCase())}
                className="w-full h-11 px-3 text-center rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Color Tag Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Theme Accent</label>
            <div className="flex gap-2.5">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? "scale-125 ring-2 ring-white" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Height in cm (Optional / Pending) */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Heartbeat size={15} weight="fill" />
                <span>Height (cm)</span>
              </label>
              <span className="text-[11px] text-cyan-200/80 font-mono">Optional for now</span>
            </div>
            <input
              type="number"
              step="1"
              min="100"
              max="250"
              placeholder="e.g. 175 (leave empty if pending)"
              value={heightCm}
              onChange={(e) => handleHeightChange(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full h-11 px-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-white text-base font-bold tabular-nums focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 placeholder:font-normal placeholder:text-xs"
            />
            {numHeight > 0 ? (
              <p className="text-[11px] text-cyan-300/90 mt-2">
                Healthy weight span (BMI 18.5 - 24.9): <strong>{healthyRange.minKg} kg</strong> – <strong>{healthyRange.maxKg} kg</strong>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-2">
                Can be left empty for now. BMI & healthy target range will update automatically once height is added.
              </p>
            )}
          </div>

          {/* Goal Program Track */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Goal Program Track</label>
              <span className="text-[10px] text-slate-400">
                Mode:{" "}
                <strong className="text-amber-400 capitalize">
                  {detectedGoal === "cutting" ? "🔥 Cutting" : detectedGoal === "bulking" ? "💪 Bulking" : "⚖️ Maintaining"}
                </strong>
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setGoalType("auto")}
                className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                  goalType === "auto"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setGoalType("cutting")}
                className={`py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                  goalType === "cutting"
                    ? "bg-rose-500 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>🔥</span>
                <span>Cut</span>
              </button>
              <button
                type="button"
                onClick={() => setGoalType("bulking")}
                className={`py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                  goalType === "bulking"
                    ? "bg-indigo-500 text-white font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>💪</span>
                <span>Bulk</span>
              </button>
              <button
                type="button"
                onClick={() => setGoalType("maintaining")}
                className={`py-1.5 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                  goalType === "maintaining"
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>⚖️</span>
                <span>Maint</span>
              </button>
            </div>
          </div>

          {/* Starting & Target Weights */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Starting Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={startingWeightKg}
                onChange={(e) => handleStartingWeightChange(e.target.value === "" ? "" : Number(e.target.value))}
                required
                className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold tabular-nums focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Start BMI: <strong className={startBmiInfo.badgeText}>{startBmi > 0 ? startBmi : "Pending"}</strong>
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Target Weight (kg)</label>
                {isCustomTarget ? (
                  <span className="text-[10px] text-amber-400 font-medium px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    Custom override
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                    <Sparkle size={10} weight="fill" />
                    Auto
                  </span>
                )}
              </div>
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={targetWeightKg}
                onChange={(e) => handleTargetWeightChange(e.target.value === "" ? "" : Number(e.target.value))}
                required
                className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold tabular-nums focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Target BMI: <strong className="text-emerald-400">{targetBmi > 0 ? targetBmi : "Pending"}</strong>
              </span>
            </div>
          </div>

          {/* Target Quick Suggestion Chips */}
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkle size={13} weight="fill" className="text-amber-400" />
                <span>Target Presets ({detectedGoal})</span>
              </span>
              {isCustomTarget ? (
                <button
                  type="button"
                  onClick={handleResetToAuto}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 hover:underline underline-offset-2 transition-colors"
                >
                  <ArrowCounterClockwise size={11} weight="bold" />
                  <span>Reset to auto</span>
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-medium">✨ Auto-updating</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                disabled={suggestions.idealBmiKg <= 0}
                onClick={() => handleApplyPreset(suggestions.idealBmiKg)}
                className={`px-2 py-1.5 rounded-lg text-left transition-all border ${
                  numTarget === suggestions.idealBmiKg && suggestions.idealBmiKg > 0
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold shadow-sm"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Ideal (22.0)</div>
                <div className="text-xs font-semibold tabular-nums mt-0.5">
                  {suggestions.idealBmiKg > 0 ? `${suggestions.idealBmiKg} kg` : "Needs height"}
                </div>
              </button>

              <button
                type="button"
                disabled={suggestions.upperNormalBmiKg <= 0}
                onClick={() => handleApplyPreset(suggestions.upperNormalBmiKg)}
                className={`px-2 py-1.5 rounded-lg text-left transition-all border ${
                  numTarget === suggestions.upperNormalBmiKg && suggestions.upperNormalBmiKg > 0
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold shadow-sm"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Upper (24.9)</div>
                <div className="text-xs font-semibold tabular-nums mt-0.5">
                  {suggestions.upperNormalBmiKg > 0 ? `${suggestions.upperNormalBmiKg} kg` : "Needs height"}
                </div>
              </button>

              {detectedGoal === "bulking" ? (
                <button
                  type="button"
                  disabled={numStarting <= 0}
                  onClick={() => handleApplyPreset(Math.round(numStarting * 1.05 * 10) / 10)}
                  className={`px-2 py-1.5 rounded-lg text-left transition-all border ${
                    numTarget === Math.round(numStarting * 1.05 * 10) / 10 && numStarting > 0
                      ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-bold shadow-sm"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">+5% Bulk</div>
                  <div className="text-xs font-semibold tabular-nums mt-0.5">
                    {numStarting > 0 ? `${Math.round(numStarting * 1.05 * 10) / 10} kg` : "Needs weight"}
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={suggestions.tenPercentLossKg <= 0}
                  onClick={() => handleApplyPreset(suggestions.tenPercentLossKg)}
                  className={`px-2 py-1.5 rounded-lg text-left transition-all border ${
                    numTarget === suggestions.tenPercentLossKg && suggestions.tenPercentLossKg > 0
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-sm"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">-10% Goal</div>
                  <div className="text-xs font-semibold tabular-nums mt-0.5">
                    {suggestions.tenPercentLossKg > 0 ? `${suggestions.tenPercentLossKg} kg` : "Needs weight"}
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Strategy / Note */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Goals / Notes</label>
            <input
              type="text"
              placeholder="e.g. Running 3x a week, gym focus, diet plan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} weight="bold" />
              <span>{memberToEdit ? "Save Changes" : "Add to Elemen 2"}</span>
            </button>

            {memberToEdit && (
              <>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash size={14} />
                    <span>Delete Member</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
                    <p className="text-xs text-rose-200 mb-2">Are you sure? This deletes member and all their logs.</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
