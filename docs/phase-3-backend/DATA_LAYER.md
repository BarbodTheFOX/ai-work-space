# Data Layer

The Phase 3 data access layer lives in:

- `src/lib/data/mode.ts`
- `src/lib/data/profiles.ts`
- `src/lib/data/tasks.ts`
- `src/lib/data/projects.ts`
- `src/lib/data/meetings.ts`
- `src/lib/data/notes.ts`
- `src/lib/data/routines.ts`
- `src/lib/data/reports.ts`
- `src/lib/data/activity.ts`

## Data Mode

`src/lib/data/mode.ts` reads:

```text
NEXT_PUBLIC_DATA_MODE
```

Supported values:

- `local`
- `supabase`

If the value is missing or unknown, the app defaults to `local`.

## Current Supabase Coverage

Implemented in Supabase mode:

- `getProfiles()`
- `getCurrentProfile()`
- `updateProfile()`
- `getProjects()`
- `createProject()`
- `updateProject()`
- `deleteProject()`
- `getTasks()`
- `createTask()`
- `updateTask()`
- `deleteTask()`
- `getMeetings()`
- `createMeeting()`
- `updateMeeting()`
- `deleteMeeting()`
- `getActionItems()`
- `createActionItem()`
- `updateActionItem()`
- `deleteActionItem()`
- `convertActionItemToTask()`
- `getNotes()`
- `createNote()`
- `updateNote()`
- `deleteNote()`
- `getRoutines()`
- `createRoutine()`
- `updateRoutine()`
- `deleteRoutine()`
- `toggleRoutineActive()`
- `getRoutineCompletions()`
- `markRoutineCompletion()`
- `clearRoutineCompletion()`
- `upsertRoutineCompletion()`
- `getActivityLogs()`
- `createActivityLog()`
- `getAiOutputs()`
- `createAiOutput()`

The provider uses these functions when `NEXT_PUBLIC_DATA_MODE=supabase`.

## Current Local Coverage

Local mode still uses the existing localStorage-backed provider behavior.

This preserves:

- local task CRUD
- local meeting CRUD
- local note CRUD
- local project state
- local routine state
- local AI mock suggestions
- local reports

## Planned Phase 3.2 Work

- Make provider mutations explicitly async.
- Add user-visible write failure states.
- Add protected-route behavior once auth/profile mapping is finalized.
- Add query-level report functions if reports become expensive.
