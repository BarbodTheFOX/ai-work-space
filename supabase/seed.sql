insert into public.profiles (id, display_name, role, operational_area, avatar) values
  ('00000000-0000-0000-0000-000000000001', 'Founder', 'founder', 'Founder / Strategy / Review', 'F'),
  ('00000000-0000-0000-0000-000000000002', 'Assistant 1', 'assistant', 'Publishing & Documentation', 'A1'),
  ('00000000-0000-0000-0000-000000000003', 'Assistant 2', 'assistant', 'Content & Social Ops', 'A2'),
  ('00000000-0000-0000-0000-000000000004', 'Assistant 3', 'assistant', 'Production / Coordination', 'A3')
on conflict (id) do update set
  display_name = excluded.display_name,
  role = excluded.role,
  operational_area = excluded.operational_area,
  avatar = excluded.avatar;

insert into public.projects (id, name, description, status, owner_id) values
  ('10000000-0000-0000-0000-000000000001', 'Eventum YouTube', 'YouTube publishing and production workflow.', 'active', '00000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000002', 'Eventum Instagram', 'Instagram content calendar and publishing.', 'active', '00000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000003', 'Eventum Telegram', 'Telegram publishing plan and daily updates.', 'active', '00000000-0000-0000-0000-000000000003'),
  ('10000000-0000-0000-0000-000000000004', 'Eventum Website', 'Website updates and internal documentation.', 'active', '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000005', 'Purple Evolution', 'Purple Evolution operations and production support.', 'active', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000006', 'Eventum Game', 'Game production coordination.', 'paused', '00000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000007', 'General Operations', 'Team-wide operational work.', 'active', '00000000-0000-0000-0000-000000000001')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  status = excluded.status,
  owner_id = excluded.owner_id;

insert into public.tasks (id, title, description, owner_id, created_by, project_id, priority, status, deadline, timeframe, progress, source) values
  ('20000000-0000-0000-0000-000000000001', 'Prepare Telegram content calendar', 'Create and organize this week Telegram publishing plan.', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'high', 'in_progress', '2026-05-28', 'weekly', 55, 'manual'),
  ('20000000-0000-0000-0000-000000000002', 'Review YouTube upload status', 'Confirm upload state, title, thumbnail, and publish readiness.', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'urgent', 'review', '2026-05-29', 'one_time', 90, 'manual'),
  ('20000000-0000-0000-0000-000000000003', 'Update website documentation index', 'Clean the internal documentation structure and links.', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'normal', 'todo', '2026-05-30', 'one_time', 0, 'manual'),
  ('20000000-0000-0000-0000-000000000004', 'Clear pending meeting action items', 'Review open meeting actions and convert approved items to tasks.', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 'high', 'waiting', '2026-05-29', 'daily', 35, 'meeting')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  owner_id = excluded.owner_id,
  created_by = excluded.created_by,
  project_id = excluded.project_id,
  priority = excluded.priority,
  status = excluded.status,
  deadline = excluded.deadline,
  timeframe = excluded.timeframe,
  progress = excluded.progress,
  source = excluded.source;

insert into public.meetings (id, title, date, attendees, raw_notes, summary, decisions, project_id, created_by) values
  ('30000000-0000-0000-0000-000000000001', 'Weekly Eventum Ops Review', '2026-05-26T10:00:00Z', array['00000000-0000-0000-0000-000000000001'::uuid,'00000000-0000-0000-0000-000000000002'::uuid,'00000000-0000-0000-0000-000000000003'::uuid,'00000000-0000-0000-0000-000000000004'::uuid], 'Reviewed publishing, production, and documentation priorities.', 'Review queue and content calendar need daily attention.', '["Review queue must be cleared daily.", "Telegram calendar is the top social priority."]'::jsonb, '10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001')
on conflict (id) do update set
  title = excluded.title,
  date = excluded.date,
  attendees = excluded.attendees,
  raw_notes = excluded.raw_notes,
  summary = excluded.summary,
  decisions = excluded.decisions,
  project_id = excluded.project_id,
  created_by = excluded.created_by;

insert into public.meeting_action_items (id, meeting_id, task_id, title, owner_id, deadline, status) values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', null, 'Confirm Telegram publishing slots', '00000000-0000-0000-0000-000000000003', '2026-05-29', 'approved'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'Clear pending meeting action items', '00000000-0000-0000-0000-000000000002', '2026-05-29', 'converted')
on conflict (id) do update set
  meeting_id = excluded.meeting_id,
  task_id = excluded.task_id,
  title = excluded.title,
  owner_id = excluded.owner_id,
  deadline = excluded.deadline,
  status = excluded.status;

insert into public.notes (id, title, content, type, project_id, task_id, meeting_id, created_by) values
  ('50000000-0000-0000-0000-000000000001', 'Telegram Weekly Content Brief', 'Draft content themes, posting cadence, and priority reminders for Telegram.', 'content_brief', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', null, '00000000-0000-0000-0000-000000000003'),
  ('50000000-0000-0000-0000-000000000002', 'Weekly Ops Decisions', 'Review queue must be cleared daily. Meeting actions should become tasks after review.', 'decision', '10000000-0000-0000-0000-000000000007', null, '30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002')
on conflict (id) do update set
  title = excluded.title,
  content = excluded.content,
  type = excluded.type,
  project_id = excluded.project_id,
  task_id = excluded.task_id,
  meeting_id = excluded.meeting_id,
  created_by = excluded.created_by;

insert into public.routine_tasks (id, title, description, owner_id, project_id, frequency, priority, active, created_by) values
  ('60000000-0000-0000-0000-000000000001', 'Check today publishing tasks', 'Review today publishing work before execution starts.', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000007', 'daily', 'normal', true, '00000000-0000-0000-0000-000000000001'),
  ('60000000-0000-0000-0000-000000000002', 'Review Telegram posting plan', 'Confirm Telegram posts, timing, and owner notes.', '00000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'daily', 'high', true, '00000000-0000-0000-0000-000000000001'),
  ('60000000-0000-0000-0000-000000000003', 'Check YouTube upload status', 'Confirm production status and review blockers.', '00000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'daily', 'high', true, '00000000-0000-0000-0000-000000000001')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  owner_id = excluded.owner_id,
  project_id = excluded.project_id,
  frequency = excluded.frequency,
  priority = excluded.priority,
  active = excluded.active,
  created_by = excluded.created_by;

insert into public.routine_completions (id, routine_id, user_id, date, status, checked_at, note) values
  ('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '2026-05-29', 'done', '2026-05-29T08:30:00Z', null),
  ('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '2026-05-29', 'skipped', '2026-05-29T09:00:00Z', 'Waiting for final founder priority.')
on conflict (routine_id, user_id, date) do update set
  status = excluded.status,
  checked_at = excluded.checked_at,
  note = excluded.note;

insert into public.activity_logs (id, user_id, action, entity_type, entity_id, metadata) values
  ('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'updated Telegram plan', 'task', '20000000-0000-0000-0000-000000000001', '{"status":"in_progress"}'::jsonb),
  ('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'logged meeting decision', 'meeting', '30000000-0000-0000-0000-000000000001', '{"decision":"Review queue must be cleared daily."}'::jsonb)
on conflict (id) do update set
  user_id = excluded.user_id,
  action = excluded.action,
  entity_type = excluded.entity_type,
  entity_id = excluded.entity_id,
  metadata = excluded.metadata;

insert into public.ai_outputs (id, input_text, output_json, type, created_by) values
  ('90000000-0000-0000-0000-000000000001', 'Founder dashboard context', '{"briefing":"Today has urgent review items and routine follow-up work.","recommended_actions":["Review tasks in review","Clear meeting action queue"]}'::jsonb, 'founder_briefing', '00000000-0000-0000-0000-000000000001'),
  ('90000000-0000-0000-0000-000000000002', 'Need Telegram calendar and YouTube upload status.', '{"tasks":[{"title":"Prepare Telegram content calendar","owner_suggestion":"Assistant 2","priority":"high","deadline":"2026-05-28","timeframe":"weekly"}],"risks":["YouTube publishing may slip if review is delayed."]}'::jsonb, 'extract_tasks', '00000000-0000-0000-0000-000000000001')
on conflict (id) do update set
  input_text = excluded.input_text,
  output_json = excluded.output_json,
  type = excluded.type,
  created_by = excluded.created_by;

-- Auth note:
-- These profile IDs are placeholders for seed/demo use.
-- In a real Supabase project, create Auth users first, then update profile ids
-- or insert matching profile rows using auth.users.id after sign-up.
