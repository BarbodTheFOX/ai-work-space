export type RoutineFrequency = "daily" | "weekly" | "monthly";

export type RoutineCompletionStatus = "done" | "skipped" | "missed";

export type RoutineTask = {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  project_id: string;
  frequency: RoutineFrequency;
  priority: "low" | "normal" | "high" | "urgent";
  active: boolean;
  created_by: string;
  created_at: string;
};

export type RoutineCompletion = {
  id: string;
  routine_id: string;
  user_id: string;
  date: string;
  status: RoutineCompletionStatus;
  checked_at: string | null;
  note: string | null;
};

export type RoutineTodayState = "pending" | RoutineCompletionStatus;

export type RoutineSummary = {
  completedToday: number;
  pendingToday: number;
  missedToday: number;
  skippedToday: number;
  completionRate: number;
};
