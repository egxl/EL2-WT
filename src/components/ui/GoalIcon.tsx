"use client";

import React from "react";
import { Fire, Barbell, Scales, IconWeight } from "@phosphor-icons/react";
import { GoalType } from "@/types";
import { getGoalTypeDetails } from "@/lib/biometrics";

interface GoalIconProps {
  goalType: GoalType;
  size?: number;
  weight?: IconWeight;
  className?: string;
}

export function GoalIcon({ goalType, size = 14, weight, className = "" }: GoalIconProps) {
  switch (goalType) {
    case "cutting":
      return <Fire size={size} weight={weight || "fill"} className={`shrink-0 ${className}`} />;
    case "bulking":
      return <Barbell size={size} weight={weight || "bold"} className={`shrink-0 ${className}`} />;
    case "maintaining":
      return <Scales size={size} weight={weight || "bold"} className={`shrink-0 ${className}`} />;
    default:
      return <Scales size={size} weight={weight || "bold"} className={`shrink-0 ${className}`} />;
  }
}

interface GoalBadgeProps {
  goalType: GoalType;
  showIcon?: boolean;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function GoalBadge({
  goalType,
  showIcon = true,
  size = "sm",
  className = "",
}: GoalBadgeProps) {
  const details = getGoalTypeDetails(goalType);

  const sizeClasses = {
    xs: "text-[9px] px-1.5 py-0.2 gap-0.5",
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2 py-0.5 gap-1.5",
  }[size];

  const iconSizes = {
    xs: 10,
    sm: 11,
    md: 13,
  }[size];

  return (
    <span
      className={`font-mono font-bold rounded border inline-flex items-center ${details.badgeBg} ${details.badgeText} ${sizeClasses} ${className}`}
    >
      {showIcon && <GoalIcon goalType={goalType} size={iconSizes} />}
      <span>{details.label}</span>
    </span>
  );
}
