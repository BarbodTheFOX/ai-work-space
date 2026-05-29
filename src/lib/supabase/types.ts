export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Role = "founder" | "assistant";
type ProjectStatus = "active" | "paused" | "completed" | "archived";
type TaskStatus = "todo" | "in_progress" | "waiting" | "review" | "done" | "blocked";
type Priority = "low" | "normal" | "high" | "urgent";
type Timeframe = "daily" | "weekly" | "monthly" | "one_time";
type TaskSource = "manual" | "meeting" | "ai";
type NoteType = "general" | "content_brief" | "idea" | "decision" | "internal_documentation" | "meeting_related";
type RoutineFrequency = "daily" | "weekly" | "monthly";
type RoutineCompletionStatus = "done" | "skipped" | "missed";
type MeetingActionStatus = "suggested" | "approved" | "converted" | "dismissed";
type AiOutputType = "extract_tasks" | "summarize_meeting" | "daily_briefing" | "founder_briefing" | "weekly_summary";

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  display_name: string;
  role: Role;
  operational_area: string;
  avatar: string;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type TaskRow = {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_by: string;
  project_id: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string | null;
  timeframe: Timeframe;
  progress: number;
  source: TaskSource;
  created_at: string;
  updated_at: string;
};

export type MeetingRow = {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  raw_notes: string;
  summary: string;
  decisions: Json;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type MeetingActionItemRow = {
  id: string;
  meeting_id: string;
  task_id: string | null;
  title: string;
  owner_id: string;
  deadline: string;
  status: MeetingActionStatus;
  created_at: string;
  updated_at: string;
};

export type NoteRow = {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  project_id: string | null;
  task_id: string | null;
  meeting_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type RoutineTaskRow = {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  project_id: string;
  frequency: RoutineFrequency;
  priority: Priority;
  active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type RoutineCompletionRow = {
  id: string;
  routine_id: string;
  user_id: string;
  date: string;
  status: RoutineCompletionStatus;
  checked_at: string | null;
  note: string | null;
  created_at: string;
};

export type ActivityLogRow = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Json;
  created_at: string;
};

export type AiOutputRow = {
  id: string;
  input_text: string;
  output_json: Json;
  type: AiOutputType;
  created_by: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, Partial<ProfileRow> & Pick<ProfileRow, "id" | "display_name" | "role">>;
      projects: Table<ProjectRow, Partial<ProjectRow> & Pick<ProjectRow, "name" | "owner_id">>;
      tasks: Table<TaskRow, Partial<TaskRow> & Pick<TaskRow, "title" | "owner_id" | "created_by" | "project_id">>;
      meetings: Table<MeetingRow, Partial<MeetingRow> & Pick<MeetingRow, "title" | "date" | "project_id" | "created_by">>;
      meeting_action_items: Table<
        MeetingActionItemRow,
        Partial<MeetingActionItemRow> & Pick<MeetingActionItemRow, "meeting_id" | "title" | "owner_id" | "deadline">
      >;
      notes: Table<NoteRow, Partial<NoteRow> & Pick<NoteRow, "title" | "content" | "type" | "created_by">>;
      routine_tasks: Table<
        RoutineTaskRow,
        Partial<RoutineTaskRow> & Pick<RoutineTaskRow, "title" | "owner_id" | "project_id" | "created_by">
      >;
      routine_completions: Table<
        RoutineCompletionRow,
        Partial<RoutineCompletionRow> & Pick<RoutineCompletionRow, "routine_id" | "user_id" | "date" | "status">
      >;
      activity_logs: Table<ActivityLogRow, Partial<ActivityLogRow> & Pick<ActivityLogRow, "action" | "entity_type">>;
      ai_outputs: Table<AiOutputRow, Partial<AiOutputRow> & Pick<AiOutputRow, "input_text" | "output_json" | "type" | "created_by">>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      profile_role: Role;
      project_status: ProjectStatus;
      task_status: TaskStatus;
      task_priority: Priority;
      task_timeframe: Timeframe;
      task_source: TaskSource;
      note_type: NoteType;
      routine_frequency: RoutineFrequency;
      routine_completion_status: RoutineCompletionStatus;
      meeting_action_status: MeetingActionStatus;
      ai_output_type: AiOutputType;
    };
    CompositeTypes: Record<string, never>;
  };
};
