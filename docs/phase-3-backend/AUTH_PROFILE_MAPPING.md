# Auth Profile Mapping

## Current State

The app has a basic `/login` scaffold using Supabase email/password auth.

Local mode still uses the mock user switcher and does not require Supabase auth.

Supabase mode reads team members from `profiles`.

## Intended Long-Term Model

The preferred production model is:

```sql
profiles.id references auth.users(id) on delete cascade
```

`profiles.role` should be the source of truth for Founder vs Assistant permissions.

## Why The Foreign Key Was Not Added Yet

The current seed data uses deterministic placeholder UUIDs so the database can be tested before real Supabase Auth users exist.

Adding the `auth.users(id)` foreign key before creating real Auth users would break seed/testing.

Phase 3.1 therefore documents the target mapping and leaves the actual foreign key for the auth hardening phase.

## Recommended Setup Flow

1. Create Supabase Auth users for Founder and the three Assistants.
2. Capture each `auth.users.id`.
3. Update or recreate `profiles` rows with those exact IDs.
4. Add a migration that enforces:

```sql
alter table public.profiles
  add constraint profiles_id_auth_users_fk
  foreign key (id) references auth.users(id) on delete cascade;
```

5. Update seed strategy to use real auth user IDs or a documented local-only seed path.

## Current Supabase Mode Behavior

If profiles exist, the provider uses the first profile as the current user after hydration.

If profile/session setup is missing, the provider logs a useful warning and keeps the UI from crashing.

## Not Built Yet

- Signup
- Onboarding
- Protected route middleware
- Full logout navigation
- Role-based route enforcement
