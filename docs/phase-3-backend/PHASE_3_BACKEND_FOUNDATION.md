# Eventum Workspace OS - Phase 3 Backend Foundation

## Goal

Phase 3 adds the Supabase backend foundation without removing the working localStorage workspace.

The migration is staged:

1. Keep `NEXT_PUBLIC_DATA_MODE=local` as the default.
2. Add Supabase clients and environment configuration.
3. Add database schema and seed data.
4. Add a data access layer.
5. Load profiles, projects, and tasks from Supabase when `NEXT_PUBLIC_DATA_MODE=supabase`.
6. Keep meetings, notes, routines, reports, and AI mock behavior local until Phase 3.1.

## Added Backend Foundation

- Supabase browser client for Client Components.
- Supabase server client scaffold for future Server Components and route handlers.
- Initial SQL migration under `supabase/migrations/`.
- Seed SQL under `supabase/seed.sql`.
- Data access layer under `src/lib/data/`.
- Environment example file.
- Basic `/login` auth scaffold.

## Data Mode

Use:

```text
NEXT_PUBLIC_DATA_MODE=local
```

or:

```text
NEXT_PUBLIC_DATA_MODE=supabase
```

Local mode remains the safest default and keeps the Phase 2.5 localStorage behavior.

Supabase mode hydrates:

- profiles
- projects
- tasks
- meetings
- meeting action items
- notes
- routine tasks
- routine completions
- activity logs
- AI outputs

Supabase mode writes:

- task CRUD
- project create/update
- meeting CRUD
- action item CRUD and conversion to task
- note CRUD
- routine CRUD and active toggle
- routine completion upsert/delete
- activity log create
- AI output create as stored records

Local mode remains available and is still the default.

## What Was Intentionally Not Added

- Real AI API calls
- Realtime subscriptions
- Telegram bot
- External integrations
- Billing
- Multi-workspace SaaS logic
- Full auth/protected-route product
- UI redesign

## Quality Check

- `npm run lint` passes.
- `npm run build` passes.
- Local mode remains available.
- Team Tasks Status Board and Monthly Calendar Board remain frontend routes.
