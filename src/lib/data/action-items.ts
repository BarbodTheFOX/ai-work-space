import { createClient } from "@/lib/supabase/client";
import { createActivityLog } from "@/lib/data/activity";
import { createTask } from "@/lib/data/tasks";
import { mapActionItemRowToActionItem } from "@/lib/data/mappers";
import type { Meeting, MeetingActionItem, Task } from "@/types/ops";

export type ActionItemInput = Omit<MeetingActionItem, "created_at">;

export async function getActionItems(): Promise<MeetingActionItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("meeting_action_items").select("*").order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapActionItemRowToActionItem);
}

export async function createActionItem(item: ActionItemInput): Promise<MeetingActionItem> {
  const supabase = createClient();
  const { data, error } = await supabase.from("meeting_action_items").insert(item).select("*").single();

  if (error) throw error;
  return mapActionItemRowToActionItem(data);
}

export async function updateActionItem(itemId: string, updates: Partial<MeetingActionItem>): Promise<MeetingActionItem> {
  const supabase = createClient();
  const { data, error } = await supabase.from("meeting_action_items").update(updates).eq("id", itemId).select("*").single();

  if (error) throw error;
  return mapActionItemRowToActionItem(data);
}

export async function deleteActionItem(itemId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("meeting_action_items").delete().eq("id", itemId);

  if (error) throw error;
}

export async function convertActionItemToTask({
  item,
  meeting,
  createdBy,
  taskId,
}: {
  item: MeetingActionItem;
  meeting: Meeting;
  createdBy: string;
  taskId: string;
}): Promise<{ task: Task; actionItem: MeetingActionItem }> {
  const task = await createTask({
    id: taskId,
    title: item.title,
    description: `Converted from meeting: ${meeting.title}`,
    owner_id: item.owner_id,
    created_by: createdBy,
    project_id: meeting.project_id,
    priority: "normal",
    status: "todo",
    deadline: item.deadline,
    timeframe: "one_time",
    progress: 0,
    source: "meeting",
  });
  const actionItem = await updateActionItem(item.id, { task_id: task.id, status: "converted" });
  await createActivityLog({
    user_id: createdBy,
    action: "converted action item to task",
    entity_type: "task",
    entity_id: task.id,
    metadata: { meeting: meeting.title },
  });

  return { task, actionItem };
}
