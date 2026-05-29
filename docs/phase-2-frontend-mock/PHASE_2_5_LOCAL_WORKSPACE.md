# Eventum Ops Cockpit - Phase 2.5 Local Workspace

## Purpose

Phase 2.5 makes the existing frontend mock usable as a local browser workspace before Phase 3 backend work begins.

The app still has no Supabase, no backend API routes, no real authentication, and no real AI calls. All changes are frontend-only and saved to `localStorage`.

## What Became Usable

- Tasks can be created, edited, updated, and deleted by the Founder.
- Task owner, project, status, priority, deadline, timeframe, progress, and description are editable.
- Meetings can be created and edited.
- Meeting decisions and action items can be added, edited, removed, and converted into tasks.
- Notes can be created, edited, linked, and deleted by the owner or Founder.
- Projects can be created and edited by the Founder.
- Routines can be created, edited, activated/deactivated, completed, skipped, and cleared for today.
- AI task suggestions can be approved into local tasks.
- Reports now calculate from the current local workspace state.
- Settings includes a reset action for local workspace data.

## localStorage Strategy

The local persistence layer lives in:

- `src/lib/local-storage.ts`
- `src/lib/storage-keys.ts`

On first load, each collection seeds from mock data. After hydration, changes are saved under Eventum-specific keys.

Persisted collections:

- tasks
- projects
- meetings
- meeting action items
- notes
- routines
- routine completions
- activity logs
- AI mock outputs

This is temporary browser persistence only. Phase 3 should replace it with Supabase-backed persistence.

## Team Tasks Board Changes

Team Tasks no longer shows List View.

The page now supports:

- Status Board
- Calendar Board

Status Board is the default.

## Calendar Board Behavior

Calendar Board is a simple Notion-style weekly board.

- Shows Monday through Sunday columns.
- Uses task `deadline` values to place cards.
- Includes Previous week, Today, and Next week controls.
- Shows undated tasks in a separate No date section.
- Uses existing task cards and opens the existing task drawer.

No external calendar package was added.

## Meeting CRUD Behavior

Meetings can be created locally with:

- title
- date
- project
- attendees
- raw notes

Meeting detail supports:

- editable properties
- raw notes editor
- summary editor
- decisions list
- action items list
- conversion from action item to task
- linked tasks list
- mock AI suggestion import into action items

Converted action items create normal local tasks with `source = "meeting"`.

## Notes CRUD Behavior

Notes can be created and edited locally with:

- title
- type
- content
- linked project
- linked task
- linked meeting

The note detail page remains plain and document-like. There is no rich text editor in Phase 2.5.

## Routine Behavior

Routines remain separate from normal tasks.

Routine completions:

- do not create normal tasks
- are saved separately from tasks
- can be marked done, skipped, or cleared for today
- persist in localStorage

Settings now supports routine creation, editing, activation/deactivation, and deletion for Founder users.

## What Remains Mock-Only

- User authentication
- Permission enforcement beyond local UI checks
- Supabase database persistence
- API routes
- Real AI extraction or summarization
- Realtime dashboard updates
- Report export
- Multi-device sync

## Phase 3 Backend Notes

Phase 3 should move local collections into database tables and API routes:

- Add Supabase schema for tasks, projects, meetings, notes, routine tasks, routine completions, activity logs, and AI outputs.
- Preserve the separation between normal tasks and routine completions.
- Add database-backed action item to task conversion.
- Replace localStorage reset with seed scripts.
- Keep AI suggestions review-first before database writes.
