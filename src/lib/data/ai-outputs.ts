import { createClient } from "@/lib/supabase/client";
import { mapAiOutputRowToAiOutput, mapAiOutputToInsert } from "@/lib/data/mappers";
import type { AiOutput } from "@/types/ops";

export async function getAiOutputs(): Promise<AiOutput[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("ai_outputs").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapAiOutputRowToAiOutput);
}

export async function createAiOutput(output: Omit<AiOutput, "id" | "created_at">): Promise<AiOutput> {
  const supabase = createClient();
  const { data, error } = await supabase.from("ai_outputs").insert(mapAiOutputToInsert(output)).select("*").single();

  if (error) throw error;
  return mapAiOutputRowToAiOutput(data);
}
