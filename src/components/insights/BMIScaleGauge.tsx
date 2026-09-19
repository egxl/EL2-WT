"use client";

import React from "react";
import { getBmiCategoryDetails } from "@/lib/biometrics";

interface BMIScaleGaugeProps {
  bmi: number;
  showLabels?: boolean;
}

export function BMIScaleGauge({ bmi, showLabels = true }: BMIScaleGaugeProps) {
  const details = getBmiCategoryDetails(bmi);

  // Map BMI value to 0-100% position on the gauge
  // Scale from BMI 15 to 40
  const minScale = 15;
  const maxScale = 38;
  const clampedBmi = Math.min(Math.max(bmi, minScale), maxScale);
  const positionPercent = Math.round(((clampedBmi - minScale) / (maxScale - minScale)) * 100);

  // Markers positions on the same scale:
  // 18.5: ((18.5 - 15) / 23) * 100 = 15.2%
  // 25.0: ((25.0 - 15) / 23) * 100 = 43.5%
  // 30.0: ((30.0 - 15) / 23) * 100 = 65.2%

  return (
    <div className="w-full space-y-2">
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">BMI Index:</span>
            <span className="font-extrabold text-white text-sm tabular-nums">{bmi.toFixed(1)}</span>
          </div>
          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${details.badgeBg} ${details.badgeText}`}>
            {details.category}
          </span>
        </div>
      )}

      {/* Horizontal Spectrum Bar with Indicator */}
      <div className="relative pt-4 pb-2">
        {/* Floating Indicator Needle */}
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500 ease-out"
          style={{ left: `${positionPercent}%` }}
        >
          <div
            className="w-3.5 h-3.5 rotate-45 border-2 border-white shadow-md shadow-black"
            style={{ backgroundColor: details.color }}
          />
        </div>

        {/* Continuous Gradient Bar */}
        <div className="h-3 w-full rounded-full overflow-hidden flex shadow-inner shadow-black/60 border border-white/10 bg-slate-900">
          {/* Underweight: 15 to 18.5 (~15%) */}
          <div className="h-full bg-sky-500/80" style={{ width: "15.2%" }} title="Underweight (< 18.5)" />
          {/* Normal: 18.5 to 25.0 (~28.3%) */}
          <div className="h-full bg-emerald-500/90" style={{ width: "28.3%" }} title="Normal (18.5 - 24.9)" />
          {/* Overweight: 25.0 to 30.0 (~21.7%) */}
          <div className="h-full bg-amber-500/90" style={{ width: "21.7%" }} title="Overweight (25.0 - 29.9)" />
          {/* Obese: 30.0 to 38.0 (~34.8%) */}
          <div className="h-full bg-gradient-to-r from-orange-500/90 to-rose-600/90 flex-1" title="Obese (≥ 30.0)" />
        </div>

        {/* Ticks and scale labels */}
        <div className="relative text-[10px] text-slate-400 mt-1 font-mono">
          <span className="absolute left-0">15</span>
          <span className="absolute" style={{ left: "15.2%", transform: "translateX(-50%)" }}>
            18.5
          </span>
          <span className="absolute" style={{ left: "43.5%", transform: "translateX(-50%)" }}>
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
