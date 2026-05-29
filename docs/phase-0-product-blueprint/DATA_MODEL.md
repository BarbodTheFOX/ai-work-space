# Eventum Ops Cockpit - Data Model

## Data Modeling Principles

- Structured operational data comes first.
- AI output is stored separately from approved records.
- Suggestions become real tasks only after user confirmation.
- Keep permissions simple for a private 4-person team.
- Prefer explicit fields over unstructured metadata for core workflows.

## Entity Overview

Core entities:

- users
- roles
- projects
- tasks
- notes
- meetings
- meeting_action_items
- comments
- ai_outputs
- activity_logs

## Tables

### roles

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | founder, assistant |
| description | text | Role summary |
| created_at | timestamptz | Creation timestamp |

### users

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | Display name |
| email | text | Unique email |
| role | text | founder or assistant |
| avatar | text | Avatar URL or initials fallback |
| created_at | timestamptz | Creation timestamp |

Future Supabase Auth note:

- `users.id` can map to `auth.users.id` when authentication is implemented.

### projects

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| name | text | Project name |
| description | text | Project description |
| status | text | active, paused, completed, archived |
| owner_id | uuid | References users.id |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

Initial project records:

- Eventum YouTube
- Eventum Instagram
- Eventum Telegram
- Eventum Website
- Purple Evolution
- Eventum Game
- General Operations

### tasks

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| title | text | Required |
| description | text | Optional detail |
| owner_id | uuid | References users.id |
| created_by | uuid | References users.id |
| project_id | uuid | References projects.id |
| priority | text | low, normal, high, urgent |
| status | text | todo, in_progress, waiting, review, done, blocked |
| deadline | date | Due date |
| timeframe | text | daily, weekly, monthly, one_time |
| progress | integer | 0-100 |
| source | text | manual, meeting, ai |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

Recommended constraints:

- `progress` between 0 and 100.
- `priority` limited to allowed values.
- `status` limited to allowed values.
- `timeframe` limited to allowed values.
- `source` limited to allowed values.

### meetings

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| title | text | Required |
| date | timestamptz | Meeting date and time |
| attendees | uuid[] | User IDs in early version, join table later if needed |
| raw_notes | text | Raw meeting notes |
| summary | text | Human or AI-assisted summary |
| decisions | jsonb | Array of decision strings or objects |
| created_by | uuid | References users.id |
| project_id | uuid | Optional reference to projects.id |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### meeting_action_items

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| meeting_id | uuid | References meetings.id |
| task_id | uuid | Optional reference to tasks.id after conversion |
| title | text | Action item title |
| owner_id | uuid | Suggested or assigned owner |
| deadline | date | Suggested or assigned deadline |
| status | text | suggested, approved, converted, dismissed |
| created_at | timestamptz | Creation timestamp |

### notes

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| title | text | Required |
| content | text | Note body |
| type | text | general, content_brief, idea, decision, internal_documentation, meeting_related |
| project_id | uuid | Optional reference to projects.id |
| task_id | uuid | Optional reference to tasks.id |
| meeting_id | uuid | Optional reference to meetings.id |
| created_by | uuid | References users.id |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### comments

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| task_id | uuid | References tasks.id |
| user_id | uuid | References users.id |
| content | text | Comment content |
| created_at | timestamptz | Creation timestamp |

### ai_outputs

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| input_text | text | Original user input or source text |
| output_json | jsonb | Structured AI result |
| type | text | extract_tasks, summarize_meeting, daily_briefing, founder_briefing, weekly_summary, risk_detection, priority_suggestion |
| created_by | uuid | References users.id |
| created_at | timestamptz | Creation timestamp |

Important:

- AI outputs are drafts and audit records.
- Saving an AI output does not mean creating tasks, notes, or decisions.
- Approved suggestions should be saved into their real destination tables.

### activity_logs

| Field | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid | References users.id |
| action | text | created_task, updated_status, converted_action_item, etc. |
| entity_type | text | task, project, meeting, note, ai_output |
| entity_id | uuid | ID of affected record |
| metadata | jsonb | Additional event details |
| created_at | timestamptz | Creation timestamp |

## Relationships

- A user owns many tasks.
- A user creates many tasks, meetings, notes, comments, and AI outputs.
- A project has many tasks, notes, and meetings.
- A meeting has many action items.
- A meeting action item may become one task.
- A task has many comments.
- AI outputs may produce suggested tasks, decisions, risks, or notes, but these remain drafts until approved.

## Reporting Fields

The reporting system should derive most metrics from tasks:

- Completed tasks: `status = done`
- Overdue tasks: `deadline < current_date` and `status != done`
- Review queue: `status = review`
- Blocked queue: `status = blocked`
- Delayed tasks: overdue or moved past deadline
- Workload by assistant: active task count grouped by owner
- Project progress: completed tasks divided by total tasks, optionally weighted later

## Future Considerations

Add only when needed:

- `task_history` table if audit detail outgrows activity logs.
- `meeting_attendees` join table if attendees need rich metadata.
- `attachments` table if document upload becomes necessary.
- `user_preferences` table if settings grow beyond profile basics.
