import { Member, WeightLog } from "@/types";

export const INITIAL_MEMBERS: Member[] = [
  {
    "id": "mem-01",
    "name": "Havergal",
    "avatar": "H",
    "color": "#F59E0B",
    "heightCm": 167,
    "startingWeightKg": 88.8,
    "targetWeightKg": 61.4,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-02",
    "name": "Rangga",
    "avatar": "R",
    "color": "#10B981",
    "heightCm": 180,
    "startingWeightKg": 71.5,
    "targetWeightKg": 71.3,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-03",
    "name": "Raven",
    "avatar": "R",
    "color": "#06B6D4",
    "heightCm": 168,
    "startingWeightKg": 64.7,
    "targetWeightKg": 62.1,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-04",
    "name": "Rakha",
    "avatar": "R",
    "color": "#8B5CF6",
    "heightCm": 173,
    "startingWeightKg": 73.5,
    "targetWeightKg": 65.8,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-05",
    "name": "Hasan",
    "avatar": "H",
    "color": "#EC4899",
    "heightCm": 167,
    "startingWeightKg": 62.4,
    "targetWeightKg": 61.4,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-06",
    "name": "Owen",
    "avatar": "O",
    "color": "#3B82F6",
    "heightCm": 173,
    "startingWeightKg": 63.3,
    "targetWeightKg": 63.3,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-07",
    "name": "Mario",
    "avatar": "M",
    "color": "#F97316",
    "heightCm": 170,
    "startingWeightKg": 70.5,
    "targetWeightKg": 63.6,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-08",
    "name": "Hafis",
    "avatar": "H",
    "color": "#14B8A6",
    "heightCm": 172,
    "startingWeightKg": 63.3,
    "targetWeightKg": 63.3,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-09",
    "name": "Andy",
    "avatar": "A",
    "color": "#F59E0B",
    "heightCm": 173,
    "startingWeightKg": 68.4,
    "targetWeightKg": 65.8,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-10",
    "name": "Bowo",
    "avatar": "B",
    "color": "#10B981",
    "heightCm": 170,
    "startingWeightKg": 75.9,
    "targetWeightKg": 63.6,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-11",
    "name": "Fahmi Jahat",
    "avatar": "FJ",
    "color": "#06B6D4",
    "heightCm": 170,
    "startingWeightKg": 63.2,
    "targetWeightKg": 63.2,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-12",
    "name": "Abim",
    "avatar": "A",
    "color": "#8B5CF6",
    "heightCm": 173,
    "startingWeightKg": 65,
    "targetWeightKg": 65,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-13",
    "name": "Rifki",
    "avatar": "R",
    "color": "#EC4899",
    "heightCm": 169,
    "startingWeightKg": 73,
    "targetWeightKg": 62.8,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-14",
    "name": "Rayga",
    "avatar": "R",
    "color": "#3B82F6",
    "heightCm": 178,
    "startingWeightKg": 118,
    "targetWeightKg": 69.7,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-15",
    "name": "Mirza",
    "avatar": "M",
    "color": "#F97316",
    "heightCm": 175,
    "startingWeightKg": 57.5,
    "targetWeightKg": 57.5,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-16",
    "name": "Rizal FK",
    "avatar": "RF",
    "color": "#14B8A6",
    "heightCm": 160,
    "startingWeightKg": 60.3,
    "targetWeightKg": 56.3,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-17",
    "name": "Axel",
    "avatar": "A",
    "color": "#F59E0B",
    "heightCm": 161,
    "startingWeightKg": 58.4,
    "targetWeightKg": 57,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-18",
    "name": "Aris",
    "avatar": "A",
    "color": "#10B981",
    "heightCm": 171.5,
    "startingWeightKg": 66.3,
    "targetWeightKg": 64.7,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-19",
    "name": "Ikroom",
    "avatar": "I",
    "color": "#06B6D4",
    "heightCm": 171.2,
    "startingWeightKg": 67,
    "targetWeightKg": 64.5,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-20",
    "name": "Daffa",
    "avatar": "D",
    "color": "#8B5CF6",
    "heightCm": 161,
    "startingWeightKg": 51.1,
    "targetWeightKg": 51.1,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-21",
    "name": "Rifat",
    "avatar": "R",
    "color": "#EC4899",
    "heightCm": 173,
    "startingWeightKg": 68.6,
    "targetWeightKg": 65.8,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-22",
    "name": "Danil",
    "avatar": "D",
    "color": "#3B82F6",
    "heightCm": 174,
    "startingWeightKg": 76.2,
    "targetWeightKg": 66.6,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-23",
    "name": "Haydar",
    "avatar": "H",
    "color": "#F97316",
    "heightCm": 167,
    "startingWeightKg": 61,
    "targetWeightKg": 61,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-24",
    "name": "Kristian",
    "avatar": "K",
    "color": "#14B8A6",
    "heightCm": 165,
    "startingWeightKg": 68.5,
    "targetWeightKg": 59.9,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-25",
    "name": "Rizal Dwiki",
    "avatar": "RD",
    "color": "#F59E0B",
    "heightCm": 167,
    "startingWeightKg": 56,
    "targetWeightKg": 56,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-26",
    "name": "Fahmi Ammar",
    "avatar": "FA",
    "color": "#10B981",
    "heightCm": 169,
    "startingWeightKg": 59.9,
    "targetWeightKg": 59.9,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-27",
    "name": "Rafa Nazeera Fide",
    "avatar": "RN",
    "color": "#06B6D4",
    "heightCm": 172,
    "startingWeightKg": 84.5,
    "targetWeightKg": 65.1,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-28",
    "name": "Raya Aldrin",
    "avatar": "RA",
    "color": "#8B5CF6",
    "heightCm": 170,
    "startingWeightKg": 56.6,
    "targetWeightKg": 56.6,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-29",
    "name": "Christian Jonathan",
    "avatar": "CJ",
    "color": "#EC4899",
    "heightCm": 174,
    "startingWeightKg": 90.5,
    "targetWeightKg": 66.6,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  },
  {
    "id": "mem-30",
    "name": "Muhammad Alfimansyah",
    "avatar": "MA",
    "color": "#3B82F6",
    "heightCm": 174,
    "startingWeightKg": 66.6,
    "targetWeightKg": 66.6,
    "joinDate": "2026-09-13",
    "notes": "MCU terakhir & kickoff timbang"
  }
];

