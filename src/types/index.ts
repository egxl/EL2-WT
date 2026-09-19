export type BMICategory =
  | "Underweight"
  | "Normal"
  | "Overweight"
  | "Obese Class I"
  | "Obese Class II"
  | "Obese Class III"
  | "Pending";

export type GoalType = "cutting" | "bulking" | "maintaining";

export interface Member {
  id: string;
  name: string;
  avatar: string; // Avatar identifier or initials
  color: string; // Member specific accent color (hex)
  heightCm: number; // Height in cm (0 if pending measurement)
  startingWeightKg: number;
  targetWeightKg: number;
  goalType?: GoalType; // Optional explicit goal type override
  joinDate: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
}

export interface WeightLog {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
  mood?: "great" | "good" | "steady" | "tough";
}

export interface MemberInsight {
  member: Member;
  currentWeightKg: number;
  startingWeightKg: number;
  targetWeightKg: number;
  totalLossKg: number;
  percentLoss: number;
  percentToGoal: number;
  remainingToGoalKg: number;
  // Goal-aware and holistic metrics
  goalType: GoalType;
  netChangeKg: number; // current - starting (positive if gained, negative if lost)
  idealWeightKg: number; // WHO BMI 22.0 for member's height
  distanceToIdealKg: number; // |currentWeight - idealWeight|
  idealProximityScore: number; // 0-100 score for proximity to BMI 22.0
  distanceToTargetKg: number; // |currentWeight - targetWeight|
  goalProgressPercent: number; // Direction-aware 0-100% progress
  streakScore: number; // 0-100 score based on consistency
  compositeScore: number; // 0-100 Elemen 2 Index
  heightCm: number;
  currentBmi: number;
  startingBmi: number;
  bmiDelta: number;
  bmiCategory: BMICategory;
  healthyWeightRange: {
    minKg: number;
    maxKg: number;
  };
  kgToHealthyRange: number; // 0 if in normal range
  weeklyRateKg: number; // kg per week change
  projectedWeeksToGoal: number | null;
  lastWeighInDate: string;
  streakWeeks: number;
  movingAverage7d: number;
  historyCount: number;
}

export interface CohortSummary {
  cohortName: string;
  memberCount: number;
  totalLossKg: number;
  averageInitialBmi: number;
  averageCurrentBmi: number;
  averageBmiDrop: number;
  collectiveTargetKg: number;
  collectiveCurrentKg: number;
  collectiveStartKg: number;
  progressPercent: number;
  topPerformerId: string | null;
  // Goal breakdown
  cuttingCount: number;
  bulkingCount: number;
  maintainingCount: number;
  averageCompositeScore: number;
}

export type UnitPreference = "kg" | "lbs";
