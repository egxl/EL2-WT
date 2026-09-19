const fs = require('fs');
const path = require('path');

const COLOR_PALETTE = [
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#3B82F6", // Blue
  "#F97316", // Orange
  "#14B8A6", // Teal
];

// 30 members data with verified MCU height, and weights for 13 Sep and 19 Sep 2026
const rawMembers = [
  { id: "mem-01", name: "Havergal", avatar: "H", heightCm: 167, w1: 88.8, w2: 89.2 },
  { id: "mem-02", name: "Rangga", avatar: "R", heightCm: 180, w1: 71.5, w2: 72.65 },
  { id: "mem-03", name: "Raven", avatar: "R", heightCm: 168, w1: 64.7, w2: 65.15 },
  { id: "mem-04", name: "Rakha", avatar: "R", heightCm: 173, w1: 73.5, w2: 75.05 },
  { id: "mem-05", name: "Hasan", avatar: "H", heightCm: 167, w1: 62.4, w2: 62.6 },
  { id: "mem-06", name: "Owen", avatar: "O", heightCm: 173, w1: 63.3, w2: 65.95 },
  { id: "mem-07", name: "Mario", avatar: "M", heightCm: 170, w1: 70.5, w2: 71.35 },
  { id: "mem-08", name: "Hafis", avatar: "H", heightCm: 172, w1: 63.3, w2: 65.4 },
  { id: "mem-09", name: "Andy", avatar: "A", heightCm: 173, w1: 68.4, w2: 68.8 },
  { id: "mem-10", name: "Bowo", avatar: "B", heightCm: 170, w1: 75.9, w2: 77.4 },
  { id: "mem-11", name: "Fahmi Jahat", avatar: "FJ", heightCm: 170, w1: 63.2, w2: 62.5 },
  { id: "mem-12", name: "Abim", avatar: "A", heightCm: 173, w1: 65.0, w2: 66.15 },
  { id: "mem-13", name: "Rifki", avatar: "R", heightCm: 169, w1: 73.0, w2: 72.65 },
  { id: "mem-14", name: "Rayga", avatar: "R", heightCm: 178, w1: 118.0, w2: 117.65 },
  { id: "mem-15", name: "Mirza", avatar: "M", heightCm: 175, w1: 57.5, w2: 58.65 },
  { id: "mem-16", name: "Rizal FK", avatar: "RF", heightCm: 160, w1: 60.3, w2: 59.85 },
  { id: "mem-17", name: "Axel", avatar: "A", heightCm: 161, w1: 58.4, w2: 59.65 },
  { id: "mem-18", name: "Aris", avatar: "A", heightCm: 171.5, w1: 66.3, w2: 66.55 },
  { id: "mem-19", name: "Ikroom", avatar: "I", heightCm: 171.2, w1: 67.0, w2: 68.95 },
  { id: "mem-20", name: "Daffa", avatar: "D", heightCm: 161, w1: 51.1, w2: 51.85 },
  { id: "mem-21", name: "Rifat", avatar: "R", heightCm: 173, w1: 68.6, w2: 70.05 },
  { id: "mem-22", name: "Danil", avatar: "D", heightCm: 174, w1: 76.2, w2: 77.4 },
  { id: "mem-23", name: "Haydar", avatar: "H", heightCm: 167, w1: 61.0, w2: 61.9 },
  { id: "mem-24", name: "Kristian", avatar: "K", heightCm: 165, w1: 68.5, w2: 68.9 },
  { id: "mem-25", name: "Rizal Dwiki", avatar: "RD", heightCm: 167, w1: 56.0, w2: 57.2 },
  { id: "mem-26", name: "Fahmi Ammar", avatar: "FA", heightCm: 169, w1: 59.9, w2: 59.8 },
  { id: "mem-27", name: "Rafa Nazeera Fide", avatar: "RN", heightCm: 172, w1: 84.5, w2: 86.15 },
  { id: "mem-28", name: "Raya Aldrin", avatar: "RA", heightCm: 170, w1: 56.6, w2: 56.2 },
  { id: "mem-29", name: "Christian Jonathan", avatar: "CJ", heightCm: 174, w1: 90.5, w2: 92.1 },
  { id: "mem-30", name: "Muhammad Alfimansyah", avatar: "MA", heightCm: 174, w1: 66.6, w2: 64.9 }
];

function calculateTarget(heightCm, startingWeight) {
  const hM = heightCm / 100;
  const idealBmiWeight = Math.round(22.0 * hM * hM * 10) / 10;
  // If already at or below ideal BMI, target can be healthy maintenance
  if (startingWeight <= idealBmiWeight) {
    return startingWeight;
  }
  return idealBmiWeight;
}

