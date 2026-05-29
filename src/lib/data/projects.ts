import { createClient } from "@/lib/supabase/client";
import { mapProjectRowToProject, mapProjectToInsert } from "@/lib/data/mappers";
import type { Project } from "@/types/ops";

type ProjectInput = Pick<Project, "id" | "name" | "description" | "status" | "owner_id">;

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapProjectRowToProject);
}

export async function createProject(project: ProjectInput): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").insert(mapProjectToInsert(project)).select("*").single();

  if (error) throw error;
  return mapProjectRowToProject(data);
}

export async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").update(updates).eq("id", projectId).select("*").single();

  if (error) throw error;
  return mapProjectRowToProject(data);
}

export async function deleteProject(projectId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) throw error;
}
