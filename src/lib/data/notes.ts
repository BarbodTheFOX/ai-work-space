import { createClient } from "@/lib/supabase/client";
import { mapNoteRowToNote } from "@/lib/data/mappers";
import type { Note } from "@/types/ops";

export type NoteInput = Omit<Note, "created_at" | "updated_at">;

export async function getNotes(): Promise<Note[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("notes").select("*").order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapNoteRowToNote);
}

export async function createNote(note: NoteInput): Promise<Note> {
  const supabase = createClient();
  const { data, error } = await supabase.from("notes").insert(note).select("*").single();

  if (error) throw error;
  return mapNoteRowToNote(data);
}

export async function updateNote(noteId: string, updates: Partial<Note>): Promise<Note> {
  const supabase = createClient();
  const { data, error } = await supabase.from("notes").update(updates).eq("id", noteId).select("*").single();

  if (error) throw error;
  return mapNoteRowToNote(data);
}

export async function deleteNote(noteId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) throw error;
}
