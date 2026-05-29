import { createClient } from "@/lib/supabase/client";
import { mapRoutineRowToRoutine } from "@/lib/data/mappers";
import type { RoutineTask } from "@/types/routines";

export type RoutineInput = Omit<RoutineTask, "created_at">;

export async function getRoutines(): Promise<RoutineTask[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("routine_tasks").select("*").order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRoutineRowToRoutine);
}

export async function createRoutine(routine: RoutineInput): Promise<RoutineTask> {
  const supabase = createClient();
  const { data, error } = await supabase.from("routine_tasks").insert(routine).select("*").single();

  if (error) throw error;
  return mapRoutineRowToRoutine(data);
}

export async function updateRoutine(routineId: string, updates: Partial<RoutineTask>): Promise<RoutineTask> {
  const supabase = createClient();
  const { data, error } = await supabase.from("routine_tasks").update(updates).eq("id", routineId).select("*").single();

  if (error) throw error;
  return mapRoutineRowToRoutine(data);
}

export async function deleteRoutine(routineId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("routine_tasks").delete().eq("id", routineId);

  if (error) throw error;
}

export async function toggleRoutineActive(routine: RoutineTask): Promise<RoutineTask> {
  return updateRoutine(routine.id, { active: !routine.active });
}
