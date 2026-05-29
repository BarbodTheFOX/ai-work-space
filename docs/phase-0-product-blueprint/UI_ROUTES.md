# Eventum Ops Cockpit - UI Routes

## Layout Shell

All authenticated application routes use the same shell:

- Left sidebar
- Top command and status bar
- Main content area
- Optional right AI briefing or summary panel

## Sidebar Navigation

- Dashboard
- My Tasks
- Team Tasks
- Projects
- Meetings
- Notes
- AI Assistant
- Reports
- Settings

The sidebar includes the current user profile at the bottom:

- Avatar
- Name
- Role
- Status

## Routes

| Route | Page | Primary User |
| --- | --- | --- |
| `/` | Redirect to dashboard | All users |
| `/dashboard` | Dashboard | Founder |
| `/my-tasks` | My Tasks | Assistants, Founder |
| `/team-tasks` | Team Tasks | Founder, Assistants |
| `/projects` | Projects | All users |
| `/projects/[id]` | Project Detail | All users |
| `/meetings` | Meetings | All users |
| `/meetings/[id]` | Meeting Detail | All users |
| `/notes` | Notes | All users |
| `/notes/[id]` | Note Detail | All users |
| `/ai-assistant` | AI Assistant | All users |
| `/reports` | Reports | Founder |
| `/settings` | Settings | Founder, current user profile |

Authentication routes can be added when auth is implemented:

| Route | Page |
| --- | --- |
| `/login` | Login |
| `/logout` | Logout action |

## Page Structures

### Dashboard

Purpose:

Founder-focused execution cockpit.

Sections:

- Today's execution pulse
- Key counters: active, due today, overdue, review, blocked
- Urgent work list
- Team workload widget
- Project progress widget
- Upcoming deadlines
- Recent decisions
- Activity feed
- AI Founder Briefing panel

Primary actions:

- Create task
- Review waiting tasks
- Open blocked queue
- Generate founder briefing
- Open weekly report

Data needed:

- Tasks
- Projects
- Meetings
- Decisions
- Activity logs
- AI briefing output

### My Tasks

Purpose:

Assistant-focused daily execution page.

Sections:

- Today's tasks
- Suggested focus order
- Weekly tasks
- Overdue tasks
- Waiting for review
- Quick status update controls
- AI daily briefing

Primary actions:

- Start task
- Mark waiting
- Send to review
- Mark done
- Add note
- Generate daily briefing

Data needed:

- Current user
- Current user's tasks
- Related projects
- AI daily briefing output

### Team Tasks

Purpose:

Shared task management.

Sections:

- View switcher: list, board
- Filters
- Task list or task board
- Task detail drawer
- Create task modal

Primary actions:

- Create task
- Edit task
- Assign owner
- Change priority
- Change status
- Change deadline
- Filter tasks

Data needed:

- Tasks
- Users
- Projects

### Projects

Purpose:

Project-level operational overview.

Sections:

- Project cards
- Active task counts
- Completed task counts
- Overdue task counts
- Progress percentage
- Recent activity

Primary actions:

- Open project
- Create project
- Create task in project

Data needed:

- Projects
- Tasks aggregated by project
- Recent activity

### Project Detail

Purpose:

Focused view for one project.

Sections:

- Project header
- Progress overview
- Active tasks
- Overdue tasks
- Completed tasks
- Linked notes
- Related meetings
- Activity timeline

Primary actions:

- Edit project
- Create task
- Add note
- Link meeting

### Meetings

Purpose:

Meeting notes and action-item management.

Sections:

- Meeting list
- Upcoming or recent meetings
- Decisions preview
- Action item counts

Primary actions:

- Create meeting
- Open meeting
- Extract tasks with AI

Data needed:

- Meetings
- Users
- Projects
- Action item counts

### Meeting Detail

Purpose:

Convert raw meeting information into operational records.

Sections:

- Meeting metadata
- Attendees
- Raw notes
- Summary
- Decisions
- Action items
- Linked tasks
- AI extraction preview

Primary actions:

- Edit meeting
- Save raw notes
- Extract tasks with AI
- Confirm suggested tasks
- Convert action item to task
- Link existing task

### Notes

Purpose:

Clean documentation area.

Sections:

- Note filters by type
- Note list
- Linked project/task/meeting indicators
- Note detail drawer or page

Primary actions:

- Create note
- Edit note
- Link to project
- Link to task
- Link to meeting

### AI Assistant

Purpose:

Operational AI workspace, not a generic chatbot.

Sections:

- Chat-style input
- Suggested actions
- Saved prompts
- Structured output preview
- Confirm before creating records
- AI output history

Primary actions:

- Extract tasks
- Summarize meeting
- Generate daily briefing
- Generate founder briefing
- Generate weekly summary
- Approve selected suggestions

### Reports

Purpose:

Execution health for the founder.

Sections:

- Weekly execution rate
- Completed tasks
- Delayed tasks
- Overdue by person
- Workload by assistant
- Project progress
- Review queue
- Blocked tasks
- AI weekly summary

Primary actions:

- Generate weekly summary
- Filter by week
- Export later if needed

### Settings

Purpose:

Simple internal configuration.

Sections:

- Team members
- Roles
- Profile
- Preferences
- AI API configuration placeholder

Primary actions:

- Edit profile
- Edit team member
- Update role
- Save AI configuration placeholder

## UX Flow Priorities

1. Founder opens dashboard and sees operational risk immediately.
2. Assistant opens My Tasks and knows the next best task.
3. Founder or assistant records a meeting and extracts action items.
4. User reviews AI suggestions before creating tasks.
5. Weekly report summarizes execution health.
