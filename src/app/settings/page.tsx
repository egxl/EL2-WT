"use client";

import React, { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { FluidBottomNav } from "@/components/layout/FluidBottomNav";
import { MaintainerAuthModal } from "@/components/modals/MaintainerAuthModal";
import { isMaintainerUnlocked, lockMaintainer, updateMaintainerPin, subscribeToAuthChanges, getMaintainerPin } from "@/lib/auth";
import { updateCohortPassword, lockCohort, getCohortPassword } from "@/lib/cohort-auth";
import { getUnitPreference, setUnitPreference, exportData, importData, importDataAsync, resetToDemoData, subscribeToStorage } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import { pullFromCloud, pushLocalToCloud } from "@/lib/supabase-sync";
import { UnitPreference } from "@/types";
import { Gear, LockSimple, LockSimpleOpen, DownloadSimple, UploadSimple, ArrowsCounterClockwise, Key, DeviceMobileCamera, CheckCircle, Warning, ShieldCheck, ShieldWarning, CloudCheck, CloudWarning, CloudArrowUp, CloudArrowDown } from "@phosphor-icons/react";

export default function SettingsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [unit, setUnit] = useState<UnitPreference>("kg");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Cloud sync state
  const [isCloudActive, setIsCloudActive] = useState(false);
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // Change PIN state
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [newPinInput, setNewPinInput] = useState("");
  const [pinChangeStatus, setPinChangeStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Change Cohort Password state
  const [newCohortPw, setNewCohortPw] = useState("");
  const [confirmCohortPw, setConfirmCohortPw] = useState("");
  const [cohortPwStatus, setCohortPwStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Data import state
  const [importJsonText, setImportJsonText] = useState("");
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [showImportBox, setShowImportBox] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    setUnlocked(isMaintainerUnlocked());
    setUnit(getUnitPreference());
    setIsCloudActive(isSupabaseConfigured());

    const unsubAuth = subscribeToAuthChanges((s) => setUnlocked(s));
    const unsubStorage = subscribeToStorage(() => {
      setUnit(getUnitPreference());
      setIsCloudActive(isSupabaseConfigured());
    });

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

  const handleChangeCohortPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCohortPw || newCohortPw.trim().length < 3) {
      setCohortPwStatus({ success: false, message: "Password must be at least 3 characters" });
      return;
    }
    if (newCohortPw.trim() !== confirmCohortPw.trim()) {
      setCohortPwStatus({ success: false, message: "Passwords do not match" });
      return;
    }
    const res = updateCohortPassword(newCohortPw.trim());
    if (res.success) {
      setCohortPwStatus({
        success: true,
        message: "Cohort password updated! All other devices will now require this new password to access.",
      });
      setNewCohortPw("");
      setConfirmCohortPw("");
    } else {
      setCohortPwStatus({ success: false, message: res.error || "Failed to update password" });
    }
  };

  const handleLockCohortSession = () => {
    lockCohort();
  };

  const handlePullFromCloud = async () => {
    setCloudSyncing(true);
    setCloudSyncStatus(null);
    try {
      const res = await pullFromCloud();
      if (res.success) {
        setCloudSyncStatus({
          success: true,
          message: `Pulled latest data from Supabase! (${res.memberCount} members, ${res.logCount} logs)`,
        });
      } else {
        setCloudSyncStatus({
          success: false,
          message: res.error || "Failed to fetch from Supabase",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sync";
      setCloudSyncStatus({ success: false, message });
    } finally {
      setCloudSyncing(false);
    }
  };

  const handlePushToCloud = async () => {
    setCloudSyncing(true);
    setCloudSyncStatus(null);
    try {
      const res = await pushLocalToCloud();
      if (res.success) {
        setCloudSyncStatus({
          success: true,
          message: `Uploaded local roster to Supabase! (${res.memberCount} members, ${res.logCount} logs)`,
        });
      } else {
        setCloudSyncStatus({
          success: false,
          message: res.error || "Failed to upload to Supabase",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload";
      setCloudSyncStatus({ success: false, message });
    } finally {
      setCloudSyncing(false);
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

  const handleImport = async () => {
    if (!importJsonText.trim()) return;
    setImportStatus({ message: "Importing and synchronizing data..." });
    const res = await importDataAsync(importJsonText);
    if (res.success) {
      const detail = res.cloudSynced
        ? `Restored ${res.memberCount} members & ${res.logCount} logs to local storage AND synced to Supabase Cloud!`
        : `Restored ${res.memberCount} members & ${res.logCount} logs to local storage. (Supabase cloud credentials not set)`;
      setImportStatus({ success: true, message: detail });
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
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
        setImportStatus({ message: `Importing ${file.name}...` });
        const res = await importDataAsync(content);
        if (res.success) {
          const detail = res.cloudSynced
            ? `Restored from ${file.name} to local storage AND synced to Supabase Cloud! (${res.memberCount} members, ${res.logCount} logs)`
            : `Restored from ${file.name} to local storage. (${res.memberCount} members, ${res.logCount} logs; cloud credentials not set)`;
          setImportStatus({ success: true, message: detail });
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

        {/* Global Cohort Access Password Card (when unlocked) */}
        {unlocked && (
          <div className="bezel-outer">
            <div className="bezel-inner p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-amber-400" weight="fill" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Global Cohort Access Password
                  </h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Gate Active
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                This is the global password all members must enter to view this site. Changing it will immediately invalidate existing sessions on all other devices, keeping out unauthorized visitors.
              </p>

              <form onSubmit={handleChangeCohortPassword} className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Min 3 chars"
                      value={newCohortPw}
                      onChange={(e) => setNewCohortPw(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Confirm</label>
                    <input
                      type="password"
                      placeholder="Confirm"
                      value={confirmCohortPw}
                      onChange={(e) => setConfirmCohortPw(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {cohortPwStatus && (
                  <p
                    className={`text-xs font-medium ${
                      cohortPwStatus.success ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {cohortPwStatus.message}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!newCohortPw.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all shadow-md shadow-amber-500/20"
                  >
                    Update Cohort Password
                  </button>
                  <button
                    type="button"
                    onClick={handleLockCohortSession}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs transition-all"
                    title="Lock your cohort session now to test the gate"
                  >
                    Lock Gate
                  </button>
                </div>
              </form>

              <div className="pt-2 border-t border-white/5 text-[11px] text-slate-500 space-y-1">
                <p>
                  💡 <strong>Production Note</strong>: For multi-device deployments on Vercel, set <code className="text-amber-400/90 font-mono">NEXT_PUBLIC_COHORT_PASSWORD</code> in your Vercel Project Settings. Redeploying or changing it there instantly invalidates all members' sessions across all phones.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cohort Privacy Gate Quick Control (Always visible) */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" weight="fill" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Cohort Privacy Gate
              </span>
            </div>
            <button
              onClick={handleLockCohortSession}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-xs font-semibold text-slate-200 transition-all"
            >
              Lock Site
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Site is currently unlocked. Tap <strong>Lock Site</strong> anytime to immediately return to the Cohort Password Gate.
          </p>
        </div>

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

        {/* Cloud Database (Supabase) Card */}
        <div className="bezel-outer">
          <div className="bezel-inner p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCloudActive ? (
                  <CloudCheck size={18} className="text-emerald-400" weight="fill" />
                ) : (
                  <CloudWarning size={18} className="text-amber-400" weight="fill" />
                )}
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Cloud Database (Supabase)
                </h3>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  isCloudActive
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                }`}
              >
                {isCloudActive ? "Realtime Active" : "Local Storage Only"}
              </span>
            </div>

            {isCloudActive ? (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Connected to Supabase. Weigh-ins and roster modifications automatically sync across all cohort members&apos; devices in real time.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePullFromCloud}
                    disabled={cloudSyncing}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all disabled:opacity-50"
                  >
                    <CloudArrowDown size={16} />
                    <span>{cloudSyncing ? "Syncing..." : "Pull Cloud"}</span>
                  </button>
                  <button
                    onClick={handlePushToCloud}
                    disabled={cloudSyncing}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all disabled:opacity-50"
                  >
                    <CloudArrowUp size={16} />
                    <span>{cloudSyncing ? "Syncing..." : "Push Local"}</span>
                  </button>
                </div>

                {cloudSyncStatus && (
                  <p
                    className={`text-xs font-medium ${
                      cloudSyncStatus.success ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {cloudSyncStatus.message}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your data is currently stored in this browser&apos;s local memory. To sync live across all group members&apos; phones:
                </p>
                <ol className="text-[11px] text-slate-400 space-y-1 list-decimal list-inside pl-1">
                  <li>Create a free project at <span className="text-amber-400 font-medium">supabase.com</span>.</li>
                  <li>Run <code className="text-amber-300 font-mono">supabase/schema.sql</code> in the Supabase SQL Editor.</li>
                  <li>Add <code className="text-amber-300 font-mono">NEXT_PUBLIC_SUPABASE_URL</code> &amp; <code className="text-amber-300 font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment variables (or Vercel).</li>
                </ol>

                <button
                  type="button"
                  onClick={() => setShowSqlGuide(!showSqlGuide)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold pt-1 block underline underline-offset-2"
                >
                  {showSqlGuide ? "Hide Setup Instructions" : "View Supabase Quick Setup Steps"}
                </button>

                {showSqlGuide && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-[11px] text-slate-300 animate-in fade-in">
                    <p className="font-semibold text-white">How to connect Supabase in 2 minutes:</p>
                    <p>1. Open your project on <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-amber-400 underline">supabase.com</a> $\rightarrow$ <strong>SQL Editor</strong> $\rightarrow$ <strong>New query</strong>.</p>
                    <p>2. Copy the SQL from file <code className="text-amber-300 font-mono">supabase/schema.sql</code> and click <strong>Run</strong>.</p>
                    <p>3. Go to <strong>Project Settings</strong> $\rightarrow$ <strong>API</strong>, copy your <strong>Project URL</strong> and <strong>anon public key</strong>.</p>
                    <p>4. Put them into <code className="text-amber-300 font-mono">.env.local</code> locally or Vercel Environment Variables in production!</p>
                  </div>
                )}
              </div>
            )}
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
