alter table public.tasks alter column deadline drop not null;

create index if not exists meeting_action_items_meeting_id_idx on public.meeting_action_items(meeting_id);
create index if not exists meeting_action_items_owner_id_idx on public.meeting_action_items(owner_id);
create index if not exists routine_tasks_owner_id_idx on public.routine_tasks(owner_id);
create index if not exists routine_tasks_project_id_idx on public.routine_tasks(project_id);
create index if not exists ai_outputs_type_idx on public.ai_outputs(type);

-- Auth/profile mapping note:
-- The long-term target is profiles.id references auth.users(id) on delete cascade.
-- This is intentionally not applied here because the current seed data uses
-- deterministic placeholder UUIDs for local Supabase testing before real Auth
-- users exist. Add the foreign key after Auth users are created and profiles
-- are remapped to auth.users.id.
