import type { ActivityLog, AiOutput, Meeting, MeetingActionItem, Note, Project, Task, User } from "@/types/ops";
import type { RoutineCompletion, RoutineTask } from "@/types/routines";
import type {
  ActivityLogRow,
  AiOutputRow,
  Json,
  MeetingActionItemRow,
  MeetingRow,
  NoteRow,
  ProfileRow,
  ProjectRow,
  RoutineCompletionRow,
  RoutineTaskRow,
  TaskRow,
} from "@/lib/supabase/types";

export function mapProfileRowToUser(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.display_name,
    email: "",
    role: row.role,
    avatar: row.avatar,
    operationalArea: row.operational_area,
    status: "online",
  };
}

export function mapProjectRowToProject(row: ProjectRow): Project {
  return row;
}

export function mapProjectToInsert(project: Pick<Project, "id" | "name" | "description" | "status" | "owner_id">) {
  return project;
}

export function mapTaskRowToTask(row: TaskRow): Task {
  return {
    ...row,
    deadline: row.deadline ?? "",
  };
}

export function mapTaskToInsert(task: Omit<Task, "created_at" | "updated_at">) {
  return {
    ...task,
    deadline: task.deadline || null,
  };
}

export function mapTaskUpdates(updates: Partial<Task>) {
  return {
    ...updates,
    deadline: updates.deadline === undefined ? undefined : updates.deadline || null,
  };
}

export function mapMeetingRowToMeeting(row: MeetingRow): Meeting {
  return {
    ...row,
    decisions: Array.isArray(row.decisions) ? row.decisions.map(String) : [],
  };
}

export function mapMeetingToInsert(meeting: Omit<Meeting, "created_at" | "updated_at">) {
  return {
    ...meeting,
    decisions: meeting.decisions as Json,
  };
}

export function mapMeetingUpdates(updates: Partial<Meeting>) {
  return {
    ...updates,
    decisions: updates.decisions === undefined ? undefined : (updates.decisions as Json),
  };
}

export function mapActionItemRowToActionItem(row: MeetingActionItemRow): MeetingActionItem {
  return row;
}

export function mapNoteRowToNote(row: NoteRow): Note {
  return row;
}

export function mapRoutineRowToRoutine(row: RoutineTaskRow): RoutineTask {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    owner_id: row.owner_id,
    project_id: row.project_id,
    frequency: row.frequency,
    priority: row.priority,
    active: row.active,
    created_by: row.created_by,
    created_at: row.created_at,
  };
}

export function mapRoutineCompletionRowToCompletion(row: RoutineCompletionRow): RoutineCompletion {
  return row;
}

export function mapActivityRowToActivityLog(row: ActivityLogRow): ActivityLog {
  return {
    id: row.id,
    user_id: row.user_id ?? "",
    action: row.action,
    entity_type: row.entity_type as ActivityLog["entity_type"],
    entity_id: row.entity_id ?? "",
    metadata: typeof row.metadata === "object" && row.metadata !== null && !Array.isArray(row.metadata) ? Object.fromEntries(Object.entries(row.metadata).map(([key, value]) => [key, String(value)])) : {},
    created_at: row.created_at,
  };
}

export function mapActivityLogToInsert(log: Omit<ActivityLog, "id" | "created_at">) {
  return {
    ...log,
    metadata: log.metadata as Json,
  };
}

export function mapAiOutputRowToAiOutput(row: AiOutputRow): AiOutput {
  return row;
}

export function mapAiOutputToInsert(output: Omit<AiOutput, "id" | "created_at">) {
  return {
    ...output,
    output_json: output.output_json as Json,
  };
}
