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
    <div className="min-h-[100dvh] w-full flex flex-col justify-between p-4 py-8 bg-[#0B0F17] text-slate-100 relative overflow-hidden font-mono">
      {/* Subtle athletic background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-volt-500/[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-12 -left-20 w-72 h-72 bg-cobalt-500/[0.04] blur-[120px] rounded-full" />
      </div>

      {/* Top Branding */}
      <div className="relative z-10 flex flex-col items-center text-center mt-2">
        <div className="relative w-14 h-14 rounded-2xl bg-carbon-850 border border-white/[0.12] flex items-center justify-center text-white shadow-plate mb-3">
          <span className="font-extrabold text-base tracking-widest text-volt-500">EL2</span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-volt-500 ring-2 ring-carbon-950 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-white tracking-tight font-sans">
            ELEMEN 2
          </h1>
          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-volt-500/15 text-volt-400 border border-volt-500/30">
            SQUAD GATE
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[260px] font-sans">
          Private athletic biometrics & weight progression for close members.
        </p>
      </div>

      {/* Middle Card: Password Input Gate */}
      <div className="relative z-10 w-full max-w-sm mx-auto my-auto py-4">
        <div className="plate-card p-6 space-y-5">
          {/* Gate Icon & Title */}
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className="w-11 h-11 rounded-xl bg-volt-500/10 border border-volt-500/25 text-volt-400 flex items-center justify-center mb-1">
              <LockKey size={22} weight="duotone" />
            </div>
            <h2 className="text-base font-extrabold text-white tracking-tight font-sans">
              Enter Squad Passkey
            </h2>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[280px] font-sans">
              Enter cohort credentials to unlock real-time roster telemetry.
            </p>
          </div>

          {/* Password Changed Notification Banner */}
          {pwChangedNotice && (
            <div className="p-3 rounded-xl bg-volt-500/10 border border-volt-500/25 flex items-start gap-2.5 text-xs text-volt-200">
              <Info size={18} className="text-volt-400 shrink-0 mt-0.5" weight="fill" />
              <p className="leading-snug font-sans">
                The cohort passkey was updated by an admin. Please authenticate with the new credentials.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Cohort Passkey
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter passkey..."
                  autoFocus
                  autoComplete="current-password"
                  className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-carbon-950 border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-volt-400 focus:ring-1 focus:ring-volt-400 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 transition-colors"
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2 text-xs text-rose-300 animate-shake">
                <ShieldWarning size={16} className="text-rose-400 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full h-12 rounded-xl bg-volt-500 hover:bg-volt-400 active:scale-[0.98] text-carbon-950 font-black text-xs shadow-volt-glow disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 font-mono"
            >
              <span>ACCESS TELEMETRY</span>
              <ArrowRight size={16} weight="bold" />
            </button>
          </form>

          <div className="pt-1 text-center">
            <span className="text-[10px] text-slate-500">
              Default password: <span className="font-mono text-slate-400">elemen2</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer Security Notice */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-1 font-mono">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <ShieldCheck size={15} className="text-emerald-400" weight="fill" />
          <span>Encrypted Cohort Sandbox</span>
        </div>
        <p className="text-[10px] text-slate-500 max-w-[260px] font-sans">
          Persisted locally on your hardware until updated by an administrator.
        </p>
      </div>
    </div>
  );
}
