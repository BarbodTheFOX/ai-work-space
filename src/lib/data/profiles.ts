import { createClient } from "@/lib/supabase/client";
import { mapProfileRowToUser } from "@/lib/data/mappers";
import type { User } from "@/types/ops";

export async function getProfiles(): Promise<User[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapProfileRowToUser);
}

export async function getCurrentProfile(): Promise<User | null> {
  const supabase = createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getUser();

  if (sessionError) throw sessionError;
  if (!sessionData.user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", sessionData.user.id).single();

  if (error) throw error;
  return data ? mapProfileRowToUser(data) : null;
}

export async function updateProfile(profileId: string, updates: Partial<Pick<User, "name" | "role" | "avatar" | "operationalArea">>): Promise<User> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: updates.name,
      role: updates.role,
      avatar: updates.avatar,
      operational_area: updates.operationalArea,
    })
    .eq("id", profileId)
    .select("*")
    .single();

  if (error) throw error;
  return mapProfileRowToUser(data);
}
