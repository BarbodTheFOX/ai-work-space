import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/ops";

type ProjectInput = Pick<Project, "name" | "description" | "status" | "owner_id">;

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createProject(project: ProjectInput): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").insert(project).select("*").single();

  if (error) throw error;
  return data;
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").update(updates).eq("id", projectId).select("*").single();

  if (error) throw error;
  return data;
}
