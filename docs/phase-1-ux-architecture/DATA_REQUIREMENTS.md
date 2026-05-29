# Eventum Ops Cockpit - Data Requirements

## Phase 2 Mock Data Principles

- Use local mock data only.
- No Supabase.
- No API routes.
- No auth.
- Current user is selected through `UserSwitcherMock`.
- Mock data should include Founder, Assistant 1, Assistant 2, and Assistant 3.

## Shared Mock Entities

Users:

- id, name, email, role, avatar, operational_area, status

Projects:

- id, name, description, status, owner_id, created_at, updated_at

Tasks:

- id, title, description, owner_id, created_by, project_id, priority, status, deadline, timeframe, progress, source, created_at, updated_at

Meetings:

- id, title, date, attendees, raw_notes, summary, decisions, created_by, project_id, created_at, updated_at

Meeting action items:

- id, meeting_id, task_id, title, owner_id, deadline, status, created_at

Notes:

- id, title, content, type, project_id, task_id, meeting_id, created_by, created_at, updated_at

Activity logs:

- id, user_id, action, entity_type, entity_id, metadata, created_at

AI outputs:

- id, input_text, output_json, type, created_by, created_at

Routine tasks:

- id, title, description, owner_id, project_id, frequency, priority, active, created_by, created_at

Routine completions:

- id, routine_id, user_id, date, status, checked_at, note

## Dashboard

Required entities:

- tasks, users, projects, meetings, activity_logs, ai_outputs
- routine tasks, routine completions

Fields needed:

- task status, priority, deadline, owner_id, project_id, progress, source
- project name and status
- user name, avatar, role
- meeting decisions and date

Computed values:

- active task count
- due today count
- overdue count
- review count
- blocked count
- workload by user
- project progress
- upcoming deadlines
- recent decisions
- routine completion state for today
- routine completion rate

Filters needed:

- owner, project, status, timeframe

Mock data needed:

- At least 18 tasks across all statuses.
- At least 2 overdue tasks.
- At least 2 review tasks.
- At least 1 blocked task.
- Recent decisions from meetings.
- Active team routines and today's completion examples.

## My Tasks

Required entities:

- current user, tasks, projects, comments, ai_outputs
- routine tasks, routine completions

Fields needed:

- task title, deadline, priority, status, progress, timeframe, project_id
- project name

Computed values:

- today tasks
- weekly tasks
- overdue tasks
- waiting for review
- suggested focus order
- current user's active daily routines
- routine completion state for today

Filters needed:

- current user owner_id
- status
- timeframe
- due today
- overdue

Mock data needed:

- Each assistant should have daily, weekly, overdue, and review-ready examples.
- Each assistant should have active routine examples for My Daily Routines.

## Team Tasks

Required entities:

- tasks, users, projects, comments

Fields needed:

- all task fields
- owner name/avatar
- project name

Computed values:

- board columns by status
- filtered counts
- overdue flag
- due today flag

Filters needed:

- owner, priority, status, project, timeframe, due today, overdue, review, blocked

Mock data needed:

- Enough tasks to fill list and board views.

## Projects

Required entities:

- projects, tasks, users, activity_logs

Fields needed:

- project id, name, description, status, owner_id
- task status, deadline, progress
- owner display info

Computed values:

- active tasks
- completed tasks
- overdue tasks
- progress percentage
- recent activity

Filters needed:

- project status

Mock data needed:

- Seven initial Eventum projects.

## Project Detail

Required entities:

- project, users, tasks, notes, meetings, activity_logs

Fields needed:

- project details
- related task fields
- linked note titles/types
- related meeting titles/dates

Computed values:

- project progress
- active/done/overdue counts
- activity timeline

Filters needed:

- task status
- note type

Mock data needed:

- Each major project should have at least 2 tasks and 1 activity item.

## Meetings

Required entities:

- meetings, users, projects, meeting_action_items

Fields needed:

- title, date, attendees, project_id, summary, decisions
- action item count and converted count

Computed values:

- open action items
- recent decisions

Filters needed:

- project, attendee, date range

Mock data needed:

- At least 3 meetings with raw notes, decisions, and action items.

## Meeting Detail

Required entities:

- meeting, users, project, meeting_action_items, tasks, ai_outputs

Fields needed:

- meeting metadata
- attendee display info
- raw_notes, summary, decisions
- action item owner/deadline/status
- linked task fields

Computed values:

- unconverted action items
- linked task count

Filters needed:

- action item status

Mock data needed:

- One meeting with rich raw notes for AI review mock.

## Notes

Required entities:

- notes, users, projects, tasks, meetings

Fields needed:

- note title, content preview, type, created_by, created_at
- linked entity names

Computed values:

- notes by type
- linked entity labels

Filters needed:

- type, project, task, meeting, author

Mock data needed:

- At least 8 notes across all note types.

## Note Detail

Required entities:

- note, creator user, linked project, linked task, linked meeting

Fields needed:

- full note content
- metadata
- linked entity details

Computed values:

- linked context summary

Filters needed:

- None on detail page

Mock data needed:

- Notes with and without linked entities.

## AI Assistant

Required entities:

- current user, users, projects, tasks, meetings, ai_outputs

Fields needed:

- source text
- structured task suggestions
- meeting summary suggestions
- suggestion state
- confidence

Computed values:

- approved suggestion count
- rejected suggestion count
- review queue

Filters needed:

- AI output type
- suggestion state

Mock data needed:

- Text-to-task example.
- Meeting summary example.
- Founder briefing example.
- Daily briefing example.

## Reports

Required entities:

- tasks, users, projects, ai_outputs

Fields needed:

- task status, deadline, owner_id, project_id, created_at, updated_at
- project name/status
- user name/role

Computed values:

- weekly execution rate
- completed tasks
- delayed tasks
- overdue by person
- workload by assistant
- project progress
- review queue
- blocked tasks
- routine completion rate
- missed routines
- completed routines by user
- routine consistency this week

Filters needed:

- week range
- owner
- project

Mock data needed:

- At least one current-week report and one previous-week comparison.
- Current-week routine completion data across all users.

## Settings

Required entities:

- current user, users, roles, preferences mock
- routine tasks

Fields needed:

- user name, email, role, avatar, status
- role name and description
- task creation preference
- AI API placeholder status
- routine title, owner_id, project_id, frequency, priority, active

Computed values:

- None required

Filters needed:

- None

Mock data needed:

- Four team members and role descriptions.
- Routine definitions for Founder mock-create and active/inactive toggle behavior.
