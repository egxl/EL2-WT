"use client";

import { Member, WeightLog, UnitPreference } from "@/types";
import { INITIAL_MEMBERS, INITIAL_WEIGHT_LOGS } from "./seed-data";
import { isSupabaseConfigured } from "./supabase";
import {
  pushMemberToCloud,
  deleteMemberFromCloud,
  pushWeightLogToCloud,
  deleteWeightLogFromCloud,
  batchUploadToCloud,
} from "./supabase-sync";

const MEMBERS_KEY = "elemen2_members";
const LOGS_KEY = "elemen2_weight_logs";
const UNIT_KEY = "elemen2_unit_pref";
const STORAGE_CHANGE_EVENT = "elemen2_data_updated";

export function emitChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT));
  }
}

export function getMembers(): Member[] {
  if (typeof window === "undefined") return INITIAL_MEMBERS;
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEMBERS;
  }
}

export function getMemberById(id: string): Member | undefined {
  const members = getMembers();
  return members.find((m) => m.id === id);
}

export function saveMember(member: Member): void {
  if (typeof window === "undefined") return;
  const members = getMembers();
  const existingIndex = members.findIndex((m) => m.id === member.id);
  if (existingIndex >= 0) {
    members[existingIndex] = member;
  } else {
    members.push(member);
  }
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  emitChange();

  if (isSupabaseConfigured()) {
    pushMemberToCloud(member).catch((err) => {
      console.warn("Async cloud member push failed:", err);
    });
  }
}

export function deleteMember(id: string): void {
  if (typeof window === "undefined") return;
  const members = getMembers().filter((m) => m.id !== id);
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  // also clean up member logs
  const logs = getWeightLogs().filter((l) => l.memberId !== id);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  emitChange();

  if (isSupabaseConfigured()) {
    deleteMemberFromCloud(id).catch((err) => {
      console.warn("Async cloud member deletion failed:", err);
    });
  }
}

export function getWeightLogs(): WeightLog[] {
  if (typeof window === "undefined") return INITIAL_WEIGHT_LOGS;
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) {
      localStorage.setItem(LOGS_KEY, JSON.stringify(INITIAL_WEIGHT_LOGS));
      return INITIAL_WEIGHT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_WEIGHT_LOGS;
  }
}

export function getMemberWeightLogs(memberId: string): WeightLog[] {
  return getWeightLogs()
    .filter((l) => l.memberId === memberId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function addWeightLog(logData: Omit<WeightLog, "id">): WeightLog {
  const newLog: WeightLog = {
    ...logData,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };
  const logs = getWeightLogs();
  logs.push(newLog);
  if (typeof window !== "undefined") {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    emitChange();

    if (isSupabaseConfigured()) {
      pushWeightLogToCloud(newLog).catch((err) => {
        console.warn("Async cloud weight log push failed:", err);
      });
    }
  }
  return newLog;
}

export function addWeightLogs(logsData: Omit<WeightLog, "id">[]): WeightLog[] {
  if (logsData.length === 0) return [];
  const newLogs: WeightLog[] = logsData.map((data, index) => ({
    ...data,
    id: `log-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
  }));

  const logs = getWeightLogs();
  logs.push(...newLogs);

  if (typeof window !== "undefined") {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    emitChange();

    if (isSupabaseConfigured()) {
      newLogs.forEach((l) => {
        pushWeightLogToCloud(l).catch((err) => {
          console.warn("Async cloud weight log push failed:", err);
        });
      });
    }
  }
  return newLogs;
}

export function updateWeightLog(updatedLog: WeightLog): void {
  if (typeof window === "undefined") return;
  const logs = getWeightLogs();
  const index = logs.findIndex((l) => l.id === updatedLog.id);
  if (index >= 0) {
    logs[index] = updatedLog;
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
    emitChange();

    if (isSupabaseConfigured()) {
      pushWeightLogToCloud(updatedLog).catch((err) => {
        console.warn("Async cloud weight log update failed:", err);
      });
    }
  }
}

export function deleteWeightLog(id: string): void {
  if (typeof window === "undefined") return;
  const logs = getWeightLogs().filter((l) => l.id !== id);
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  emitChange();

  if (isSupabaseConfigured()) {
    deleteWeightLogFromCloud(id).catch((err) => {
      console.warn("Async cloud weight log delete failed:", err);
    });
  }
}

export function getUnitPreference(): UnitPreference {
  if (typeof window === "undefined") return "kg";
  return (localStorage.getItem(UNIT_KEY) as UnitPreference) || "kg";
}

export function setUnitPreference(unit: UnitPreference): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(UNIT_KEY, unit);
  emitChange();
}

export function resetToDemoData(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(INITIAL_MEMBERS));
  localStorage.setItem(LOGS_KEY, JSON.stringify(INITIAL_WEIGHT_LOGS));
  emitChange();
}

export function exportData(): string {
  const data = {
    appName: "Elemen 2 Weight Tracker",
    exportedAt: new Date().toISOString(),
    members: getMembers(),
    logs: getWeightLogs(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): { success: boolean; error?: string; cloudSynced?: boolean } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed.members) || !Array.isArray(parsed.logs)) {
      return { success: false, error: "Invalid backup format. Must contain members and logs." };
    }
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(parsed.members));
    localStorage.setItem(LOGS_KEY, JSON.stringify(parsed.logs));
    emitChange();

    if (isSupabaseConfigured()) {
      batchUploadToCloud(parsed.members, parsed.logs).catch((e) => {
        console.error("Cloud sync during import failed:", e);
      });
      return { success: true, cloudSynced: true };
    }

    return { success: true, cloudSynced: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Malformed JSON";
    return { success: false, error: message };
  }
}

export async function importDataAsync(jsonString: string): Promise<{
  success: boolean;
  error?: string;
  cloudSynced?: boolean;
  memberCount?: number;
  logCount?: number;
}> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed.members) || !Array.isArray(parsed.logs)) {
      return { success: false, error: "Invalid backup format. Must contain members and logs." };
    }
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(parsed.members));
    localStorage.setItem(LOGS_KEY, JSON.stringify(parsed.logs));
    emitChange();

    if (isSupabaseConfigured()) {
      const cloudRes = await batchUploadToCloud(parsed.members, parsed.logs);
      if (!cloudRes.success) {
        return {
          success: true,
          cloudSynced: false,
          error: `Saved to local storage, but cloud sync encountered an issue: ${cloudRes.error}`,
          memberCount: parsed.members.length,
          logCount: parsed.logs.length,
        };
      }
      return {
        success: true,
        cloudSynced: true,
        memberCount: parsed.members.length,
        logCount: parsed.logs.length,
      };
    }

    return {
      success: true,
      cloudSynced: false,
      memberCount: parsed.members.length,
      logCount: parsed.logs.length,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Malformed JSON";
    return { success: false, error: message };
  }
}

export function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleUpdate = () => callback();
  window.addEventListener(STORAGE_CHANGE_EVENT, handleUpdate);
  window.addEventListener("storage", handleUpdate);

  return () => {
    window.removeEventListener(STORAGE_CHANGE_EVENT, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}
