import type { Meeting, MeetingActionItem } from "@/types/ops";

export async function getMeetings(): Promise<Meeting[]> {
  return [];
}

export async function createMeeting(_meeting: Omit<Meeting, "id" | "created_by" | "created_at" | "updated_at">): Promise<Meeting> {
  throw new Error("Supabase meeting writes are planned for Phase 3.1.");
}

export async function updateMeeting(_meetingId: string, _updates: Partial<Meeting>): Promise<Meeting> {
  throw new Error("Supabase meeting updates are planned for Phase 3.1.");
}

export async function deleteMeeting(_meetingId: string) {
  throw new Error("Supabase meeting deletes are planned for Phase 3.1.");
}

export async function createActionItem(_item: Omit<MeetingActionItem, "id" | "task_id" | "created_at">): Promise<MeetingActionItem> {
  throw new Error("Supabase action item writes are planned for Phase 3.1.");
}

export async function updateActionItem(_itemId: string, _updates: Partial<MeetingActionItem>): Promise<MeetingActionItem> {
  throw new Error("Supabase action item updates are planned for Phase 3.1.");
}

export async function deleteActionItem(_itemId: string) {
  throw new Error("Supabase action item deletes are planned for Phase 3.1.");
}

export async function convertActionItemToTask(_itemId: string) {
  throw new Error("Supabase action item conversion is planned for Phase 3.1.");
}
