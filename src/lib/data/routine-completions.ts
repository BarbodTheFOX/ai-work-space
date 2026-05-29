import { createClient } from "@/lib/supabase/client";
import { mapRoutineCompletionRowToCompletion } from "@/lib/data/mappers";
import type { RoutineCompletion, RoutineCompletionStatus } from "@/types/routines";

export async function getRoutineCompletions(): Promise<RoutineCompletion[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("routine_completions").select("*").order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRoutineCompletionRowToCompletion);
}

export async function upsertRoutineCompletion(completion: Omit<RoutineCompletion, "id" | "created_at"> & { id?: string }): Promise<RoutineCompletion> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("routine_completions")
    .upsert(completion, { onConflict: "routine_id,user_id,date" })
    .select("*")
    .single();

  if (error) throw error;
  return mapRoutineCompletionRowToCompletion(data);
}

export async function markRoutineCompletion({
  routineId,
  userId,
  date,
  status,
  note = null,
}: {
  routineId: string;
  userId: string;
  date: string;
  status: RoutineCompletionStatus;
  note?: string | null;
}): Promise<RoutineCompletion> {
  return upsertRoutineCompletion({
    routine_id: routineId,
    user_id: userId,
    date,
    status,
    checked_at: status === "missed" ? null : new Date().toISOString(),
    note,
  });
}

export async function clearRoutineCompletion(routineId: string, userId: string, date: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("routine_completions")
    .delete()
    .eq("routine_id", routineId)
    .eq("user_id", userId)
    .eq("date", date);

  if (error) throw error;
}