export const INITIAL_WEIGHT_LOGS: WeightLog[] = [
  {
    "id": "log-20260913-01",
    "memberId": "mem-01",
    "date": "2026-09-13",
    "weightKg": 88.8,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-02",
    "memberId": "mem-02",
    "date": "2026-09-13",
    "weightKg": 71.5,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-03",
    "memberId": "mem-03",
    "date": "2026-09-13",
    "weightKg": 64.7,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-04",
    "memberId": "mem-04",
    "date": "2026-09-13",
    "weightKg": 73.5,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-05",
    "memberId": "mem-05",
    "date": "2026-09-13",
    "weightKg": 62.4,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-06",
    "memberId": "mem-06",
    "date": "2026-09-13",
    "weightKg": 63.3,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-07",
    "memberId": "mem-07",
    "date": "2026-09-13",
    "weightKg": 70.5,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-08",
    "memberId": "mem-08",
    "date": "2026-09-13",
    "weightKg": 63.3,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-09",
    "memberId": "mem-09",
    "date": "2026-09-13",
    "weightKg": 68.4,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-10",
    "memberId": "mem-10",
    "date": "2026-09-13",
    "weightKg": 75.9,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-11",
    "memberId": "mem-11",
    "date": "2026-09-13",
    "weightKg": 63.2,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-12",
    "memberId": "mem-12",
    "date": "2026-09-13",
    "weightKg": 65,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-13",
    "memberId": "mem-13",
    "date": "2026-09-13",
    "weightKg": 73,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-14",
    "memberId": "mem-14",
    "date": "2026-09-13",
    "weightKg": 118,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-15",
    "memberId": "mem-15",
    "date": "2026-09-13",
    "weightKg": 57.5,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-16",
    "memberId": "mem-16",
    "date": "2026-09-13",
    "weightKg": 60.3,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-17",
    "memberId": "mem-17",
    "date": "2026-09-13",
    "weightKg": 58.4,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-18",
    "memberId": "mem-18",
    "date": "2026-09-13",
    "weightKg": 66.3,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-19",
    "memberId": "mem-19",
    "date": "2026-09-13",
    "weightKg": 67,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-20",
    "memberId": "mem-20",
    "date": "2026-09-13",
    "weightKg": 51.1,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-21",
    "memberId": "mem-21",
    "date": "2026-09-13",
    "weightKg": 68.6,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-22",
    "memberId": "mem-22",
    "date": "2026-09-13",
    "weightKg": 76.2,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-23",
    "memberId": "mem-23",
    "date": "2026-09-13",
    "weightKg": 61,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-24",
    "memberId": "mem-24",
    "date": "2026-09-13",
    "weightKg": 68.5,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-25",
    "memberId": "mem-25",
    "date": "2026-09-13",
    "weightKg": 56,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-26",
    "memberId": "mem-26",
    "date": "2026-09-13",
    "weightKg": 59.9,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-27",
    "memberId": "mem-27",
    "date": "2026-09-13",
    "weightKg": 84.5,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-28",
    "memberId": "mem-28",
    "date": "2026-09-13",
    "weightKg": 56.6,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-29",
    "memberId": "mem-29",
    "date": "2026-09-13",
    "weightKg": 90.5,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260913-30",
    "memberId": "mem-30",
    "date": "2026-09-13",
    "weightKg": 66.6,
    "note": "Kickoff weigh-in",
    "mood": "good"
  },
  {
    "id": "log-20260919-01",
    "memberId": "mem-01",
    "date": "2026-09-19",
    "weightKg": 89.2,
    "note": "Naik 0.4 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-02",
    "memberId": "mem-02",
    "date": "2026-09-19",
    "weightKg": 72.65,
    "note": "Naik 1.15 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-03",
    "memberId": "mem-03",
    "date": "2026-09-19",
    "weightKg": 65.15,
    "note": "Naik 0.45 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-04",
    "memberId": "mem-04",
    "date": "2026-09-19",
    "weightKg": 75.05,
    "note": "Naik 1.55 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-05",
    "memberId": "mem-05",
    "date": "2026-09-19",
    "weightKg": 62.6,
    "note": "Naik 0.2 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-06",
    "memberId": "mem-06",
    "date": "2026-09-19",
    "weightKg": 65.95,
    "note": "Naik 2.65 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-07",
    "memberId": "mem-07",
    "date": "2026-09-19",
    "weightKg": 71.35,
    "note": "Naik 0.85 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-08",
    "memberId": "mem-08",
    "date": "2026-09-19",
    "weightKg": 65.4,
    "note": "Naik 2.1 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-09",
    "memberId": "mem-09",
    "date": "2026-09-19",
    "weightKg": 68.8,
    "note": "Naik 0.4 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-10",
    "memberId": "mem-10",
    "date": "2026-09-19",
    "weightKg": 77.4,
    "note": "Naik 1.5 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-11",
    "memberId": "mem-11",
    "date": "2026-09-19",
    "weightKg": 62.5,
    "note": "Turun 0.7 kg",
    "mood": "great"
  },
  {
    "id": "log-20260919-12",
    "memberId": "mem-12",
    "date": "2026-09-19",
    "weightKg": 66.15,
    "note": "Naik 1.15 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-13",
    "memberId": "mem-13",
    "date": "2026-09-19",
    "weightKg": 72.65,
    "note": "Turun 0.35 kg",
    "mood": "great"
  },
  {
    "id": "log-20260919-14",
    "memberId": "mem-14",
    "date": "2026-09-19",
    "weightKg": 117.65,
    "note": "Turun 0.35 kg",
    "mood": "great"
  },
  {
    "id": "log-20260919-15",
    "memberId": "mem-15",
    "date": "2026-09-19",
    "weightKg": 58.65,
    "note": "Naik 1.15 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-16",
    "memberId": "mem-16",
    "date": "2026-09-19",
    "weightKg": 59.85,
    "note": "Turun 0.45 kg",
    "mood": "great"
  },
  {
    "id": "log-20260919-17",
    "memberId": "mem-17",
    "date": "2026-09-19",
    "weightKg": 59.65,
    "note": "Naik 1.25 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-18",
    "memberId": "mem-18",
    "date": "2026-09-19",
    "weightKg": 66.55,
    "note": "Naik 0.25 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-19",
    "memberId": "mem-19",
    "date": "2026-09-19",
    "weightKg": 68.95,
    "note": "Naik 1.95 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-20",
    "memberId": "mem-20",
    "date": "2026-09-19",
    "weightKg": 51.85,
    "note": "Naik 0.75 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-21",
    "memberId": "mem-21",
    "date": "2026-09-19",
    "weightKg": 70.05,
    "note": "Naik 1.45 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-22",
    "memberId": "mem-22",
    "date": "2026-09-19",
    "weightKg": 77.4,
    "note": "Naik 1.2 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-23",
    "memberId": "mem-23",
    "date": "2026-09-19",
    "weightKg": 61.9,
    "note": "Naik 0.9 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-24",
    "memberId": "mem-24",
    "date": "2026-09-19",
    "weightKg": 68.9,
    "note": "Naik 0.4 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-25",
    "memberId": "mem-25",
    "date": "2026-09-19",
    "weightKg": 57.2,
    "note": "Naik 1.2 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-26",
    "memberId": "mem-26",
    "date": "2026-09-19",
    "weightKg": 59.8,
    "note": "Turun 0.1 kg",
    "mood": "great"
  },
  {
    "id": "log-20260919-27",
    "memberId": "mem-27",
    "date": "2026-09-19",
    "weightKg": 86.15,
    "note": "Naik 1.65 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-28",
    "memberId": "mem-28",
    "date": "2026-09-19",
    "weightKg": 56.2,
    "note": "Turun 0.4 kg",
    "mood": "great"
  },
  {
    "id": "log-20260919-29",
    "memberId": "mem-29",
    "date": "2026-09-19",
    "weightKg": 92.1,
    "note": "Naik 1.6 kg",
    "mood": "good"
  },
  {
    "id": "log-20260919-30",
    "memberId": "mem-30",
    "date": "2026-09-19",
    "weightKg": 64.9,
    "note": "Turun 1.7 kg",
    "mood": "great"
  }
];
