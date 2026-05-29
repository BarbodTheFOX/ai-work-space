import type { Note } from "@/types/ops";

export async function getNotes(): Promise<Note[]> {
  return [];
}

export async function createNote(_note: Omit<Note, "id" | "created_by" | "created_at" | "updated_at">): Promise<Note> {
  throw new Error("Supabase note writes are planned for Phase 3.1.");
}

export async function updateNote(_noteId: string, _updates: Partial<Note>): Promise<Note> {
  throw new Error("Supabase note updates are planned for Phase 3.1.");
}

export async function deleteNote(_noteId: string) {
  throw new Error("Supabase note deletes are planned for Phase 3.1.");
}