// 1. Supabase members table format (snake_case)
const dbMembers = rawMembers.map((m, i) => {
  const target = calculateTarget(m.heightCm, m.w1);
  return {
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    color: COLOR_PALETTE[i % COLOR_PALETTE.length],
    height_cm: m.heightCm,
    starting_weight_kg: m.w1,
    target_weight_kg: target,
    join_date: "2026-09-13",
    notes: "MCU terakhir & kickoff timbang"
  };
});

// 2. Supabase weight_logs table format (snake_case)
const dbWeightLogs = [];
// 13 Sep 2026 logs
rawMembers.forEach((m, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  dbWeightLogs.push({
    id: `log-20260913-${num}`,
    member_id: m.id,
    date: "2026-09-13",
    weight_kg: m.w1,
    note: "Kickoff weigh-in",
    mood: "good"
  });
});
// 19 Sep 2026 logs
rawMembers.forEach((m, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  const delta = Math.round((m.w2 - m.w1) * 100) / 100;
  const mood = delta < 0 ? "great" : delta === 0 ? "steady" : "good";
  dbWeightLogs.push({
    id: `log-20260919-${num}`,
    member_id: m.id,
    date: "2026-09-19",
    weight_kg: m.w2,
    note: delta < 0 ? `Turun ${Math.abs(delta)} kg` : delta > 0 ? `Naik ${delta} kg` : "Stabil",
    mood: mood
  });
});

// 3. App Backup format (camelCase for members & logs)
const appBackup = {
  appName: "Elemen 2 Weight Tracker",
  exportedAt: new Date().toISOString(),
  members: rawMembers.map((m, i) => ({
    id: m.id,
    name: m.name,
    avatar: m.avatar,
    color: COLOR_PALETTE[i % COLOR_PALETTE.length],
    heightCm: m.heightCm,
    startingWeightKg: m.w1,
    targetWeightKg: calculateTarget(m.heightCm, m.w1),
    joinDate: "2026-09-13",
    notes: "MCU terakhir & kickoff timbang"
  })),
  logs: dbWeightLogs.map(l => ({
    id: l.id,
    memberId: l.member_id,
    date: l.date,
    weightKg: l.weight_kg,
    note: l.note,
    mood: l.mood
  }))
};

// 4. Combined SQL Script
let sql = `-- ==============================================================================
-- ELEMEN 2 COHORT — MEMBERS & WEIGHT LOGS SEED / UPDATE
-- ==============================================================================
-- Run this in Supabase SQL Editor to populate/update all 30 members and 60 weight logs.

-- 1. Insert or Update Members
INSERT INTO public.members (id, name, avatar, color, height_cm, starting_weight_kg, target_weight_kg, join_date, notes)
VALUES
` + dbMembers.map(m => `  ('${m.id}', '${m.name}', '${m.avatar}', '${m.color}', ${m.height_cm}, ${m.starting_weight_kg}, ${m.target_weight_kg}, '${m.join_date}', '${m.notes}')`).join(',\n') + `
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  avatar = EXCLUDED.avatar,
  color = EXCLUDED.color,
  height_cm = EXCLUDED.height_cm,
  starting_weight_kg = EXCLUDED.starting_weight_kg,
  target_weight_kg = EXCLUDED.target_weight_kg,
  join_date = EXCLUDED.join_date,
  notes = EXCLUDED.notes;

-- 2. Insert or Update Weight Logs (13 Sep & 19 Sep 2026)
INSERT INTO public.weight_logs (id, member_id, date, weight_kg, note, mood)
VALUES
` + dbWeightLogs.map(l => `  ('${l.id}', '${l.member_id}', '${l.date}', ${l.weight_kg}, '${l.note}', '${l.mood}')`).join(',\n') + `
ON CONFLICT (id) DO UPDATE SET
  weight_kg = EXCLUDED.weight_kg,
  note = EXCLUDED.note,
  mood = EXCLUDED.mood;
`;

// Write all files
fs.writeFileSync('supabase/members.json', JSON.stringify(dbMembers, null, 2));
fs.writeFileSync('members.json', JSON.stringify(dbMembers, null, 2));
fs.writeFileSync('supabase/weight_logs.json', JSON.stringify(dbWeightLogs, null, 2));
fs.writeFileSync('weight_logs.json', JSON.stringify(dbWeightLogs, null, 2));
fs.writeFileSync('supabase/elemen2_backup.json', JSON.stringify(appBackup, null, 2));
fs.writeFileSync('supabase/seed_data_all.sql', sql);

const tsContent = `import { Member, WeightLog } from "@/types";

export const INITIAL_MEMBERS: Member[] = ${JSON.stringify(appBackup.members, null, 2)};

export const INITIAL_WEIGHT_LOGS: WeightLog[] = ${JSON.stringify(appBackup.logs, null, 2)};
`;
fs.writeFileSync('src/lib/seed-data.ts', tsContent);

console.log("Successfully generated all files!");
console.log(`Members count: ${dbMembers.length}`);
console.log(`Weight logs count: ${dbWeightLogs.length}`);
