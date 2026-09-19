"use client";

import React, { useState } from "react";
import { WeightLog, UnitPreference } from "@/types";
import { calculateBmi, formatWeight, kgToLbs } from "@/lib/biometrics";

interface InteractiveWeightChartProps {
  logs: WeightLog[];
  heightCm: number;
  targetWeightKg: number;
  unit: UnitPreference;
}

export function InteractiveWeightChart({
  logs,
  heightCm,
  targetWeightKg,
  unit,
}: InteractiveWeightChartProps) {
  const [activePoint, setActivePoint] = useState<{
    index: number;
    log: WeightLog;
    x: number;
    y: number;
  } | null>(null);

  if (!logs || logs.length === 0) {
    return (
      <div className="h-44 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 text-xs">
        No weigh-in logs recorded yet
      </div>
    );
  }

  // Sort chronologically
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Compute 7-day moving average series
  const movingAvgSeries = sortedLogs.map((log, idx) => {
    const currentMs = new Date(log.date).getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const window = sortedLogs
      .slice(0, idx + 1)
      .filter((l) => currentMs - new Date(l.date).getTime() <= sevenDaysMs);
    const sum = window.reduce((acc, curr) => acc + curr.weightKg, 0);
    return Math.round((sum / window.length) * 10) / 10;
  });

  // Calculate scales
  const allWeights = [
    ...sortedLogs.map((l) => l.weightKg),
    ...movingAvgSeries,
    targetWeightKg,
  ];

  const minWeight = Math.floor(Math.min(...allWeights) - 1.5);
  const maxWeight = Math.ceil(Math.max(...allWeights) + 1.5);
  const weightRange = maxWeight - minWeight || 1;

  const width = 360;
  const height = 180;
  const paddingLeft = 32;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 28;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (sortedLogs.length === 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + (index / (sortedLogs.length - 1)) * plotWidth;
  };

  const getY = (valKg: number) => {
    return paddingTop + plotHeight - ((valKg - minWeight) / weightRange) * plotHeight;
  };

  // Generate path data for raw weigh-ins
  const rawPathD = sortedLogs
    .map((log, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(log.weightKg)}`)
    .join(" ");

  // Generate path data for 7-day moving average
  const smoothedPathD = movingAvgSeries
    .map((avg, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(avg)}`)
    .join(" ");

  // Target line Y
  const targetY = getY(targetWeightKg);

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Weigh-in</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400" />
            <span>7d Moving Avg</span>
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="w-3 border-t border-dashed border-emerald-400" />
          <span>Target ({formatWeight(targetWeightKg, unit)})</span>
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible touch-none"
      >
        {/* Horizontal grid lines */}
        {[0, 0.5, 1].map((pct, idx) => {
          const tickVal = minWeight + weightRange * pct;
          const tickY = paddingTop + plotHeight - pct * plotHeight;
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={tickY}
                x2={width - paddingRight}
                y2={tickY}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="2 2"
              />
              <text
                x={paddingLeft - 4}
                y={tickY + 3}
                fill="#94A3B8"
                fontSize="9"
                textAnchor="end"
                className="font-mono"
              >
                {unit === "lbs" ? kgToLbs(tickVal).toFixed(0) : tickVal.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Target weight line */}
        {targetY >= paddingTop && targetY <= paddingTop + plotHeight && (
          <line
            x1={paddingLeft}
            y1={targetY}
            x2={width - paddingRight}
            y2={targetY}
            stroke="#10B981"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
        )}

        {/* 7-day Moving Average Line (Cyan) */}
        {sortedLogs.length > 1 && (
          <path
            d={smoothedPathD}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          />
        )}

        {/* Raw Log Line (Amber) */}
        <path
          d={rawPathD}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Raw Log Points */}
        {sortedLogs.map((log, idx) => {
          const cx = getX(idx);
          const cy = getY(log.weightKg);
          const isActive = activePoint?.index === idx;

          return (
            <g key={log.id} className="cursor-pointer">
              {/* Invisible large touch target */}
              <circle
                cx={cx}
                cy={cy}
                r="14"
                fill="transparent"
                onClick={() => setActivePoint({ index: idx, log, x: cx, y: cy })}
              />
              <circle
                cx={cx}
                cy={cy}
                r={isActive ? "5" : "3.5"}
                fill={isActive ? "#FFFFFF" : "#F59E0B"}
                stroke="#07090E"
                strokeWidth="2"
                className="transition-all duration-150"
              />
            </g>
          );
        })}

        {/* Date labels on X axis */}
        {sortedLogs.map((log, idx) => {
          // Show label for first, last, and every 2-3 logs to avoid clutter
          const shouldShow =
            idx === 0 ||
            idx === sortedLogs.length - 1 ||
            (sortedLogs.length <= 6 && idx % 2 === 0);

          if (!shouldShow) return null;

          const cx = getX(idx);
          const dateStr = log.date.substring(5); // MM-DD

          return (
            <text
              key={`date-${idx}`}
              x={cx}
              y={height - 8}
              fill="#94A3B8"
              fontSize="9"
              textAnchor="middle"
              className="font-mono"
            >
              {dateStr}
            </text>
          );
        })}
      </svg>

      {/* Active Point Card Popup */}
      {activePoint && (
        <div className="mt-2 p-2.5 rounded-xl bg-[#121824] border border-amber-500/40 shadow-lg flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold tabular-nums">
                {formatWeight(activePoint.log.weightKg, unit)}
              </span>
              <span className="text-slate-400 text-[11px]">on {activePoint.log.date}</span>
            </div>
            {activePoint.log.note && (
              <p className="text-[11px] text-slate-300 italic mt-0.5">"{activePoint.log.note}"</p>
            )}
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-cyan-400 block">
              BMI {calculateBmi(activePoint.log.weightKg, heightCm)}
            </span>
            <button
              onClick={() => setActivePoint(null)}
              className="text-[10px] text-slate-400 hover:text-white mt-0.5"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
