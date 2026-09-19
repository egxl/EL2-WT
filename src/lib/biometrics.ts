import { BMICategory, GoalType, Member, MemberInsight, WeightLog, CohortSummary } from "@/types";

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
 * Determines a member's goal type.
 * Auto-detects based on starting and target weights if not explicitly set.
 */
export function determineGoalType(
  startingWeightKg: number,
  targetWeightKg: number,
  explicitGoal?: GoalType
): GoalType {
  if (explicitGoal) return explicitGoal;
  if (!startingWeightKg || !targetWeightKg) return "maintaining";
  if (targetWeightKg < startingWeightKg - 0.5) return "cutting";
  if (targetWeightKg > startingWeightKg + 0.5) return "bulking";
  return "maintaining";
}

export function getGoalTypeDetails(goalType: GoalType): {
  type: GoalType;
  label: string;
  badgeBg: string;
  badgeText: string;
  color: string;
  icon: string;
  description: string;
} {
  switch (goalType) {
    case "cutting":
      return {
        type: "cutting",
        label: "Cutting",
        badgeBg: "bg-rose-500/15 border-rose-500/30",
        badgeText: "text-rose-400",
        color: "#F43F5E",
        icon: "🔥",
        description: "Focusing on fat loss & caloric deficit",
      };
    case "bulking":
      return {
        type: "bulking",
        label: "Bulking",
        badgeBg: "bg-indigo-500/15 border-indigo-500/30",
        badgeText: "text-indigo-400",
        color: "#6366F1",
        icon: "💪",
        description: "Focusing on lean mass gain & caloric surplus",
      };
    case "maintaining":
      return {
        type: "maintaining",
        label: "Maintaining",
        badgeBg: "bg-emerald-500/15 border-emerald-500/30",
        badgeText: "text-emerald-400",
        color: "#10B981",
        icon: "⚖️",
        description: "Focusing on healthy weight maintenance & recomp",
      };
  }
}

/**
 * Calculates ideal weight at WHO optimal BMI 22.0
 */
