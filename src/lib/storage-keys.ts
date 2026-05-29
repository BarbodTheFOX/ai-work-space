export const STORAGE_PREFIX = "eventum-workspace-os";

export const storageKeys = {
  tasks: `${STORAGE_PREFIX}:tasks`,
  projects: `${STORAGE_PREFIX}:projects`,
  meetings: `${STORAGE_PREFIX}:meetings`,
  actionItems: `${STORAGE_PREFIX}:meeting-action-items`,
  notes: `${STORAGE_PREFIX}:notes`,
  routines: `${STORAGE_PREFIX}:routines`,
  routineCompletions: `${STORAGE_PREFIX}:routine-completions`,
  activityLogs: `${STORAGE_PREFIX}:activity-logs`,
  aiOutputs: `${STORAGE_PREFIX}:ai-outputs`,
} as const;

export const allStorageKeys = Object.values(storageKeys);
