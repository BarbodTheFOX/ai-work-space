"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { actionItems, activityLogs, aiOutputs, meetings, notes, projects, tasks as seededTasks, TODAY, users } from "@/data/mock-ops";
import { mockRoutineCompletions } from "@/data/mock-routine-completions";
import { mockRoutines } from "@/data/mock-routines";
import { createMockRoutineCompletion } from "@/lib/routine-utils";
import type { RoutineCompletion, RoutineCompletionStatus, RoutineTask } from "@/types/routines";
import type { Note, Task, TaskStatus, User } from "@/types/ops";

type OpsContextValue = {
  today: string;
  currentUser: User;
  users: typeof users;
  projects: typeof projects;
  tasks: Task[];
  meetings: typeof meetings;
  actionItems: typeof actionItems;
  notes: Note[];
  activityLogs: typeof activityLogs;
  aiOutputs: typeof aiOutputs;
  routines: RoutineTask[];
  routineCompletions: RoutineCompletion[];
  setCurrentUserId: (id: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  createTask: (task: Pick<Task, "title" | "description" | "owner_id" | "project_id" | "priority" | "deadline" | "timeframe">) => void;
  markRoutine: (routineId: string, status: RoutineCompletionStatus) => void;
  clearRoutine: (routineId: string) => void;
  toggleRoutineActive: (routineId: string) => void;
  createRoutine: (routine: Pick<RoutineTask, "title" | "description" | "owner_id" | "project_id" | "frequency" | "priority">) => void;
};

const OpsContext = createContext<OpsContextValue | null>(null);

export function OpsProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState("user-founder");
  const [localTasks, setLocalTasks] = useState<Task[]>(seededTasks);
  const [localRoutines, setLocalRoutines] = useState<RoutineTask[]>(mockRoutines);
  const [localRoutineCompletions, setLocalRoutineCompletions] = useState<RoutineCompletion[]>(mockRoutineCompletions);

  const currentUser = users.find((user) => user.id === currentUserId) ?? users[0];

  const value = useMemo<OpsContextValue>(
    () => ({
      today: TODAY,
      currentUser,
      users,
      projects,
      tasks: localTasks,
      meetings,
      actionItems,
      notes,
      activityLogs,
      aiOutputs,
      routines: localRoutines,
      routineCompletions: localRoutineCompletions,
      setCurrentUserId,
      updateTaskStatus: (taskId, status) => {
        setLocalTasks((existing) =>
          existing.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status,
                  progress: status === "done" ? 100 : task.progress,
                  updated_at: new Date().toISOString(),
                }
              : task,
          ),
        );
      },
      updateTaskProgress: (taskId, progress) => {
        setLocalTasks((existing) =>
          existing.map((task) =>
            task.id === taskId ? { ...task, progress, updated_at: new Date().toISOString() } : task,
          ),
        );
      },
      createTask: (task) => {
        setLocalTasks((existing) => [
          {
            id: `task-local-${existing.length + 1}`,
            created_by: currentUser.id,
            status: "todo",
            progress: 0,
            source: "manual",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...task,
          },
          ...existing,
        ]);
      },
      markRoutine: (routineId, status) => {
        const routine = localRoutines.find((item) => item.id === routineId);
        if (!routine) return;
        const completion = createMockRoutineCompletion(routine, status, TODAY);
        setLocalRoutineCompletions((existing) => [
          completion,
          ...existing.filter((item) => !(item.routine_id === routineId && item.date === TODAY)),
        ]);
      },
      clearRoutine: (routineId) => {
        setLocalRoutineCompletions((existing) =>
          existing.filter((item) => !(item.routine_id === routineId && item.date === TODAY)),
        );
      },
      toggleRoutineActive: (routineId) => {
        setLocalRoutines((existing) =>
          existing.map((routine) => (routine.id === routineId ? { ...routine, active: !routine.active } : routine)),
        );
      },
      createRoutine: (routine) => {
        setLocalRoutines((existing) => [
          {
            id: `routine-local-${existing.length + 1}`,
            active: true,
            created_by: currentUser.id,
            created_at: new Date().toISOString(),
            ...routine,
          },
          ...existing,
        ]);
      },
    }),
    [currentUser, localRoutineCompletions, localRoutines, localTasks],
  );

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps() {
  const context = useContext(OpsContext);
  if (!context) {
    throw new Error("useOps must be used inside OpsProvider");
  }
  return context;
}
