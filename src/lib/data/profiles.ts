import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types/ops";

export async function getProfiles(): Promise<User[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((profile) => ({
    id: profile.id,
    name: profile.display_name,
    email: "",
    role: profile.role,
    avatar: profile.avatar,
    operationalArea: profile.operational_area,
    status: "online",
  }));
}
