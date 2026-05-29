import type { ActivityLog } from "@/types/ops";

export async function getActivityLogs(): Promise<ActivityLog[]> {
  return [];
}

export async function createActivityLog(_log: Omit<ActivityLog, "id" | "created_at">): Promise<ActivityLog> {
  throw new Error("Supabase activity log writes are planned for Phase 3.1.");
}
