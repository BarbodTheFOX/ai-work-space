"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  actionItems as seededActionItems,
  activityLogs as seededActivityLogs,
  aiOutputs as seededAiOutputs,
  meetings as seededMeetings,
  notes as seededNotes,
  projects as seededProjects,
  tasks as seededTasks,
  TODAY,
  users as seededUsers,
} from "@/data/mock-ops";
import {
  createActionItem as createSupabaseActionItem,
  deleteActionItem as deleteSupabaseActionItem,
  getActionItems,
  updateActionItem as updateSupabaseActionItem,
  convertActionItemToTask as convertSupabaseActionItemToTask,
} from "@/lib/data/action-items";
import { createActivityLog as createSupabaseActivityLog, getActivityLogs } from "@/lib/data/activity";
import { getAiOutputs } from "@/lib/data/ai-outputs";
import { getDataMode } from "@/lib/data/mode";
import {
  createMeeting as createSupabaseMeeting,
  deleteMeeting as deleteSupabaseMeeting,
  getMeetings,
  updateMeeting as updateSupabaseMeeting,
} from "@/lib/data/meetings";
import { createNote as createSupabaseNote, deleteNote as deleteSupabaseNote, getNotes, updateNote as updateSupabaseNote } from "@/lib/data/notes";
import { getProfiles } from "@/lib/data/profiles";
import {
  createProject as createSupabaseProject,
  getProjects as getSupabaseProjects,
  updateProject as updateSupabaseProject,
} from "@/lib/data/projects";
import {
  clearRoutineCompletion as clearSupabaseRoutineCompletion,
  getRoutineCompletions,
  markRoutineCompletion as markSupabaseRoutineCompletion,
} from "@/lib/data/routine-completions";
import {
  createRoutine as createSupabaseRoutine,
  deleteRoutine as deleteSupabaseRoutine,
  getRoutines,
  toggleRoutineActive as toggleSupabaseRoutineActive,
  updateRoutine as updateSupabaseRoutine,
} from "@/lib/data/routines";
import {
  createTask as createSupabaseTask,
  deleteTask as deleteSupabaseTask,
  getTasks as getSupabaseTasks,
  updateTask as updateSupabaseTask,
} from "@/lib/data/tasks";
import { mockRoutineCompletions } from "@/data/mock-routine-completions";
import { mockRoutines } from "@/data/mock-routines";
import { clearLocalData, loadLocalData, saveLocalData } from "@/lib/local-storage";
import { createMockRoutineCompletion } from "@/lib/routine-utils";
import { allStorageKeys, storageKeys } from "@/lib/storage-keys";
import type { RoutineCompletion, RoutineCompletionStatus, RoutineTask } from "@/types/routines";
import type {
  ActivityLog,
  AiOutput,
  Meeting,
  MeetingActionItem,
  Note,
  Priority,
  Project,
  Task,
  TaskStatus,
  User,
} from "@/types/ops";

type CreateTaskInput = Omit<Task, "id" | "created_by" | "created_at" | "updated_at" | "source" | "progress"> &
  Partial<Pick<Task, "id" | "source" | "progress" | "created_by">>;

type CreateProjectInput = Pick<Project, "name" | "description" | "status" | "owner_id">;
type CreateMeetingInput = Pick<Meeting, "title" | "date" | "attendees" | "raw_notes" | "summary" | "decisions" | "project_id">;
type CreateNoteInput = Pick<Note, "title" | "content" | "type" | "project_id" | "task_id" | "meeting_id">;
type CreateRoutineInput = Pick<RoutineTask, "title" | "description" | "owner_id" | "project_id" | "frequency" | "priority">;
type CreateActionItemInput = Omit<MeetingActionItem, "id" | "task_id" | "created_at"> & Partial<Pick<MeetingActionItem, "id" | "task_id">>;

