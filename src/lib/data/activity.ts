import { createClient } from "@/lib/supabase/client";
import { mapActivityLogToInsert, mapActivityRowToActivityLog } from "@/lib/data/mappers";
import type { ActivityLog } from "@/types/ops";

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("activity_logs").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapActivityRowToActivityLog);
}

export async function createActivityLog(log: Omit<ActivityLog, "id" | "created_at">): Promise<ActivityLog> {
  const supabase = createClient();
  const { data, error } = await supabase.from("activity_logs").insert(mapActivityLogToInsert(log)).select("*").single();

  if (error) throw error;
  return mapActivityRowToActivityLog(data);
}
