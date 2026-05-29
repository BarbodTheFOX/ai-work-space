import type {
  RoutineCompletion,
  RoutineCompletionStatus,
  RoutineSummary,
  RoutineTask,
} from "../types/routines";

export function getRoutineCompletionForDate(
  routineId: string,
  date: string,
  completions: RoutineCompletion[],
) {
  return completions.find(
    (completion) => completion.routine_id === routineId && completion.date === date,
  );
}

export function getActiveRoutinesForUser(routines: RoutineTask[], userId: string) {
  return routines.filter((routine) => routine.active && routine.owner_id === userId);
}

export function createMockRoutineCompletion(
  routine: RoutineTask,
  status: RoutineCompletionStatus,
  date: string,
) {
  return {
    id: `completion-${routine.id}-${date}`,
    routine_id: routine.id,
    user_id: routine.owner_id,
    date,
    status,
    checked_at: new Date().toISOString(),
    note: null,
  } satisfies RoutineCompletion;
}

export function summarizeRoutineCompletions(
  routines: RoutineTask[],
  completions: RoutineCompletion[],
  date: string,
): RoutineSummary {
  const activeRoutines = routines.filter((routine) => routine.active);
  const todayCompletions = activeRoutines
    .map((routine) => getRoutineCompletionForDate(routine.id, date, completions))
    .filter((completion): completion is RoutineCompletion => Boolean(completion));

  const completedToday = todayCompletions.filter(
    (completion) => completion.status === "done",
  ).length;
  const skippedToday = todayCompletions.filter(
    (completion) => completion.status === "skipped",
  ).length;
  const missedToday = todayCompletions.filter(
    (completion) => completion.status === "missed",
  ).length;
  const pendingToday = Math.max(activeRoutines.length - todayCompletions.length, 0);
  const completionRate =
    activeRoutines.length === 0
      ? 0
      : Math.round((completedToday / activeRoutines.length) * 100);

  return {
    completedToday,
    pendingToday,
    missedToday,
    skippedToday,
    completionRate,
  };
}
