import { getSupabase, isSupabaseConfigured } from "./supabase";
import { Member, WeightLog } from "@/types";

const MEMBERS_KEY = "elemen2_members";
const LOGS_KEY = "elemen2_weight_logs";
const STORAGE_CHANGE_EVENT = "elemen2_data_updated";

export interface DbMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  height_cm: number;
  starting_weight_kg: number;
  target_weight_kg: number;
  goal_type?: string | null;
  join_date: string;
  notes: string | null;
}

export interface DbWeightLog {
  id: string;
  member_id: string;
  date: string;
  weight_kg: number;
  note: string | null;
  mood: string | null;
}

export function toDbMember(m: Member): DbMember {
  return {
    id: String(m.id),
    name: m.name,
    avatar: m.avatar,
    color: m.color,
    height_cm: Number(m.heightCm) || 0,
    starting_weight_kg: Number(m.startingWeightKg) || 0,
    target_weight_kg: Number(m.targetWeightKg) || 0,
    goal_type: m.goalType || null,
    join_date: m.joinDate,
    notes: m.notes || null,
  };
}

export function fromDbMember(row: any): Member {
  return {
    id: String(row.id),
    name: String(row.name || ""),
    avatar: String(row.avatar || ""),
    color: String(row.color || "#F59E0B"),
    heightCm: Number(row.height_cm ?? row.heightCm ?? 0),
    startingWeightKg: Number(row.starting_weight_kg ?? row.startingWeightKg ?? 0),
    targetWeightKg: Number(row.target_weight_kg ?? row.targetWeightKg ?? 0),
    goalType: (row.goal_type ?? row.goalType ?? undefined) || undefined,
    joinDate: String(row.join_date ?? row.joinDate ?? new Date().toISOString().split("T")[0]),
    notes: row.notes || undefined,
  };
}

export function toDbWeightLog(l: WeightLog): DbWeightLog {
  return {
    id: String(l.id),
    member_id: String(l.memberId),
    date: l.date,
    weight_kg: Number(l.weightKg),
    note: l.note || null,
    mood: l.mood || null,
  };
}

export function fromDbWeightLog(row: any): WeightLog {
  return {
    id: String(row.id),
    memberId: String(row.member_id ?? row.memberId),
    date: String(row.date),
    weightKg: Number(row.weight_kg ?? row.weightKg),
    note: row.note || undefined,
    mood: row.mood || undefined,
  };
}

/**
 * Fetch all members and logs from Supabase and synchronize with local cache.
 */
export async function pullFromCloud(): Promise<{
  success: boolean;
  error?: string;
  memberCount?: number;
  logCount?: number;
}> {
  const client = getSupabase();
  if (!client) return { success: false, error: "Supabase credentials not configured" };

  try {
    const [membersRes, logsRes] = await Promise.all([
      client.from("members").select("*"),
      client.from("weight_logs").select("*"),
    ]);

    if (membersRes.error) throw membersRes.error;
    if (logsRes.error) throw logsRes.error;

    const cloudMembers = membersRes.data || [];
    const cloudLogs = logsRes.data || [];

    if (cloudMembers.length > 0 && typeof window !== "undefined") {
      const members = cloudMembers.map(fromDbMember);
      const logs = cloudLogs.map(fromDbWeightLog);

      localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT));

      return {
        success: true,
        memberCount: members.length,
        logCount: logs.length,
      };
    }

    return {
      success: true,
      memberCount: 0,
      logCount: 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch from cloud";
    console.error("Failed to pull from Supabase:", message);
    return { success: false, error: message };
  }
}

/**
 * Push current local storage state to Supabase cloud tables.
 */
export async function pushLocalToCloud(): Promise<{
  success: boolean;
  error?: string;
  memberCount?: number;
  logCount?: number;
}> {
  if (typeof window === "undefined") return { success: false, error: "Not in browser" };

  const rawMembers = localStorage.getItem(MEMBERS_KEY);
  const rawLogs = localStorage.getItem(LOGS_KEY);
  const members: Member[] = rawMembers ? JSON.parse(rawMembers) : [];
  const logs: WeightLog[] = rawLogs ? JSON.parse(rawLogs) : [];

  if (members.length === 0) {
    return { success: false, error: "No local members found to upload" };
  }

  return batchUploadToCloud(members, logs);
}

