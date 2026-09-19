"use client";

import React from "react";
import { getBmiCategoryDetails } from "@/lib/biometrics";

interface BMIScaleGaugeProps {
  bmi: number;
  showLabels?: boolean;
}

export function BMIScaleGauge({ bmi, showLabels = true }: BMIScaleGaugeProps) {
  if (bmi <= 0) {
    return (
      <div className="w-full p-4 rounded-xl bg-carbon-900 border border-white/[0.08] text-center space-y-1.5 font-mono">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-slate-500" />
          <span>BMI Caliper: Height Metric Required</span>
        </div>
        <p className="text-[10px] text-slate-400">
          Record height in maintainer settings to calibrate member&apos;s physical WHO health spectrum.
        </p>
      </div>
    );
  }

  const details = getBmiCategoryDetails(bmi);

  // Map BMI value to 0-100% position on the gauge
  // Scale from BMI 15 to 38
  const minScale = 15;
  const maxScale = 38;
  const clampedBmi = Math.min(Math.max(bmi, minScale), maxScale);
  const positionPercent = Math.round(((clampedBmi - minScale) / (maxScale - minScale)) * 100);

  return (
    <div className="w-full space-y-2 font-mono">
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium text-[11px] uppercase">WHO Index:</span>
            <span className="font-black text-white text-base tabular-nums">{bmi.toFixed(1)}</span>
          </div>
          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${details.badgeBg} ${details.badgeText}`}>
            {details.category}
          </span>
        </div>
      )}

      {/* Precision Caliper Track with Indicator */}
      <div className="relative pt-4 pb-2">
        {/* Floating Indicator Needle */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out z-10"
          style={{ left: `${positionPercent}%` }}
        >
          <div
            className="w-3.5 h-3.5 rotate-45 border-2 border-carbon-950 shadow-md ring-1 ring-white/50"
            style={{ backgroundColor: details.color }}
          />
        </div>

        {/* Continuous Calibrated Spectrum Bar */}
        <div className="h-3 w-full rounded-md overflow-hidden flex shadow-plate-inset border border-white/[0.08] bg-carbon-950 p-0.5">
          {/* Underweight: 15 to 18.5 (~15.2%) */}
          <div className="h-full bg-sky-500/80 rounded-l-sm" style={{ width: "15.2%" }} title="Underweight (< 18.5)" />
          {/* Normal: 18.5 to 25.0 (~28.3%) */}
          <div className="h-full bg-emerald-500/90" style={{ width: "28.3%" }} title="Normal (18.5 - 24.9)" />
          {/* Overweight: 25.0 to 30.0 (~21.7%) */}
          <div className="h-full bg-amber-500/90" style={{ width: "21.7%" }} title="Overweight (25.0 - 29.9)" />
          {/* Obese: 30.0 to 38.0 (~34.8%) */}
          <div className="h-full bg-gradient-to-r from-orange-500/90 to-rose-600/90 flex-1 rounded-r-sm" title="Obese (≥ 30.0)" />
        </div>

        {/* Precision Scale Caliper Ticks */}
        <div className="relative text-[9px] text-slate-400 mt-1 font-mono">
          <span className="absolute left-0">15</span>
          <span className="absolute" style={{ left: "15.2%", transform: "translateX(-50%)" }}>
            18.5
          </span>
          <span className="absolute font-bold text-emerald-400" style={{ left: "43.5%", transform: "translateX(-50%)" }}>
            25.0
          </span>
          <span className="absolute" style={{ left: "65.2%", transform: "translateX(-50%)" }}>
            30.0
          </span>
          <span className="absolute right-0">38+</span>
        </div>
      </div>
    </div>
  );
}
