import { BMICategory, Member, MemberInsight, WeightLog, CohortSummary } from "@/types";

/**
 * Calculates BMI: weight (kg) / [height (m)]^2
 */
export function calculateBmi(weightKg: number, heightCm: number): number {
  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Categorizes BMI according to WHO standard thresholds
 */
export function getBmiCategory(bmi: number): BMICategory {
  if (!bmi || bmi <= 0) return "Pending";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25.0) return "Normal";
  if (bmi < 30.0) return "Overweight";
  if (bmi < 35.0) return "Obese Class I";
  if (bmi < 40.0) return "Obese Class II";
  return "Obese Class III";
}

export function getBmiCategoryDetails(bmi: number): {
  category: BMICategory;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
} {
  const category = getBmiCategory(bmi);
  switch (category) {
    case "Pending":
      return {
        category,
        color: "#94A3B8", // slate-400
        badgeBg: "bg-slate-500/15 border-slate-500/30",
        badgeText: "text-slate-400",
        description: "Height measurement needed to calculate BMI",
      };
    case "Underweight":
      return {
        category,
        color: "#38BDF8", // sky-400
        badgeBg: "bg-sky-500/15 border-sky-500/30",
        badgeText: "text-sky-400",
        description: "Below standard weight range (BMI < 18.5)",
      };
    case "Normal":
      return {
        category,
        color: "#10B981", // emerald-500
        badgeBg: "bg-emerald-500/15 border-emerald-500/30",
        badgeText: "text-emerald-400",
        description: "Healthy optimal weight zone (BMI 18.5 - 24.9)",
      };
    case "Overweight":
      return {
        category,
        color: "#F59E0B", // amber-500
        badgeBg: "bg-amber-500/15 border-amber-500/30",
        badgeText: "text-amber-400",
        description: "Moderate elevation above optimal (BMI 25.0 - 29.9)",
      };
    case "Obese Class I":
      return {
        category,
        color: "#F97316", // orange-500
        badgeBg: "bg-orange-500/15 border-orange-500/30",
        badgeText: "text-orange-400",
        description: "Class I health consideration (BMI 30.0 - 34.9)",
      };
    case "Obese Class II":
      return {
        category,
        color: "#EF4444", // red-500
        badgeBg: "bg-red-500/15 border-red-500/30",
        badgeText: "text-red-400",
        description: "Class II health consideration (BMI 35.0 - 39.9)",
      };
    case "Obese Class III":
      return {
        category,
        color: "#DC2626", // red-600
        badgeBg: "bg-red-600/15 border-red-600/30",
        badgeText: "text-red-500",
        description: "Class III high health consideration (BMI ≥ 40)",
      };
  }
}

/**
 * Calculates healthy weight range (BMI 18.5 - 24.9) for a given height in cm
 */
export function getHealthyWeightRange(heightCm: number): { minKg: number; maxKg: number } {
  if (!heightCm || heightCm <= 0) return { minKg: 0, maxKg: 0 };
  const heightM = heightCm / 100;
  const hSq = heightM * heightM;
  const minKg = Math.round(18.5 * hSq * 10) / 10;
  const maxKg = Math.round(24.9 * hSq * 10) / 10;
  return { minKg, maxKg };
}

/**
 * Calculates rolling 7-day moving average from weight logs
 */
export function calculate7DayMovingAverage(logs: WeightLog[]): number {
  if (!logs || logs.length === 0) return 0;
  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestDate = new Date(sorted[0].date).getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const windowLogs = sorted.filter(
    (l) => latestDate - new Date(l.date).getTime() <= sevenDaysMs
  );

  const targetSet = windowLogs.length > 0 ? windowLogs : sorted.slice(0, 3);
  const sum = targetSet.reduce((acc, curr) => acc + curr.weightKg, 0);
  return Math.round((sum / targetSet.length) * 10) / 10;
}

/**
 * Calculates check-in streak in weeks
 */
