import { Member, WeightLog } from "@/types";

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "mem-1",
    name: "Arya",
    avatar: "A",
    color: "#F59E0B", // Amber
    heightCm: 176,
    startingWeightKg: 86.5,
    targetWeightKg: 74.0,
    joinDate: "2026-07-01",
    notes: "Pacing with weekly 5k runs and intermittent fasting.",
  },
  {
    id: "mem-2",
    name: "Dimas",
    avatar: "D",
    color: "#10B981", // Emerald
    heightCm: 172,
    startingWeightKg: 82.0,
    targetWeightKg: 69.0,
    joinDate: "2026-07-01",
    notes: "Strength training 4x a week + low-carb diet.",
  },
  {
    id: "mem-3",
    name: "Reza",
    avatar: "R",
    color: "#06B6D4", // Cyan
    heightCm: 180,
    startingWeightKg: 94.0,
    targetWeightKg: 80.0,
    joinDate: "2026-07-01",
    notes: "Cutting sugar and late-night snacks.",
  },
  {
    id: "mem-4",
    name: "Budi",
    avatar: "B",
    color: "#8B5CF6", // Violet
    heightCm: 168,
    startingWeightKg: 77.0,
    targetWeightKg: 65.0,
    joinDate: "2026-07-01",
    notes: "Daily 10,000 steps target + clean eating.",
  },
  {
    id: "mem-5",
    name: "Eko",
    avatar: "E",
    color: "#EC4899", // Pink
    heightCm: 174,
    startingWeightKg: 79.5,
    targetWeightKg: 70.0,
    joinDate: "2026-07-01",
    notes: "Calorie tracking and weekend cycling.",
  },
];

export const INITIAL_WEIGHT_LOGS: WeightLog[] = [
  // Arya logs
  { id: "log-101", memberId: "mem-1", date: "2026-07-01", weightKg: 86.5, note: "Kickoff weigh-in", mood: "good" },
  { id: "log-102", memberId: "mem-1", date: "2026-07-15", weightKg: 84.8, note: "Week 2 solid", mood: "great" },
  { id: "log-103", memberId: "mem-1", date: "2026-08-01", weightKg: 83.2, note: "Month 1 milestone", mood: "great" },
  { id: "log-104", memberId: "mem-1", date: "2026-08-15", weightKg: 81.6, note: "Feeling much lighter", mood: "good" },
  { id: "log-105", memberId: "mem-1", date: "2026-09-01", weightKg: 80.1, note: "Under 81 kg!", mood: "great" },
  { id: "log-106", memberId: "mem-1", date: "2026-09-18", weightKg: 78.8, note: "Current check-in", mood: "great" },

  // Dimas logs
  { id: "log-201", memberId: "mem-2", date: "2026-07-01", weightKg: 82.0, note: "Kickoff", mood: "good" },
  { id: "log-202", memberId: "mem-2", date: "2026-07-15", weightKg: 80.5, note: "Water weight drop", mood: "great" },
  { id: "log-203", memberId: "mem-2", date: "2026-08-01", weightKg: 78.8, note: "Hit 70s!", mood: "great" },
  { id: "log-204", memberId: "mem-2", date: "2026-08-15", weightKg: 77.1, note: "Mid-August push", mood: "steady" },
  { id: "log-205", memberId: "mem-2", date: "2026-09-01", weightKg: 75.6, note: "Gym PRs up", mood: "great" },
  { id: "log-206", memberId: "mem-2", date: "2026-09-17", weightKg: 74.2, note: "Recent log", mood: "good" },

  // Reza logs
  { id: "log-301", memberId: "mem-3", date: "2026-07-01", weightKg: 94.0, note: "Starting out", mood: "good" },
  { id: "log-302", memberId: "mem-3", date: "2026-07-15", weightKg: 92.2, note: "Noticeable change", mood: "great" },
  { id: "log-303", memberId: "mem-3", date: "2026-08-01", weightKg: 90.4, note: "Breaking into 80s soon", mood: "good" },
  { id: "log-304", memberId: "mem-3", date: "2026-08-15", weightKg: 88.8, note: "Double digits gone!", mood: "great" },
  { id: "log-305", memberId: "mem-3", date: "2026-09-01", weightKg: 87.0, note: "Holding strong", mood: "steady" },
  { id: "log-306", memberId: "mem-3", date: "2026-09-19", weightKg: 85.5, note: "Today check-in", mood: "great" },

  // Budi logs
  { id: "log-401", memberId: "mem-4", date: "2026-07-01", weightKg: 77.0, note: "Start", mood: "good" },
  { id: "log-402", memberId: "mem-4", date: "2026-07-15", weightKg: 75.8, note: "Progress", mood: "good" },
  { id: "log-403", memberId: "mem-4", date: "2026-08-01", weightKg: 74.5, note: "Steady state", mood: "steady" },
  { id: "log-404", memberId: "mem-4", date: "2026-08-15", weightKg: 73.1, note: "Down 4 kg", mood: "great" },
  { id: "log-405", memberId: "mem-4", date: "2026-09-01", weightKg: 72.0, note: "Almost at target", mood: "good" },
  { id: "log-406", memberId: "mem-4", date: "2026-09-16", weightKg: 71.0, note: "Latest weigh-in", mood: "great" },

  // Eko logs
  { id: "log-501", memberId: "mem-5", date: "2026-07-01", weightKg: 79.5, note: "Starting point", mood: "good" },
  { id: "log-502", memberId: "mem-5", date: "2026-07-15", weightKg: 78.1, note: "Good momentum", mood: "good" },
  { id: "log-503", memberId: "mem-5", date: "2026-08-01", weightKg: 76.5, note: "Cycling helps a lot", mood: "great" },
  { id: "log-504", memberId: "mem-5", date: "2026-08-15", weightKg: 75.0, note: "Down 4.5 kg", mood: "great" },
  { id: "log-505", memberId: "mem-5", date: "2026-09-01", weightKg: 73.5, note: "Almost 72 kg", mood: "good" },
  { id: "log-506", memberId: "mem-5", date: "2026-09-18", weightKg: 72.3, note: "Consistent drop", mood: "great" },
];
