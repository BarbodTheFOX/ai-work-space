create extension if not exists pgcrypto;

create type public.profile_role as enum ('founder', 'assistant');
create type public.project_status as enum ('active', 'paused', 'completed', 'archived');
create type public.task_status as enum ('todo', 'in_progress', 'waiting', 'review', 'done', 'blocked');
create type public.task_priority as enum ('low', 'normal', 'high', 'urgent');
create type public.task_timeframe as enum ('daily', 'weekly', 'monthly', 'one_time');
create type public.task_source as enum ('manual', 'meeting', 'ai');
create type public.note_type as enum ('general', 'content_brief', 'idea', 'decision', 'internal_documentation', 'meeting_related');
create type public.routine_frequency as enum ('daily', 'weekly', 'monthly');
create type public.routine_completion_status as enum ('done', 'skipped', 'missed');
create type public.meeting_action_status as enum ('suggested', 'approved', 'converted', 'dismissed');
create type public.ai_output_type as enum ('extract_tasks', 'summarize_meeting', 'daily_briefing', 'founder_briefing', 'weekly_summary');

create table public.profiles (
  id uuid primary key,
  display_name text not null,
  role public.profile_role not null default 'assistant',
  operational_area text not null default '',
  avatar text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  status public.project_status not null default 'active',
  owner_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  owner_id uuid not null references public.profiles(id) on delete restrict,
  created_by uuid not null references public.profiles(id) on delete restrict,
  project_id uuid not null references public.projects(id) on delete cascade,
  priority public.task_priority not null default 'normal',
  status public.task_status not null default 'todo',
  deadline date not null,
  timeframe public.task_timeframe not null default 'one_time',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  source public.task_source not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date timestamptz not null,
  attendees uuid[] not null default '{}',
  raw_notes text not null default '',
  summary text not null default '',
  decisions jsonb not null default '[]'::jsonb,
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meeting_action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  deadline date not null,
  status public.meeting_action_status not null default 'suggested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  type public.note_type not null default 'general',
  project_id uuid references public.projects(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  meeting_id uuid references public.meetings(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.routine_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  owner_id uuid not null references public.profiles(id) on delete restrict,
  project_id uuid not null references public.projects(id) on delete cascade,
  frequency public.routine_frequency not null default 'daily',
  priority public.task_priority not null default 'normal',
  active boolean not null default true,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.routine_completions (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routine_tasks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  status public.routine_completion_status not null,
  checked_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  unique (routine_id, user_id, date)
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.ai_outputs (
  id uuid primary key default gen_random_uuid(),
  input_text text not null default '',
  output_json jsonb not null default '{}'::jsonb,
  type public.ai_output_type not null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index projects_owner_id_idx on public.projects(owner_id);
create index tasks_owner_id_idx on public.tasks(owner_id);
create index tasks_project_id_idx on public.tasks(project_id);
create index tasks_deadline_idx on public.tasks(deadline);
create index meetings_project_id_idx on public.meetings(project_id);
create index notes_project_id_idx on public.notes(project_id);
create index routine_completions_date_idx on public.routine_completions(date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger meetings_updated_at before update on public.meetings for each row execute function public.set_updated_at();
create trigger meeting_action_items_updated_at before update on public.meeting_action_items for each row execute function public.set_updated_at();
create trigger notes_updated_at before update on public.notes for each row execute function public.set_updated_at();
create trigger routine_tasks_updated_at before update on public.routine_tasks for each row execute function public.set_updated_at();

create or replace function public.is_founder()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'founder'
  );
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_action_items enable row level security;
alter table public.notes enable row level security;
alter table public.routine_tasks enable row level security;
alter table public.routine_completions enable row level security;
alter table public.activity_logs enable row level security;
alter table public.ai_outputs enable row level security;

create policy "authenticated can read profiles" on public.profiles for select to authenticated using (true);
create policy "users can update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "founder can manage profiles" on public.profiles for all to authenticated using (public.is_founder()) with check (public.is_founder());

create policy "authenticated can read projects" on public.projects for select to authenticated using (true);
create policy "founder can manage projects" on public.projects for all to authenticated using (public.is_founder()) with check (public.is_founder());

create policy "authenticated can read tasks" on public.tasks for select to authenticated using (true);
create policy "authenticated can create tasks" on public.tasks for insert to authenticated with check (created_by = auth.uid() or public.is_founder());
create policy "founder or related user can update tasks" on public.tasks for update to authenticated using (public.is_founder() or owner_id = auth.uid() or created_by = auth.uid()) with check (public.is_founder() or owner_id = auth.uid() or created_by = auth.uid());
create policy "founder can delete tasks" on public.tasks for delete to authenticated using (public.is_founder());

create policy "authenticated can read meetings" on public.meetings for select to authenticated using (true);
create policy "authenticated can create meetings" on public.meetings for insert to authenticated with check (created_by = auth.uid() or public.is_founder());
create policy "founder or creator can update meetings" on public.meetings for update to authenticated using (public.is_founder() or created_by = auth.uid()) with check (public.is_founder() or created_by = auth.uid());
create policy "founder can delete meetings" on public.meetings for delete to authenticated using (public.is_founder());

create policy "authenticated can read action items" on public.meeting_action_items for select to authenticated using (true);
create policy "authenticated can create action items" on public.meeting_action_items for insert to authenticated with check (public.is_founder() or owner_id = auth.uid());
create policy "founder or owner can update action items" on public.meeting_action_items for update to authenticated using (public.is_founder() or owner_id = auth.uid()) with check (public.is_founder() or owner_id = auth.uid());
create policy "founder can delete action items" on public.meeting_action_items for delete to authenticated using (public.is_founder());

create policy "authenticated can read notes" on public.notes for select to authenticated using (true);
create policy "authenticated can create notes" on public.notes for insert to authenticated with check (created_by = auth.uid() or public.is_founder());
create policy "founder or creator can update notes" on public.notes for update to authenticated using (public.is_founder() or created_by = auth.uid()) with check (public.is_founder() or created_by = auth.uid());
create policy "founder or creator can delete notes" on public.notes for delete to authenticated using (public.is_founder() or created_by = auth.uid());

create policy "authenticated can read routines" on public.routine_tasks for select to authenticated using (true);
create policy "founder can manage routines" on public.routine_tasks for all to authenticated using (public.is_founder()) with check (public.is_founder());

create policy "authenticated can read routine completions" on public.routine_completions for select to authenticated using (true);
create policy "users can mark own routine completions" on public.routine_completions for insert to authenticated with check (user_id = auth.uid());
create policy "users can update own routine completions" on public.routine_completions for update to authenticated using (public.is_founder() or user_id = auth.uid()) with check (public.is_founder() or user_id = auth.uid());
create policy "users can delete own routine completions" on public.routine_completions for delete to authenticated using (public.is_founder() or user_id = auth.uid());

create policy "authenticated can read activity logs" on public.activity_logs for select to authenticated using (true);
create policy "authenticated can create activity logs" on public.activity_logs for insert to authenticated with check (user_id = auth.uid() or public.is_founder());

create policy "authenticated can read ai outputs" on public.ai_outputs for select to authenticated using (true);
create policy "authenticated can create ai outputs" on public.ai_outputs for insert to authenticated with check (created_by = auth.uid() or public.is_founder());