export function calculateStreakWeeks(logs: WeightLog[]): number {
  if (!logs || logs.length === 0) return 0;
  const sorted = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Distinct weeks of weigh-ins
  const weeks = new Set<string>();
  sorted.forEach((l) => {
    const d = new Date(l.date);
    const onejan = new Date(d.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
    weeks.add(`${d.getFullYear()}-W${weekNum}`);
  });

  return weeks.size;
}

/**
 * Calculates comprehensive biometric and progress insights for a single member
 */
export function calculateMemberInsight(member: Member, allLogs: WeightLog[]): MemberInsight {
  const memberLogs = allLogs
    .filter((l) => l.memberId === member.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const currentWeightKg = memberLogs.length > 0 
    ? memberLogs[memberLogs.length - 1].weightKg 
    : member.startingWeightKg;

  const startingWeightKg = member.startingWeightKg;
  const targetWeightKg = member.targetWeightKg;
  const totalLossKg = Math.round((startingWeightKg - currentWeightKg) * 10) / 10;
  
  const percentLoss = startingWeightKg > 0 
    ? Math.round(((startingWeightKg - currentWeightKg) / startingWeightKg) * 1000) / 10
    : 0;

  const goalSpan = startingWeightKg - targetWeightKg;
  const percentToGoal = goalSpan > 0
    ? Math.min(100, Math.max(0, Math.round((totalLossKg / goalSpan) * 1000) / 10))
    : 0;

  const remainingToGoalKg = Math.max(0, Math.round((currentWeightKg - targetWeightKg) * 10) / 10);

  const currentBmi = calculateBmi(currentWeightKg, member.heightCm);
  const startingBmi = calculateBmi(startingWeightKg, member.heightCm);
  const bmiDelta = Math.round((currentBmi - startingBmi) * 10) / 10;
  const bmiCategory = getBmiCategory(currentBmi);

  const healthyRange = getHealthyWeightRange(member.heightCm);
  let kgToHealthyRange = 0;
  if (member.heightCm > 0 && healthyRange.maxKg > 0) {
    if (currentWeightKg > healthyRange.maxKg) {
      kgToHealthyRange = Math.round((currentWeightKg - healthyRange.maxKg) * 10) / 10;
    } else if (currentWeightKg < healthyRange.minKg) {
      kgToHealthyRange = Math.round((healthyRange.minKg - currentWeightKg) * 10) / 10;
    }
  }

  // Weekly rate calculation
  let weeklyRateKg = 0;
  if (memberLogs.length >= 2) {
    const firstLog = memberLogs[0];
    const lastLog = memberLogs[memberLogs.length - 1];
    const daysDiff = (new Date(lastLog.date).getTime() - new Date(firstLog.date).getTime()) / (1000 * 3600 * 24);
    if (daysDiff >= 7) {
      const weeksDiff = daysDiff / 7;
      weeklyRateKg = Math.round(((firstLog.weightKg - lastLog.weightKg) / weeksDiff) * 100) / 100;
    }
  }

  // Projection
  let projectedWeeksToGoal: number | null = null;
  if (remainingToGoalKg > 0 && weeklyRateKg > 0.1) {
    projectedWeeksToGoal = Math.ceil(remainingToGoalKg / weeklyRateKg);
  }

  const lastWeighInDate = memberLogs.length > 0
    ? memberLogs[memberLogs.length - 1].date
    : member.joinDate;

  const streakWeeks = calculateStreakWeeks(memberLogs);
  const movingAverage7d = calculate7DayMovingAverage(memberLogs);

  return {
    member,
    currentWeightKg,
    startingWeightKg,
    targetWeightKg,
    totalLossKg,
    percentLoss,
    percentToGoal,
    remainingToGoalKg,
    heightCm: member.heightCm,
    currentBmi,
    startingBmi,
    bmiDelta,
    bmiCategory,
    healthyWeightRange: healthyRange,
    kgToHealthyRange,
    weeklyRateKg,
    projectedWeeksToGoal,
    lastWeighInDate,
    streakWeeks,
    movingAverage7d,
    historyCount: memberLogs.length,
  };
}

/**
 * Calculates aggregate group statistics for Elemen 2
 */
export function calculateCohortSummary(members: Member[], logs: WeightLog[]): CohortSummary {
  if (members.length === 0) {
    return {
      cohortName: "Elemen 2",
      memberCount: 0,
      totalLossKg: 0,
      averageInitialBmi: 0,
      averageCurrentBmi: 0,
      averageBmiDrop: 0,
      collectiveTargetKg: 0,
      collectiveCurrentKg: 0,
      collectiveStartKg: 0,
      progressPercent: 0,
      topPerformerId: null,
    };
  }

  const insights = members.map((m) => calculateMemberInsight(m, logs));
  
  const totalLossKg = Math.round(
    insights.reduce((acc, curr) => acc + Math.max(0, curr.totalLossKg), 0) * 10
  ) / 10;

  const collectiveStartKg = Math.round(
    insights.reduce((acc, curr) => acc + curr.startingWeightKg, 0) * 10
  ) / 10;

  const collectiveCurrentKg = Math.round(
    insights.reduce((acc, curr) => acc + curr.currentWeightKg, 0) * 10
  ) / 10;

  const collectiveTargetKg = Math.round(
    insights.reduce((acc, curr) => acc + curr.targetWeightKg, 0) * 10
  ) / 10;

  const membersWithBmi = insights.filter((i) => i.member.heightCm > 0 && i.currentBmi > 0);
  const avgInitialBmi = membersWithBmi.length > 0
    ? Math.round((membersWithBmi.reduce((acc, curr) => acc + curr.startingBmi, 0) / membersWithBmi.length) * 10) / 10
    : 0;

  const avgCurrentBmi = membersWithBmi.length > 0
    ? Math.round((membersWithBmi.reduce((acc, curr) => acc + curr.currentBmi, 0) / membersWithBmi.length) * 10) / 10
    : 0;

  const averageBmiDrop = avgInitialBmi > 0 && avgCurrentBmi > 0
    ? Math.round((avgInitialBmi - avgCurrentBmi) * 10) / 10
    : 0;

  const totalGoalDelta = collectiveStartKg - collectiveTargetKg;
  const progressPercent = totalGoalDelta > 0
    ? Math.min(100, Math.max(0, Math.round((totalLossKg / totalGoalDelta) * 1000) / 10))
    : 0;

  // Rank top performer by % body weight lost
  const sorted = [...insights].sort((a, b) => b.percentLoss - a.percentLoss);
  const topPerformerId = sorted.length > 0 ? sorted[0].member.id : null;

  return {
    cohortName: "Elemen 2",
    memberCount: members.length,
    totalLossKg,
    averageInitialBmi: avgInitialBmi,
    averageCurrentBmi: avgCurrentBmi,
    averageBmiDrop,
    collectiveTargetKg,
    collectiveCurrentKg,
    collectiveStartKg,
    progressPercent,
    topPerformerId,
  };
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}

export function formatWeight(valKg: number, unit: "kg" | "lbs" = "kg"): string {
  if (unit === "lbs") {
    return `${kgToLbs(valKg).toFixed(1)} lbs`;
  }
  return `${valKg.toFixed(1)} kg`;
}
