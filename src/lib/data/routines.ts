import type { RoutineCompletion, RoutineCompletionStatus, RoutineTask } from "@/types/routines";

export async function getRoutines(): Promise<RoutineTask[]> {
  return [];
}

export async function createRoutine(_routine: Omit<RoutineTask, "id" | "active" | "created_by" | "created_at">): Promise<RoutineTask> {
  throw new Error("Supabase routine writes are planned for Phase 3.1.");
}

export async function updateRoutine(_routineId: string, _updates: Partial<RoutineTask>): Promise<RoutineTask> {
  throw new Error("Supabase routine updates are planned for Phase 3.1.");
}

export async function deleteRoutine(_routineId: string) {
  throw new Error("Supabase routine deletes are planned for Phase 3.1.");
}

export async function markRoutineCompletion(
  _routineId: string,
  _status: RoutineCompletionStatus,
): Promise<RoutineCompletion> {
  throw new Error("Supabase routine completions are planned for Phase 3.1.");
}

export async function clearRoutineCompletion(_routineId: string) {
  throw new Error("Supabase routine completion clearing is planned for Phase 3.1.");
}
