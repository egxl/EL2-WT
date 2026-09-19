"use client";

import React, { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { FluidBottomNav } from "@/components/layout/FluidBottomNav";
import { MaintainerAuthModal } from "@/components/modals/MaintainerAuthModal";
import { isMaintainerUnlocked, lockMaintainer, updateMaintainerPin, subscribeToAuthChanges, getMaintainerPin } from "@/lib/auth";
import { getUnitPreference, setUnitPreference, exportData, importData, resetToDemoData, subscribeToStorage } from "@/lib/storage";
import { UnitPreference } from "@/types";
import { Gear, LockSimple, LockSimpleOpen, DownloadSimple, UploadSimple, ArrowsCounterClockwise, Key, DeviceMobileCamera, CheckCircle, Warning } from "@phosphor-icons/react";

export default function SettingsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Change PIN state
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [pinChangeStatus, setPinChangeStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Data import state
  const [importJsonText, setImportJsonText] = useState("");
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showImportBox, setShowImportBox] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    setUnlocked(isMaintainerUnlocked());
    setUnit(getUnitPreference());

    const unsubAuth = subscribeToAuthChanges((s) => setUnlocked(s));
    const unsubStorage = subscribeToStorage(() => setUnit(getUnitPreference()));

    return () => {
      unsubAuth();
      unsubStorage();
    };
  }, []);

  const handleUnitChange = (nextUnit: UnitPreference) => {
    setUnit(nextUnit);
    setUnitPreference(nextUnit);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateMaintainerPin(currentPinInput, newPinInput);
    if (result.success) {
      setPinChangeStatus({ success: true, message: "PIN updated successfully!" });
      setCurrentPinInput("");
      setNewPinInput("");
    } else {
      setPinChangeStatus({ success: false, message: result.error || "Failed to update PIN" });
    }
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elemen2-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const res = importData(importJsonText);
    if (res.success) {
      setImportStatus({ success: true, message: "Data restored successfully!" });
      setImportJsonText("");
      setShowImportBox(false);
    } else {
      setImportStatus({ success: false, message: res.error || "Invalid JSON" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
        const res = importData(content);
        if (res.success) {
          setImportStatus({ success: true, message: `Data restored successfully from ${file.name}!` });
          setShowImportBox(false);
        } else {
          setImportStatus({ success: false, message: res.error || "Invalid JSON in file" });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetToDemoData();
    setResetConfirm(false);
  };

  return (
    <main className="flex-1 flex flex-col pb-28">
      <TopBar />

      <div className="px-4 py-4 space-y-5">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Gear size={22} className="text-amber-400" weight="fill" />
            <span>App Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintainer access, units, backups, and PWA setup
          </p>
        </div>

        {/* Maintainer Access Card */}
        <div className="bezel-outer">
          <div className="bezel-inner p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    unlocked
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/5 text-slate-400 border border-white/10"
                  }`}
                >
                  {unlocked ? <LockSimpleOpen size={20} weight="bold" /> : <LockSimple size={20} weight="bold" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Maintainer Mode</h2>
                  <p className="text-xs text-slate-400">
                    {unlocked ? "Unlocked (Can log & edit)" : "Locked (Read-only mode)"}
                  </p>
                </div>
              </div>

              {unlocked ? (
                <button
                  onClick={() => lockMaintainer()}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-all"
                >
                  Lock Now
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all"
                >
                  Enter PIN
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-white/5 pt-2">
              Group members can view all statistics, charts, and leaderboards freely without accounts. Logging weigh-ins or editing heights requires the Maintainer PIN.
            </p>
          </div>
        </div>

        {/* Change Maintainer PIN (when unlocked) */}
        {unlocked && (
          <div className="bezel-outer">
            <div className="bezel-inner p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Key size={18} className="text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Change Maintainer PIN
                </h3>
              </div>

              <form onSubmit={handleChangePin} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Current PIN</label>
                    <input
                      type="password"
                      placeholder="Current"
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">New PIN</label>
                    <input
                      type="password"
                      placeholder="Min 4 digits"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {pinChangeStatus && (
                  <p
                    className={`text-xs font-medium ${
                      pinChangeStatus.success ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {pinChangeStatus.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all"
                >
                  Update PIN
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Measurement Unit */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            Preferred Weight Unit
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleUnitChange("kg")}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                unit === "kg"
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Metric (kg & cm)
            </button>
            <button
              onClick={() => handleUnitChange("lbs")}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                unit === "lbs"
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-sm"
                  : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              Imperial (lbs)
            </button>
          </div>
        </div>

        {/* Backup & Restore */}
        <div className="bezel-outer">
          <div className="bezel-inner p-4 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Data Backup & Storage
            </span>
            <p className="text-[11px] text-slate-400">
              Download a complete JSON snapshot of all Elemen 2 members and logs for safe keeping, or restore previous backups.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all"
              >
                <DownloadSimple size={15} />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => setShowImportBox(!showImportBox)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all"
              >
                <UploadSimple size={15} />
                <span>Restore JSON</span>
              </button>
            </div>

            {showImportBox && (
              <div className="space-y-3 pt-2 border-t border-white/5 animate-in fade-in">
                {/* File picker option */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-all">
                    <UploadSimple size={15} />
                    <span>Upload JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">or paste JSON below</span>
                </div>

                <textarea
                  rows={4}
                  placeholder="Paste backup JSON content here..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
                {importStatus && (
                  <p
                    className={`text-xs font-medium ${
                      importStatus.success ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {importStatus.message}
                  </p>
                )}
                <button
                  onClick={handleImport}
                  className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Apply Backup
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <span className="text-xs font-bold text-slate-300 block">Reset Roster</span>
          {!resetConfirm ? (
            <button
              onClick={() => setResetConfirm(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300"
            >
              <ArrowsCounterClockwise size={14} />
              <span>Reset to Elemen 2 default seed members</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs">
              <p className="text-rose-200 mb-2">Reset back to original seed data? Current custom logs will be overwritten.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="px-3 py-1 rounded-lg bg-white/10 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile PWA Install Guide */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <DeviceMobileCamera size={18} weight="bold" />
            <h2 className="text-xs font-bold uppercase tracking-wider">Install on Mobile (PWA)</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Get the full-screen native app feel on your phone:
          </p>
          <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
            <li><strong>iOS Safari</strong>: Tap Share icon (<span className="text-white">↑</span>) → <em>"Add to Home Screen"</em>.</li>
            <li><strong>Android Chrome</strong>: Tap 3 dots (<span className="text-white">⋮</span>) → <em>"Install App"</em> or <em>"Add to Home screen"</em>.</li>
          </ul>
        </div>
      </div>

      <FluidBottomNav />

      {/* Maintainer PIN Modal */}
      {showAuthModal && (
        <MaintainerAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
          actionDescription="access maintainer settings"
        />
      )}
    </main>
  );
}
