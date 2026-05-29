# RLS Policies

Row Level Security is enabled on all Phase 3 tables.

## Current Policy Direction

The first pass keeps security practical for a private 4-person internal tool.

Authenticated users can read internal operational data.

Founder users can manage:

- profiles
- projects
- tasks
- meetings
- action items
- notes
- routine definitions

Assistants can:

- create tasks
- update tasks assigned to them or created by them
- create meetings
- update meetings they created
- create notes
- update/delete notes they created
- create/update/delete their own routine completions
- create activity logs for their own actions

## Founder Check

The migration defines:

```sql
public.is_founder()
```

This checks `profiles.role` for the current `auth.uid()`.

## Known Tightening Needed

Phase 3.2 should tighten and test:

- exact meeting attendee update rules
- project-level edit permissions
- note visibility by linked entity if needed
- AI output creation/update rules
- activity log insert rules
- protected route behavior in Next.js
- project delete exposure in UI
- Auth profile foreign key after real Auth users exist

## Service Role Rule

The service-role key must never be exposed in frontend code. The app only uses the Supabase publishable key client-side.