type OpsContextValue = {
  today: string;
  currentUser: User;
  users: User[];
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  actionItems: MeetingActionItem[];
  notes: Note[];
  activityLogs: ActivityLog[];
  aiOutputs: AiOutput[];
  routines: RoutineTask[];
  routineCompletions: RoutineCompletion[];
  setCurrentUserId: (id: string) => void;
  createTask: (task: CreateTaskInput) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  deleteTask: (taskId: string) => void;
  createProject: (project: CreateProjectInput) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  createMeeting: (meeting: CreateMeetingInput) => Meeting;
  updateMeeting: (meetingId: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (meetingId: string) => void;
  createActionItem: (item: CreateActionItemInput) => MeetingActionItem;
  updateActionItem: (itemId: string, updates: Partial<MeetingActionItem>) => void;
  deleteActionItem: (itemId: string) => void;
  convertActionItemToTask: (itemId: string) => Task | null;
  createNote: (note: CreateNoteInput) => Note;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  markRoutine: (routineId: string, status: RoutineCompletionStatus) => void;
  clearRoutine: (routineId: string) => void;
  createRoutine: (routine: CreateRoutineInput) => RoutineTask;
  updateRoutine: (routineId: string, updates: Partial<RoutineTask>) => void;
  deleteRoutine: (routineId: string) => void;
  toggleRoutineActive: (routineId: string) => void;
  createTasksFromAiSuggestions: (suggestions: Array<{ title: string; description?: string; priority?: Priority; deadline?: string; owner_suggestion?: string; timeframe?: Task["timeframe"] }>) => Task[];
  resetLocalWorkspace: () => void;
};

const OpsContext = createContext<OpsContextValue | null>(null);

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function makeRecordId(prefix: string, dataMode: "local" | "supabase") {
  if (dataMode === "supabase" && typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return makeId(prefix);
}

function addTimestamp<T extends object>(value: T) {
  const now = new Date().toISOString();
  return { ...value, created_at: now, updated_at: now };
}

function seedState() {
  return {
    tasks: seededTasks,
    projects: seededProjects,
    meetings: seededMeetings,
    actionItems: seededActionItems,
    notes: seededNotes,
    routines: mockRoutines,
    routineCompletions: mockRoutineCompletions,
    activityLogs: seededActivityLogs,
    aiOutputs: seededAiOutputs,
  };
}

export function OpsProvider({ children }: { children: React.ReactNode }) {
  const dataMode = getDataMode();
  const isSupabase = dataMode === "supabase";
  const seeds = seedState();
  const [hydrated, setHydrated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("user-founder");
  const [localUsers, setLocalUsers] = useState<User[]>(seededUsers);
  const [localTasks, setLocalTasks] = useState<Task[]>(seeds.tasks);
  const [localProjects, setLocalProjects] = useState<Project[]>(seeds.projects);
  const [localMeetings, setLocalMeetings] = useState<Meeting[]>(seeds.meetings);
  const [localActionItems, setLocalActionItems] = useState<MeetingActionItem[]>(seeds.actionItems);
  const [localNotes, setLocalNotes] = useState<Note[]>(seeds.notes);
  const [localRoutines, setLocalRoutines] = useState<RoutineTask[]>(seeds.routines);
  const [localRoutineCompletions, setLocalRoutineCompletions] = useState<RoutineCompletion[]>(seeds.routineCompletions);
  const [localActivityLogs, setLocalActivityLogs] = useState<ActivityLog[]>(seeds.activityLogs);
  const [localAiOutputs, setLocalAiOutputs] = useState<AiOutput[]>(seeds.aiOutputs);

  useEffect(() => {
    async function hydrate() {
      if (isSupabase) {
        try {
          const [
            profiles,
            projects,
            tasks,
            meetings,
            actionItems,
            notes,
            routines,
            routineCompletions,
            activityLogs,
            aiOutputs,
          ] = await Promise.all([
            getProfiles(),
            getSupabaseProjects(),
            getSupabaseTasks(),
            getMeetings(),
            getActionItems(),
            getNotes(),
            getRoutines(),
            getRoutineCompletions(),
            getActivityLogs(),
            getAiOutputs(),
          ]);
          if (profiles.length > 0) {
            setLocalUsers(profiles);
            setCurrentUserId(profiles[0].id);
          }
          setLocalProjects(projects);
          setLocalTasks(tasks);
          setLocalMeetings(meetings);
          setLocalActionItems(actionItems);
          setLocalNotes(notes);
          setLocalRoutines(routines);
          setLocalRoutineCompletions(routineCompletions);
          setLocalActivityLogs(activityLogs);
          setLocalAiOutputs(aiOutputs);
        } catch (error) {
          console.warn("Supabase mode failed to hydrate. Falling back to local seed data.", error);
        } finally {
          setHydrated(true);
        }
        return;
      }

      setLocalUsers(seededUsers);
      setLocalTasks(loadLocalData(storageKeys.tasks, seeds.tasks));
      setLocalProjects(loadLocalData(storageKeys.projects, seeds.projects));
      setLocalMeetings(loadLocalData(storageKeys.meetings, seeds.meetings));
      setLocalActionItems(loadLocalData(storageKeys.actionItems, seeds.actionItems));
      setLocalNotes(loadLocalData(storageKeys.notes, seeds.notes));
      setLocalRoutines(loadLocalData(storageKeys.routines, seeds.routines));
      setLocalRoutineCompletions(loadLocalData(storageKeys.routineCompletions, seeds.routineCompletions));
      setLocalActivityLogs(loadLocalData(storageKeys.activityLogs, seeds.activityLogs));
      setLocalAiOutputs(loadLocalData(storageKeys.aiOutputs, seeds.aiOutputs));
      setHydrated(true);
    }

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupabase]);

  useEffect(() => {
    if (!hydrated || isSupabase) return;
    saveLocalData(storageKeys.tasks, localTasks);
    saveLocalData(storageKeys.projects, localProjects);
    saveLocalData(storageKeys.meetings, localMeetings);
    saveLocalData(storageKeys.actionItems, localActionItems);
    saveLocalData(storageKeys.notes, localNotes);
    saveLocalData(storageKeys.routines, localRoutines);
    saveLocalData(storageKeys.routineCompletions, localRoutineCompletions);
    saveLocalData(storageKeys.activityLogs, localActivityLogs);
    saveLocalData(storageKeys.aiOutputs, localAiOutputs);
  }, [
    hydrated,
    isSupabase,
    localActionItems,
    localActivityLogs,
    localAiOutputs,
    localMeetings,
    localNotes,
    localProjects,
    localRoutineCompletions,
    localRoutines,
    localTasks,
  ]);

  const currentUser = localUsers.find((user) => user.id === currentUserId) ?? localUsers[0] ?? seededUsers[0];

  const logActivity = useCallback((action: string, entity_type: ActivityLog["entity_type"], entity_id: string, metadata: Record<string, string> = {}) => {
    const created: ActivityLog = {
        id: makeRecordId("activity", dataMode),
        user_id: currentUser.id,
        action,
        entity_type,
        entity_id,
        metadata,
        created_at: new Date().toISOString(),
      };
    setLocalActivityLogs((existing) => [created, ...existing]);
    if (isSupabase) {
      createSupabaseActivityLog({
        user_id: created.user_id,
        action,
        entity_type,
        entity_id,
        metadata,
      }).catch((error) => {
        console.warn("Failed to create Supabase activity log.", error);
      });
    }
  }, [currentUser.id, dataMode, isSupabase]);

  const value = useMemo<OpsContextValue>(
    () => ({
      today: TODAY,
      currentUser,
      users: localUsers,
      projects: localProjects,
      tasks: localTasks,
      meetings: localMeetings,
      actionItems: localActionItems,
      notes: localNotes,
      activityLogs: localActivityLogs,
      aiOutputs: localAiOutputs,
      routines: localRoutines,
      routineCompletions: localRoutineCompletions,
      setCurrentUserId,
      createTask: (task) => {
        const now = new Date().toISOString();
        const created: Task = {
          id: task.id ?? makeRecordId("task", dataMode),
          title: task.title,
          description: task.description,
          owner_id: task.owner_id,
          created_by: task.created_by ?? currentUser.id,
          project_id: task.project_id,
          priority: task.priority,
          status: task.status,
          deadline: task.deadline,
          timeframe: task.timeframe,
          progress: task.progress ?? 0,
          source: task.source ?? "manual",
          created_at: now,
          updated_at: now,
        };
        setLocalTasks((existing) => [created, ...existing]);
        logActivity("created task", "task", created.id, { title: created.title });
        if (isSupabase) {
          createSupabaseTask(created).catch((error) => {
            console.warn("Failed to create Supabase task.", error);
          });
        }
        return created;
      },
      updateTask: (taskId, updates) => {
        setLocalTasks((existing) =>
          existing.map((task) => (task.id === taskId ? { ...task, ...updates, updated_at: new Date().toISOString() } : task)),
        );
        logActivity("updated task", "task", taskId);
        if (isSupabase) {
          updateSupabaseTask(taskId, updates).catch((error) => {
            console.warn("Failed to update Supabase task.", error);
          });
        }
      },
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
        if (isSupabase) {
          updateSupabaseTask(taskId, status === "done" ? { status, progress: 100 } : { status }).catch((error) => {
            console.warn("Failed to update Supabase task status.", error);
          });
        }
      },
      updateTaskProgress: (taskId, progress) => {
        setLocalTasks((existing) =>
          existing.map((task) => (task.id === taskId ? { ...task, progress, updated_at: new Date().toISOString() } : task)),
        );
        if (isSupabase) {
          updateSupabaseTask(taskId, { progress }).catch((error) => {
            console.warn("Failed to update Supabase task progress.", error);
          });
        }
      },
      deleteTask: (taskId) => {
        setLocalTasks((existing) => existing.filter((task) => task.id !== taskId));
        logActivity("deleted task", "task", taskId);
        if (isSupabase) {
          deleteSupabaseTask(taskId).catch((error) => {
            console.warn("Failed to delete Supabase task.", error);
          });
        }
      },
      createProject: (project) => {
        const created: Project = { id: makeRecordId("project", dataMode), ...addTimestamp(project) };
        setLocalProjects((existing) => [created, ...existing]);
        logActivity("created project", "project", created.id, { name: created.name });
        if (isSupabase) {
          createSupabaseProject(created).catch((error) => {
            console.warn("Failed to create Supabase project.", error);
          });
        }
        return created;
      },
      updateProject: (projectId, updates) => {
        setLocalProjects((existing) =>
          existing.map((project) => (project.id === projectId ? { ...project, ...updates, updated_at: new Date().toISOString() } : project)),
        );
        if (isSupabase) {
          updateSupabaseProject(projectId, updates).catch((error) => {
            console.warn("Failed to update Supabase project.", error);
          });
        }
      },
      createMeeting: (meeting) => {
        const created: Meeting = {
          id: makeRecordId("meeting", dataMode),
          created_by: currentUser.id,
          ...addTimestamp(meeting),
        };
        setLocalMeetings((existing) => [created, ...existing]);
        logActivity("created meeting", "meeting", created.id, { title: created.title });
        if (isSupabase) {
          createSupabaseMeeting(created).catch((error) => {
            console.warn("Failed to create Supabase meeting.", error);
          });
        }
        return created;
      },
      updateMeeting: (meetingId, updates) => {
        setLocalMeetings((existing) =>
          existing.map((meeting) => (meeting.id === meetingId ? { ...meeting, ...updates, updated_at: new Date().toISOString() } : meeting)),
        );
        if (isSupabase) {
          updateSupabaseMeeting(meetingId, updates).catch((error) => {
            console.warn("Failed to update Supabase meeting.", error);
          });
        }
      },
      deleteMeeting: (meetingId) => {
        setLocalMeetings((existing) => existing.filter((meeting) => meeting.id !== meetingId));
        setLocalActionItems((existing) => existing.filter((item) => item.meeting_id !== meetingId));
        if (isSupabase) {
          deleteSupabaseMeeting(meetingId).catch((error) => {
            console.warn("Failed to delete Supabase meeting.", error);
          });
        }
      },
      createActionItem: (item) => {
        const created: MeetingActionItem = {
          id: item.id ?? makeRecordId("action", dataMode),
          task_id: item.task_id ?? null,
          meeting_id: item.meeting_id,
          title: item.title,
          owner_id: item.owner_id,
          deadline: item.deadline,
          status: item.status,
          created_at: new Date().toISOString(),
        };
        setLocalActionItems((existing) => [created, ...existing]);
        if (isSupabase) {
          createSupabaseActionItem(created).catch((error) => {
            console.warn("Failed to create Supabase action item.", error);
          });
        }
        return created;
      },
      updateActionItem: (itemId, updates) => {
        setLocalActionItems((existing) => existing.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
        if (isSupabase) {
          updateSupabaseActionItem(itemId, updates).catch((error) => {
            console.warn("Failed to update Supabase action item.", error);
          });
        }
      },
      deleteActionItem: (itemId) => {
        setLocalActionItems((existing) => existing.filter((item) => item.id !== itemId));
        if (isSupabase) {
          deleteSupabaseActionItem(itemId).catch((error) => {
            console.warn("Failed to delete Supabase action item.", error);
          });
        }
      },
      convertActionItemToTask: (itemId) => {
        const item = localActionItems.find((entry) => entry.id === itemId);
        const meeting = item ? localMeetings.find((entry) => entry.id === item.meeting_id) : null;
        if (!item || !meeting) return null;
        const now = new Date().toISOString();
        const task: Task = {
          id: makeRecordId("task", dataMode),
          title: item.title,
          description: `Converted from meeting: ${meeting.title}`,
          owner_id: item.owner_id,
          created_by: currentUser.id,
          project_id: meeting.project_id,
          priority: "normal",
          status: "todo",
          deadline: item.deadline,
          timeframe: "one_time",
          progress: 0,
          source: "meeting",
          created_at: now,
          updated_at: now,
        };
        setLocalTasks((existing) => [task, ...existing]);
        setLocalActionItems((existing) =>
          existing.map((entry) => (entry.id === itemId ? { ...entry, task_id: task.id, status: "converted" } : entry)),
        );
        logActivity("converted action item to task", "task", task.id, { meeting: meeting.title });
        if (isSupabase) {
          convertSupabaseActionItemToTask({ item, meeting, createdBy: currentUser.id, taskId: task.id }).catch((error) => {
            console.warn("Failed to convert Supabase action item to task.", error);
          });
        }
        return task;
      },
      createNote: (note) => {
        const created: Note = {
          id: makeRecordId("note", dataMode),
          created_by: currentUser.id,
          ...addTimestamp(note),
        };
        setLocalNotes((existing) => [created, ...existing]);
        logActivity("created note", "note", created.id, { title: created.title });
        if (isSupabase) {
          createSupabaseNote(created).catch((error) => {
            console.warn("Failed to create Supabase note.", error);
          });
        }
        return created;
      },
      updateNote: (noteId, updates) => {
        setLocalNotes((existing) =>
          existing.map((note) => (note.id === noteId ? { ...note, ...updates, updated_at: new Date().toISOString() } : note)),
        );
        if (isSupabase) {
          updateSupabaseNote(noteId, updates).catch((error) => {
            console.warn("Failed to update Supabase note.", error);
          });
        }
      },
      deleteNote: (noteId) => {
        setLocalNotes((existing) => existing.filter((note) => note.id !== noteId));
        if (isSupabase) {
          deleteSupabaseNote(noteId).catch((error) => {
            console.warn("Failed to delete Supabase note.", error);
          });
        }
      },
      markRoutine: (routineId, status) => {
        const routine = localRoutines.find((item) => item.id === routineId);
        if (!routine) return;
        const completion = createMockRoutineCompletion(routine, status, TODAY);
        setLocalRoutineCompletions((existing) => [
          completion,
          ...existing.filter((item) => !(item.routine_id === routineId && item.date === TODAY)),
        ]);
        logActivity(`${status} routine`, "routine", routineId, { status });
        if (isSupabase) {
          markSupabaseRoutineCompletion({ routineId, userId: routine.owner_id, date: TODAY, status }).catch((error) => {
            console.warn("Failed to mark Supabase routine completion.", error);
          });
        }
      },
      clearRoutine: (routineId) => {
        const routine = localRoutines.find((item) => item.id === routineId);
        setLocalRoutineCompletions((existing) =>
          existing.filter((item) => !(item.routine_id === routineId && item.date === TODAY)),
        );
        if (isSupabase && routine) {
          clearSupabaseRoutineCompletion(routineId, routine.owner_id, TODAY).catch((error) => {
            console.warn("Failed to clear Supabase routine completion.", error);
          });
        }
      },
      createRoutine: (routine) => {
        const created: RoutineTask = {
          id: makeRecordId("routine", dataMode),
          active: true,
          created_by: currentUser.id,
          created_at: new Date().toISOString(),
          ...routine,
        };
        setLocalRoutines((existing) => [created, ...existing]);
        logActivity("created routine", "routine", created.id, { title: created.title });
        if (isSupabase) {
          createSupabaseRoutine(created).catch((error) => {
            console.warn("Failed to create Supabase routine.", error);
          });
        }
        return created;
      },
      updateRoutine: (routineId, updates) => {
        setLocalRoutines((existing) => existing.map((routine) => (routine.id === routineId ? { ...routine, ...updates } : routine)));
        if (isSupabase) {
          updateSupabaseRoutine(routineId, updates).catch((error) => {
            console.warn("Failed to update Supabase routine.", error);
          });
        }
      },
      deleteRoutine: (routineId) => {
        setLocalRoutines((existing) => existing.filter((routine) => routine.id !== routineId));
        setLocalRoutineCompletions((existing) => existing.filter((completion) => completion.routine_id !== routineId));
        if (isSupabase) {
          deleteSupabaseRoutine(routineId).catch((error) => {
            console.warn("Failed to delete Supabase routine.", error);
          });
        }
      },
      toggleRoutineActive: (routineId) => {
        const routine = localRoutines.find((item) => item.id === routineId);
        setLocalRoutines((existing) =>
          existing.map((routine) => (routine.id === routineId ? { ...routine, active: !routine.active } : routine)),
        );
        if (isSupabase && routine) {
          toggleSupabaseRoutineActive(routine).catch((error) => {
            console.warn("Failed to toggle Supabase routine.", error);
          });
        }
      },
      createTasksFromAiSuggestions: (suggestions) => {
        const created = suggestions.map((suggestion) => {
          const owner = localUsers.find((user) => user.name === suggestion.owner_suggestion);
          const now = new Date().toISOString();
          return {
            id: makeRecordId("task", dataMode),
            title: suggestion.title,
            description: suggestion.description ?? "Created from approved mock AI suggestion.",
            owner_id: owner?.id ?? currentUser.id,
            created_by: currentUser.id,
            project_id: localProjects[0]?.id ?? "project-general-operations",
            priority: suggestion.priority ?? "normal",
            status: "todo",
            deadline: suggestion.deadline ?? TODAY,
            timeframe: suggestion.timeframe ?? "one_time",
            progress: 0,
            source: "ai",
            created_at: now,
            updated_at: now,
          } satisfies Task;
        });
        setLocalTasks((existing) => [...created, ...existing]);
        if (isSupabase) {
          created.forEach((task) => {
            createSupabaseTask(task).catch((error) => {
              console.warn("Failed to create Supabase AI-suggested task.", error);
            });
          });
        }
        return created;
      },
      resetLocalWorkspace: () => {
        clearLocalData(allStorageKeys);
        const next = seedState();
        setLocalUsers(seededUsers);
        setLocalTasks(next.tasks);
        setLocalProjects(next.projects);
        setLocalMeetings(next.meetings);
        setLocalActionItems(next.actionItems);
        setLocalNotes(next.notes);
        setLocalRoutines(next.routines);
        setLocalRoutineCompletions(next.routineCompletions);
        setLocalActivityLogs(next.activityLogs);
        setLocalAiOutputs(next.aiOutputs);
      },
    }),
    [
      currentUser,
      dataMode,
      isSupabase,
      localUsers,
      localActionItems,
      localActivityLogs,
      localAiOutputs,
      localMeetings,
      localNotes,
      localProjects,
      localRoutineCompletions,
      localRoutines,
      localTasks,
      logActivity,
    ],
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