/**
 * Batch upload members and logs to Supabase cloud.
 */
export async function batchUploadToCloud(
  members: Member[],
  logs: WeightLog[]
): Promise<{
  success: boolean;
  error?: string;
  memberCount?: number;
  logCount?: number;
}> {
  const client = getSupabase();
  if (!client) return { success: false, error: "Supabase credentials not configured" };

  try {
    // 1. Batch upsert members
    if (members.length > 0) {
      const dbMembers = members.map(toDbMember);
      const { error: mErr } = await client
        .from("members")
        .upsert(dbMembers, { onConflict: "id" });
      if (mErr) throw mErr;
    }

    // 2. Batch upsert weight logs in chunks of 50 to avoid request size limits
    if (logs.length > 0) {
      const dbLogs = logs.map(toDbWeightLog);
      const chunkSize = 50;
      for (let i = 0; i < dbLogs.length; i += chunkSize) {
        const chunk = dbLogs.slice(i, i + chunkSize);
        const { error: lErr } = await client
          .from("weight_logs")
          .upsert(chunk, { onConflict: "id" });
        if (lErr) throw lErr;
      }
    }

    return {
      success: true,
      memberCount: members.length,
      logCount: logs.length,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Batch upload failed";
    console.error("Batch upload failed:", message);
    return { success: false, error: message };
  }
}

/**
 * Push a single member update to Supabase asynchronously.
 */
export async function pushMemberToCloud(member: Member): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from("members").upsert(toDbMember(member), { onConflict: "id" });
  } catch (err) {
    console.warn("Could not sync member to cloud:", err);
  }
}

/**
 * Delete a member from Supabase asynchronously.
 */
export async function deleteMemberFromCloud(id: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from("members").delete().eq("id", id);
  } catch (err) {
    console.warn("Could not delete member from cloud:", err);
  }
}

/**
 * Push a weight log to Supabase asynchronously.
 */
export async function pushWeightLogToCloud(log: WeightLog): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from("weight_logs").upsert(toDbWeightLog(log), { onConflict: "id" });
  } catch (err) {
    console.warn("Could not sync weight log to cloud:", err);
  }
}

/**
 * Delete a weight log from Supabase asynchronously.
 */
export async function deleteWeightLogFromCloud(id: string): Promise<void> {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from("weight_logs").delete().eq("id", id);
  } catch (err) {
    console.warn("Could not delete weight log from cloud:", err);
  }
}

let activeChannel: any = null;

/**
 * Subscribes to realtime PostgreSQL change broadcasts on members and weight_logs.
 */
export function initRealtimeSync(): () => void {
  if (typeof window === "undefined") return () => {};
  const client = getSupabase();
  if (!client) return () => {};

  if (activeChannel) {
    return () => {};
  }

  const channel = client
    .channel("elemen2_realtime_sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "members" },
      (payload) => {
        try {
          const raw = localStorage.getItem(MEMBERS_KEY);
          let members: Member[] = raw ? JSON.parse(raw) : [];

          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const updated = fromDbMember(payload.new);
            const idx = members.findIndex((m) => m.id === updated.id);
            if (idx >= 0) {
              members[idx] = updated;
            } else {
              members.push(updated);
            }
          } else if (payload.eventType === "DELETE" && payload.old) {
            members = members.filter((m) => m.id !== payload.old.id);
          }

          localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
          window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT));
        } catch (e) {
          console.error("Realtime member update error:", e);
        }
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "weight_logs" },
      (payload) => {
        try {
          const raw = localStorage.getItem(LOGS_KEY);
          let logs: WeightLog[] = raw ? JSON.parse(raw) : [];

          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const updated = fromDbWeightLog(payload.new);
            const idx = logs.findIndex((l) => l.id === updated.id);
            if (idx >= 0) {
              logs[idx] = updated;
            } else {
              logs.push(updated);
            }
          } else if (payload.eventType === "DELETE" && payload.old) {
            logs = logs.filter((l) => l.id !== payload.old.id);
          }

          localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
          window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT));
        } catch (e) {
          console.error("Realtime log update error:", e);
        }
      }
    )
    .subscribe();

  activeChannel = channel;

  return () => {
    if (activeChannel) {
      client.removeChannel(activeChannel);
      activeChannel = null;
    }
  };
}
