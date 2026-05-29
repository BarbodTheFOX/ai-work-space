export type DataMode = "local" | "supabase";

export function getDataMode(): DataMode {
  return process.env.NEXT_PUBLIC_DATA_MODE === "supabase" ? "supabase" : "local";
}

export function isSupabaseMode() {
  return getDataMode() === "supabase";
}
