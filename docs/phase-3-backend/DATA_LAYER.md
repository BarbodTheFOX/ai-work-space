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
- `getProjects()`
- `getTasks()`
- `createTask()`
- `updateTask()`
- `deleteTask()`

The provider uses those functions when `NEXT_PUBLIC_DATA_MODE=supabase`.

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

## Planned Phase 3.1 Work

Move these from local/fallback behavior to Supabase-backed functions:

- meetings
- meeting action items
- notes
- routine tasks
- routine completions
- activity logs
- reports queries

Keep the `useOps()` API stable while migrating each module.
