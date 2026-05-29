# Setup Supabase

## 1. Create Project

Create a Supabase project for the private Eventum internal workspace.

Do not use a service-role key in frontend code.

## 2. Environment Variables

Copy `.env.example` to `.env.local` and fill:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_DATA_MODE=local
```

Keep local mode while setting up the database.

Switch to Supabase mode only when migrations and seed data are ready:

```text
NEXT_PUBLIC_DATA_MODE=supabase
```

## 3. Run Migration

Apply:

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_phase_3_1_fixes.sql
```

You can run it through the Supabase SQL editor or with the Supabase CLI if the project is linked.

## 4. Run Seed Data

Apply:

```text
supabase/seed.sql
```

The seed uses placeholder UUIDs for the four team members.

## 5. Auth User Mapping

For a real auth setup:

1. Create Supabase Auth users for Founder and the three Assistants.
2. Update or recreate `profiles` rows so `profiles.id` matches each `auth.users.id`.
3. Keep `profiles.role` as the source of founder/assistant permission logic.

## 6. Start App

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

## 7. What Works In Supabase Mode Now

When `NEXT_PUBLIC_DATA_MODE=supabase` and a valid Supabase project is configured:

- profiles load from Supabase
- projects load/create/update from Supabase
- tasks load/create/update/delete from Supabase
- meetings load/create/update/delete from Supabase
- action items load/create/update/delete from Supabase
- action items convert to tasks in Supabase
- notes load/create/update/delete from Supabase
- routines load/create/update/delete/toggle from Supabase
- routine completions upsert/delete in Supabase
- activity logs load/create from Supabase
- AI outputs load/create as stored mock records

## 8. What Remains Local Or Mock-Only

- AI suggestions
- realtime
- protected app route enforcement
- user-visible Supabase write error states

These should move in Phase 3.1.
