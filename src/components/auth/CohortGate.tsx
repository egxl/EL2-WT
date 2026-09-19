"use client";

import React, { useState, useEffect } from "react";
import {
  LockKey,
  ShieldCheck,
  ShieldWarning,
  Eye,
  EyeSlash,
  Barbell,
  ArrowRight,
  Info,
} from "@phosphor-icons/react";
import {
  isCohortAuthenticated,
  verifyAndUnlockCohort,
  subscribeToCohortAuth,
  wasPasswordRecentlyChanged,
  clearPasswordChangedFlag,
  syncServerCohortAuth,
} from "@/lib/cohort-auth";

interface CohortGateProps {
  children: React.ReactNode;
}

export function CohortGate({ children }: CohortGateProps) {
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pwChangedNotice, setPwChangedNotice] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authStatus = isCohortAuthenticated();
    setAuthenticated(authStatus);

    if (!authStatus && wasPasswordRecentlyChanged()) {
      setPwChangedNotice(true);
    }

    // Check server synchronization in case password was changed in production env
    syncServerCohortAuth();

    const unsub = subscribeToCohortAuth((isAuth) => {
      setAuthenticated(isAuth);
      if (!isAuth && wasPasswordRecentlyChanged()) {
        setPwChangedNotice(true);
      }
    });

    return () => unsub();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the cohort password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = verifyAndUnlockCohort(password);
    if (result.success) {
      setAuthenticated(true);
      setPassword("");
      setError(null);
      setPwChangedNotice(false);
      clearPasswordChangedFlag();
    } else {
      setError(result.error || "Incorrect cohort password.");
    }
    setIsSubmitting(false);
  };

  // Prevent flash of unauthenticated content during client hydration
  if (!mounted) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#07090E] p-4">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Barbell size={24} weight="fill" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Elemen 2
          </span>
        </div>
      </div>
    );
  }

  // If user is authenticated, render application content
  if (authenticated) {
    return <>{children}</>;
  }

  // Otherwise, render the Cohort Access Gate
  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between p-4 py-8 bg-[#07090E] text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-12 -left-20 w-72 h-72 bg-emerald-500/8 blur-[120px] rounded-full" />
      </div>

      {/* Top Branding */}
      <div className="relative z-10 flex flex-col items-center text-center mt-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/25 mb-3.5">
          <Barbell size={28} weight="fill" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Elemen 2
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Cohort Gate
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
          Private weight, biometric & progress tracking for close group members.
        </p>
      </div>

      {/* Middle Card: Password Input Gate */}
      <div className="relative z-10 w-full max-w-sm mx-auto my-auto py-6">
        <div className="bezel-outer">
          <div className="bezel-inner p-6 space-y-5">
            {/* Gate Icon & Title */}
            <div className="flex flex-col items-center text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
                <LockKey size={26} weight="duotone" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Enter Cohort Password
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-[280px]">
                Enter our group password to view member records and progress.
              </p>
            </div>

            {/* Password Changed Notification Banner */}
            {pwChangedNotice && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200">
                <Info size={18} className="text-amber-400 shrink-0 mt-0.5" weight="fill" />
                <p className="leading-snug">
                  The cohort password was recently changed by an admin. Please enter the new password to unlock.
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Cohort Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter password..."
                    autoFocus
                    autoComplete="current-password"
                    className="w-full h-12 pl-3.5 pr-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 transition-colors"
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs text-rose-300 animate-shake">
                  <ShieldWarning size={17} className="text-rose-400 shrink-0" weight="fill" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !password.trim()}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Cohort Tracker</span>
                <ArrowRight size={17} weight="bold" />
              </button>
            </form>

            <div className="pt-1 text-center">
              <span className="text-[11px] text-slate-500">
                Default password is <span className="font-mono text-slate-400">elemen2</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Security Notice */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-1">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <ShieldCheck size={16} className="text-emerald-400" weight="fill" />
          <span>Protected Cohort Environment</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-[260px]">
          Access stays unlocked on your device until the password is changed by an admin.
        </p>
      </div>
    </div>
  );
}
