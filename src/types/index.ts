export type BMICategory =
  | "Underweight"
  | "Normal"
  | "Overweight"
  | "Obese Class I"
  | "Obese Class II"
  | "Obese Class III"
  | "Pending";

export interface Member {
  id: string;
  name: string;
  avatar: string; // Avatar identifier or initials
  color: string; // Member specific accent color (hex)
  heightCm: number; // Height in cm (0 if pending measurement)
  startingWeightKg: number;
  targetWeightKg: number;
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
}

export type UnitPreference = "kg" | "lbs";