export function calculateIdealWeight(heightCm: number): number {
  if (!heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round(22.0 * heightM * heightM * 10) / 10;
}

/**
 * Computes an Ideal Proximity Score (0 - 100).
 * - Members at exactly BMI 22.0 receive 100.
 * - Members within normal WHO range (18.5 - 24.9) receive 85 - 100.
 * - Scores decay smoothly outside the healthy range based on distance.
 */
export function calculateIdealProximityScore(currentWeightKg: number, heightCm: number): number {
  if (!heightCm || heightCm <= 0 || !currentWeightKg || currentWeightKg <= 0) return 50;
  const idealKg = calculateIdealWeight(heightCm);
  if (idealKg <= 0) return 50;

  const diffKg = Math.abs(currentWeightKg - idealKg);
  const healthyRange = getHealthyWeightRange(heightCm);

  if (currentWeightKg >= healthyRange.minKg && currentWeightKg <= healthyRange.maxKg) {
    const maxSpan = Math.max(idealKg - healthyRange.minKg, healthyRange.maxKg - idealKg);
    const penalty = maxSpan > 0 ? (diffKg / maxSpan) * 15 : 0;
    return Math.round((100 - penalty) * 10) / 10;
  }

  const boundaryDiff = currentWeightKg > healthyRange.maxKg
    ? currentWeightKg - healthyRange.maxKg
    : healthyRange.minKg - currentWeightKg;

  const score = Math.max(0, 85 - boundaryDiff * 2.5);
  return Math.round(score * 10) / 10;
}

/**
 * Direction-aware goal progress percentage (0 - 100%).
 * Accurately rewards cutting, bulking, and maintaining.
 */
export function calculateGoalProgress(
  startingWeightKg: number,
  currentWeightKg: number,
  targetWeightKg: number,
  goalType: GoalType
): number {
  if (goalType === "cutting") {
    const span = startingWeightKg - targetWeightKg;
    if (span <= 0) return 100;
    const lost = startingWeightKg - currentWeightKg;
    if (lost <= 0) return 0;
    return Math.min(100, Math.round((lost / span) * 1000) / 10);
  }

  if (goalType === "bulking") {
    const span = targetWeightKg - startingWeightKg;
    if (span <= 0) return 100;
    const gained = currentWeightKg - startingWeightKg;
    if (gained <= 0) return 0;
    return Math.min(100, Math.round((gained / span) * 1000) / 10);
  }

  // Maintaining: reward remaining within +/- 0.5kg of target
  const diff = Math.abs(currentWeightKg - targetWeightKg);
  if (diff <= 0.5) return 100;
  return Math.max(0, Math.round((100 - (diff - 0.5) * 20) * 10) / 10);
}

/**
 * Calculates Composite Elemen 2 Index (0 - 100 pts).
 * - 45% Goal Progress (Journey execution)
 * - 35% Ideal Biometric Proximity (BMI 22.0 bullseye)
 * - 20% Consistency Streak (Habit discipline)
 */
export function calculateCompositeScore(
  goalProgressPercent: number,
  idealProximityScore: number,
  streakWeeks: number
): { compositeScore: number; streakScore: number } {
  // 4 weeks active streak gives maximum 100% streak score
  const streakScore = Math.min(100, streakWeeks * 25);
  const composite = (goalProgressPercent * 0.45) + (idealProximityScore * 0.35) + (streakScore * 0.20);
  return {
    compositeScore: Math.round(composite * 10) / 10,
    streakScore,
  };
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

export interface TargetWeightSuggestions {
  defaultTargetKg: number;
  idealBmiKg: number;
  upperNormalBmiKg: number;
  tenPercentLossKg: number;
}

/**
 * Calculates target weight suggestions based on height and starting weight.
 * - idealBmiKg: BMI 22.0 (WHO optimal midpoint)
 * - upperNormalBmiKg: BMI 24.9 (safe upper threshold of normal)
 * - tenPercentLossKg: 90% of starting weight (clinical initial 10% milestone)
 */
export function getTargetWeightSuggestions(
  heightCm: number,
  startingWeightKg: number
): TargetWeightSuggestions {
  const heightM = heightCm > 0 ? heightCm / 100 : 0;
  const hSq = heightM * heightM;

  const idealBmiKg = hSq > 0 ? Math.round(22.0 * hSq * 10) / 10 : 0;
  const upperNormalBmiKg = hSq > 0 ? Math.round(24.9 * hSq * 10) / 10 : 0;
  const tenPercentLossKg =
    startingWeightKg > 0 ? Math.round(startingWeightKg * 0.9 * 10) / 10 : 0;

  let defaultTargetKg = 70.0;

  if (idealBmiKg > 0) {
    if (startingWeightKg > 0 && startingWeightKg <= idealBmiKg) {
      defaultTargetKg = startingWeightKg;
    } else {
      defaultTargetKg = idealBmiKg;
    }
  } else if (tenPercentLossKg > 0) {
    defaultTargetKg = tenPercentLossKg;
  }

  return {
    defaultTargetKg,
    idealBmiKg,
    upperNormalBmiKg,
    tenPercentLossKg,
  };
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
  const netChangeKg = Math.round((currentWeightKg - startingWeightKg) * 10) / 10;
  
  const percentLoss = startingWeightKg > 0 
    ? Math.round(((startingWeightKg - currentWeightKg) / startingWeightKg) * 1000) / 10
    : 0;

  // Goal type determination
  const goalType = determineGoalType(startingWeightKg, targetWeightKg, member.goalType);
  const goalProgressPercent = calculateGoalProgress(startingWeightKg, currentWeightKg, targetWeightKg, goalType);
  const distanceToTargetKg = Math.round(Math.abs(currentWeightKg - targetWeightKg) * 10) / 10;

  // Ideal weight metrics (WHO BMI 22.0)
  const idealWeightKg = calculateIdealWeight(member.heightCm);
  const distanceToIdealKg = idealWeightKg > 0
    ? Math.round(Math.abs(currentWeightKg - idealWeightKg) * 10) / 10
    : 0;
  const idealProximityScore = calculateIdealProximityScore(currentWeightKg, member.heightCm);

  // Legacy compatibility fields
  const goalSpan = startingWeightKg - targetWeightKg;
  const percentToGoal = goalSpan > 0
    ? Math.min(100, Math.max(0, Math.round((totalLossKg / goalSpan) * 1000) / 10))
    : goalProgressPercent;
  const remainingToGoalKg = distanceToTargetKg;

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
  if (distanceToTargetKg > 0 && Math.abs(weeklyRateKg) > 0.1) {
    projectedWeeksToGoal = Math.ceil(distanceToTargetKg / Math.abs(weeklyRateKg));
  }

  const lastWeighInDate = memberLogs.length > 0
    ? memberLogs[memberLogs.length - 1].date
    : member.joinDate;

  const streakWeeks = calculateStreakWeeks(memberLogs);
  const movingAverage7d = calculate7DayMovingAverage(memberLogs);
  const { compositeScore, streakScore } = calculateCompositeScore(goalProgressPercent, idealProximityScore, streakWeeks);

  return {
    member,
    currentWeightKg,
    startingWeightKg,
    targetWeightKg,
    totalLossKg,
    percentLoss,
    percentToGoal,
    remainingToGoalKg,
    goalType,
    netChangeKg,
    idealWeightKg,
    distanceToIdealKg,
    idealProximityScore,
    distanceToTargetKg,
    goalProgressPercent,
    streakScore,
    compositeScore,
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
      cuttingCount: 0,
      bulkingCount: 0,
      maintainingCount: 0,
      averageCompositeScore: 0,
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

  const cuttingCount = insights.filter((i) => i.goalType === "cutting").length;
  const bulkingCount = insights.filter((i) => i.goalType === "bulking").length;
  const maintainingCount = insights.filter((i) => i.goalType === "maintaining").length;

  const averageCompositeScore = insights.length > 0
    ? Math.round((insights.reduce((acc, curr) => acc + curr.compositeScore, 0) / insights.length) * 10) / 10
    : 0;

  // Average goal progress across cohort
  const progressPercent = insights.length > 0
    ? Math.round((insights.reduce((acc, curr) => acc + curr.goalProgressPercent, 0) / insights.length) * 10) / 10
    : 0;

  // Rank top performer by highest composite Elemen 2 score
  const sorted = [...insights].sort((a, b) => b.compositeScore - a.compositeScore);
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
    cuttingCount,
    bulkingCount,
    maintainingCount,
    averageCompositeScore,
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
