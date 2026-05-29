export type UserRole = "founder" | "assistant";
export type TaskStatus = "todo" | "in_progress" | "waiting" | "review" | "done" | "blocked";
export type Priority = "low" | "normal" | "high" | "urgent";
export type Timeframe = "daily" | "weekly" | "monthly" | "one_time";
export type TaskSource = "manual" | "meeting" | "ai";
export type ProjectStatus = "active" | "paused" | "completed" | "archived";
export type NoteType =
  | "general"
  | "content_brief"
  | "idea"
  | "decision"
  | "internal_documentation"
  | "meeting_related";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  operationalArea: string;
  status: "online" | "focused" | "offline";
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  created_by: string;
  project_id: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string;
  timeframe: Timeframe;
  progress: number;
  source: TaskSource;
  created_at: string;
  updated_at: string;
};

export type MeetingActionItem = {
  id: string;
  meeting_id: string;
  task_id: string | null;
  title: string;
  owner_id: string;
  deadline: string;
  status: "suggested" | "approved" | "converted" | "dismissed";
  created_at: string;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  raw_notes: string;
  summary: string;
  decisions: string[];
  created_by: string;
  project_id: string;
  created_at: string;
  updated_at: string;
};

export type Note = {
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

export type ActivityLog = {
  id: string;
  user_id: string;
  action: string;
  entity_type: "task" | "project" | "meeting" | "note" | "ai_output" | "routine";
  entity_id: string;
  metadata: Record<string, string>;
  created_at: string;
};

export type AiOutput = {
  id: string;
  input_text: string;
  output_json: unknown;
  type:
    | "extract_tasks"
    | "summarize_meeting"
    | "daily_briefing"
    | "founder_briefing"
    | "weekly_summary";
  created_by: string;
  created_at: string;
};
