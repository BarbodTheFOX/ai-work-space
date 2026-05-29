import { createClient } from "@/lib/supabase/client";
import { mapMeetingRowToMeeting, mapMeetingToInsert, mapMeetingUpdates } from "@/lib/data/mappers";
import type { Meeting } from "@/types/ops";

export type MeetingInput = Omit<Meeting, "created_at" | "updated_at">;

export async function getMeetings(): Promise<Meeting[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("meetings").select("*").order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMeetingRowToMeeting);
}

export async function createMeeting(meeting: MeetingInput): Promise<Meeting> {
  const supabase = createClient();
  const { data, error } = await supabase.from("meetings").insert(mapMeetingToInsert(meeting)).select("*").single();

  if (error) throw error;
  return mapMeetingRowToMeeting(data);
}

export async function updateMeeting(meetingId: string, updates: Partial<Meeting>): Promise<Meeting> {
  const supabase = createClient();
  const { data, error } = await supabase.from("meetings").update(mapMeetingUpdates(updates)).eq("id", meetingId).select("*").single();

  if (error) throw error;
  return mapMeetingRowToMeeting(data);
}

export async function deleteMeeting(meetingId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("meetings").delete().eq("id", meetingId);

  if (error) throw error;
}
