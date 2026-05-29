# Supabase Testing Checklist

## Local Mode Test

- Set `NEXT_PUBLIC_DATA_MODE=local`.
- Leave Supabase env variables empty.
- Run `npm run dev`.
- Verify `/dashboard`.
- Verify `/team-tasks`.
- Create/edit a task.
- Refresh and confirm localStorage persistence.
- Verify Status Board and Monthly Calendar Board.

## Supabase Env Setup

- Set `NEXT_PUBLIC_SUPABASE_URL`.
- Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Set `NEXT_PUBLIC_DATA_MODE=supabase`.
- Confirm no service-role key is in frontend env files.

## Migration Test

- Apply `001_initial_schema.sql`.
- Apply `002_phase_3_1_fixes.sql`.
- Confirm all tables exist.
- Confirm RLS is enabled.
- Confirm `tasks.deadline` is nullable.

## Seed Test

- Run `supabase/seed.sql`.
- Confirm four profiles exist.
- Confirm seven projects exist.
- Confirm sample tasks, meetings, notes, routines, completions, activity logs, and AI outputs exist.

## Login Test

- Open `/login`.
- Sign in with a Supabase Auth user if one exists.
- Confirm missing credentials produce a clear message and do not crash the app.

## Task CRUD Test

- Open `/team-tasks`.
- Create a task.
- Edit title/status/priority/deadline/progress.
- Delete a task as Founder.
- Confirm changes in Supabase `tasks`.

## Project CRUD Test

- Open `/projects`.
- Create a project as Founder.
- Edit project metadata in project detail.
- Confirm changes in Supabase `projects`.

## Meeting CRUD Test

- Open `/meetings`.
- Create a meeting.
- Edit title/date/project/attendees/raw notes/summary/decisions.
- Confirm changes in Supabase `meetings`.

## Action Item Conversion Test

- Open a meeting detail page.
- Create an action item.
- Edit the action item.
- Convert it to task.
- Confirm a new task exists with `source = meeting`.
- Confirm the action item has `status = converted` and `task_id`.

## Note CRUD Test

- Open `/notes`.
- Create a note.
- Link it to project/task/meeting.
- Edit content.
- Delete if allowed.

## Routine Completion Test

- Open `/my-tasks` or `/dashboard`.
- Mark routine done.
- Mark routine skipped.
- Clear routine completion.
- Confirm `routine_completions` upsert/delete behavior.

## Monthly Calendar Test

- Open `/team-tasks`.
- Switch to Calendar Board.
- Confirm the monthly grid renders.
- Confirm filters still affect calendar tasks.
- Confirm task click opens drawer.
- Confirm no-date tasks show below the calendar.

## Fallback/Error Test

- Set `NEXT_PUBLIC_DATA_MODE=supabase` with missing env values.
- Confirm the app logs a useful warning and does not fully crash.
- Return to `NEXT_PUBLIC_DATA_MODE=local`.
- Confirm local mode still works.
