"use client";

import React, { useState } from "react";
import { LockKey, X, Backspace, CheckCircle, ShieldWarning } from "@phosphor-icons/react";
import { unlockMaintainer } from "@/lib/auth";

interface MaintainerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionDescription?: string;
}

export function MaintainerAuthModal({
  isOpen,
  onClose,
  onSuccess,
  actionDescription = "input or edit data",
}: MaintainerAuthModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (pin.length < 8) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin("");
    setError(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) return;

    const ok = unlockMaintainer(pin);
    if (ok) {
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div 
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#0D1117] border border-white/10 p-5 shadow-2xl shadow-black relative animate-in fade-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X size={16} weight="bold" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
            <LockKey size={24} weight="duotone" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Maintainer PIN Required</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-[260px]">
            Please enter maintainer PIN to {actionDescription}.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className={`flex justify-center items-center gap-3 my-4 py-2 ${error ? "animate-shake" : ""}`}>
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? "bg-amber-400 scale-110 shadow-sm shadow-amber-400"
                  : error
                  ? "border-2 border-rose-500 bg-rose-500/20"
                  : "border-2 border-slate-700 bg-slate-800"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium mb-3">
            <ShieldWarning size={15} weight="fill" />
            <span>Incorrect PIN. Try again.</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto my-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:bg-amber-500/20 active:scale-95 border border-white/5 text-lg font-semibold text-white transition-all flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-medium text-slate-400 transition-all flex items-center justify-center"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:bg-amber-500/20 active:scale-95 border border-white/5 text-lg font-semibold text-white transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-400 transition-all flex items-center justify-center"
          >
            <Backspace size={20} />
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            onClick={() => handleSubmit()}
            disabled={pin.length === 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} weight="bold" />
            <span>Unlock Access</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-3">
          Default PIN is <span className="text-amber-400/80 font-mono">1234</span> (configurable in Settings)
        </p>
      </div>
    </div>
  );
}
