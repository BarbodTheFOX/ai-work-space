# Database Schema

The initial Supabase schema is defined in:

- `supabase/migrations/001_initial_schema.sql`

## Tables

- `profiles`
- `projects`
- `tasks`
- `meetings`
- `meeting_action_items`
- `notes`
- `routine_tasks`
- `routine_completions`
- `activity_logs`
- `ai_outputs`

## Core Design

- UUID primary keys are used for persisted records.
- `created_at` is included across all core tables.
- `updated_at` is included where records are edited.
- A shared trigger keeps `updated_at` current.
- Routine completions are separate from normal tasks.
- Meeting action items can link to converted tasks.
- AI outputs store structured JSON only.
- `tasks.deadline` is nullable after `002_phase_3_1_fixes.sql` so the Monthly Calendar Board can support No Date tasks.

## Enums

The migration creates enums for:

- profile role
- project status
- task status
- task priority
- task timeframe
- task source
- note type
- routine frequency
- routine completion status
- meeting action item status
- AI output type

## Auth User Mapping

The `profiles.id` column is a UUID intended to match `auth.users.id`.

For seed/demo data, placeholder UUIDs are inserted directly. In a real Supabase project, create Auth users first, then map or insert matching profile rows using those Auth user IDs.

See [Auth Profile Mapping](./AUTH_PROFILE_MAPPING.md).
