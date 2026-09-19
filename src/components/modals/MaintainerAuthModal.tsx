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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity font-mono">
      <div 
        className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-carbon-900 border border-white/[0.1] p-5 shadow-2xl shadow-black relative animate-in fade-in slide-in-from-bottom-6 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-carbon-850 hover:bg-carbon-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/[0.06]"
        >
          <X size={15} weight="bold" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="w-11 h-11 rounded-xl bg-volt-500/10 border border-volt-500/25 text-volt-400 flex items-center justify-center mb-3">
            <LockKey size={22} weight="duotone" />
          </div>
          <h3 className="text-base font-extrabold text-white tracking-tight font-sans">Maintainer Passkey</h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[260px] font-sans">
            Enter PIN to {actionDescription}.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className={`flex justify-center items-center gap-3 my-4 py-2 ${error ? "animate-shake" : ""}`}>
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? "bg-volt-500 scale-110 shadow-volt-glow"
                  : error
                  ? "border-2 border-rose-500 bg-rose-500/20"
                  : "border-2 border-carbon-700 bg-carbon-950"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium mb-3">
            <ShieldWarning size={14} weight="fill" />
            <span>Incorrect PIN. Try again.</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto my-2 font-mono">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-xl bg-carbon-850 hover:bg-carbon-800 active:bg-volt-500/20 active:scale-95 border border-white/[0.06] text-lg font-bold text-white transition-all flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-xl bg-carbon-850 hover:bg-carbon-800 active:scale-95 text-xs font-medium text-slate-400 transition-all flex items-center justify-center border border-white/[0.04]"
          >
            CLR
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-12 rounded-xl bg-carbon-850 hover:bg-carbon-800 active:bg-volt-500/20 active:scale-95 border border-white/[0.06] text-lg font-bold text-white transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-xl bg-carbon-850 hover:bg-carbon-800 active:scale-95 text-slate-400 transition-all flex items-center justify-center border border-white/[0.04]"
          >
            <Backspace size={18} />
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            onClick={() => handleSubmit()}
            disabled={pin.length === 0}
            className="w-full py-3.5 rounded-xl bg-volt-500 hover:bg-volt-400 text-carbon-950 font-black text-xs shadow-volt-glow disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-mono"
          >
            <CheckCircle size={18} weight="bold" />
            <span>AUTHENTICATE</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-3 font-mono">
          Default PIN: <span className="text-volt-400 font-bold">1234</span>
        </p>
      </div>
    </div>
  );
}
