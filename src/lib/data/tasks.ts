import { createClient } from "@/lib/supabase/client";
import { mapTaskRowToTask, mapTaskToInsert, mapTaskUpdates } from "@/lib/data/mappers";
import type { Task } from "@/types/ops";

export type TaskInput = Omit<Task, "created_at" | "updated_at">;

export async function getTasks(): Promise<Task[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("tasks").select("*").order("deadline", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapTaskRowToTask);
}

export async function createTask(task: TaskInput): Promise<Task> {
  const supabase = createClient();
  const { data, error } = await supabase.from("tasks").insert(mapTaskToInsert(task)).select("*").single();

  if (error) throw error;
  return mapTaskRowToTask(data);
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
  const supabase = createClient();
  const { data, error } = await supabase.from("tasks").update(mapTaskUpdates(updates)).eq("id", taskId).select("*").single();

  if (error) throw error;
  return mapTaskRowToTask(data);
}

export async function deleteTask(taskId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) throw error;
}
