# Eventum Ops Cockpit - Route Wireframes

## `/dashboard`

Purpose:

Founder execution cockpit.

Wireframe:

```text
Top Bar: Dashboard | Today | Create Task | Live status
Main Grid:
  Row 1: Execution Pulse | Active | Due Today | Overdue | Review | Blocked
  Row 2: Urgent Work List | Today Routine Checklist | AI Founder Briefing
  Row 3: Team Workload | Project Progress | Upcoming Deadlines
  Row 4: Recent Decisions | Activity Feed
```

Visible sections:

- Today's execution pulse
- Task counters
- Urgent and overdue work
- Review queue
- Blocked queue
- Team workload
- Today Routine Checklist
- Project progress
- Recent decisions
- Upcoming deadlines
- AI Founder Briefing panel

Primary actions:

- Create task
- Open task
- Review task
- Open blocked queue
- Generate founder briefing mock
- Check/uncheck routine completion in mock state

Secondary actions:

- Filter by project
- Filter by owner
- Open weekly report

Data needed:

- tasks, projects, users, meetings, activity_logs, ai_outputs
- routine tasks, routine completions

Empty state:

- Show setup-focused message and create task/project actions.

Loading state:

- Skeleton stat cards and widget placeholders.

Error state:

- Show dashboard load error with retry.

## `/my-tasks`

Purpose:

Assistant daily execution page.

Wireframe:

```text
Top Bar: My Tasks | Current user | Create Task | Generate Daily Briefing
Main:
  Left: Today Tasks | My Daily Routines | Weekly Tasks | Overdue
  Center: Suggested Focus Order | Waiting For Review
  Right: AI Daily Briefing
```

Visible sections:

- Today tasks
- Weekly tasks
- Overdue tasks
- Waiting for review
- Suggested focus order
- AI daily briefing
- My Daily Routines

Primary actions:

- Start task
- Mark waiting
- Send to review
- Mark done
- Create task
- Mark routine done
- Mark routine skipped

Secondary actions:

- Add note/comment
- Change progress
- Open project

Data needed:

- current user, tasks owned by current user, related projects, comments, ai_outputs
- routine tasks and routine completions for current user

Empty state:

- "No tasks assigned for today" with create task action.

Loading state:

- Task list skeleton and briefing panel skeleton.

Error state:

- Personal task load error with retry.

## `/team-tasks`

Purpose:

Shared task management.

Wireframe:

```text
Top Bar: Team Tasks | View toggle List/Board | Create Task
Filters: Owner | Priority | Status | Project | Timeframe | Due Today | Overdue | Review | Blocked
Main:
  List View: table/list rows
  Board View: columns by status
  Right Drawer: selected task detail
```

Visible sections:

- View switcher
- Filters
- Task list
- Task board
- Task detail drawer

Primary actions:

- Create task
- Open task
- Edit task
- Assign owner
- Change status

Secondary actions:

- Change priority
- Change deadline
- Add comment
- Delete task if Founder or own allowed task

Data needed:

- tasks, users, projects, comments

Empty state:

- No tasks match filters; offer clear filters and create task.

Loading state:

- Table rows or board column skeletons.

Error state:

- Task load error with retry.

## `/projects`

Purpose:

Project-level operational overview.

Wireframe:

```text
Top Bar: Projects | Create Project | Create Task
Main Grid:
  Project Cards:
    Name | Owner | Progress | Active | Done | Overdue | Recent Activity
```

Visible sections:

- Project cards
- Status filters
- Recent activity preview

Primary actions:

- Open project
- Create project
- Create task in project

Secondary actions:

- Filter active/paused/completed
- Edit project if Founder

Data needed:

- projects, users, tasks aggregated by project, activity_logs

Empty state:

- Show initial Eventum project setup prompt.

Loading state:

- Project card skeletons.

Error state:

- Project load error with retry.

## `/projects/[id]`

Purpose:

Focused project workspace.

Wireframe:

```text
Top Bar: Project Name | Status | Create Task | Add Note
Header: Owner | Progress | Active | Done | Overdue
Main:
  Left: Active Tasks | Overdue Tasks
  Center: Linked Notes | Related Meetings
  Right: Activity Timeline
```

Visible sections:

- Project header
- Progress overview
- Active tasks
- Overdue tasks
- Completed tasks
- Linked notes
- Related meetings
- Activity timeline

Primary actions:

- Create task
- Edit project
- Add note
- Open task

Secondary actions:

- Link meeting
- Filter project tasks

Data needed:

- project, owner user, tasks, notes, meetings, activity_logs

Empty state:

- Project exists but no tasks yet; prompt create task.

Loading state:

- Header and content skeleton.

Error state:

- Project not found or failed to load.

## `/meetings`

Purpose:

Meeting notes and action-item hub.

Wireframe:

```text
Top Bar: Meetings | Create Meeting
Main:
  Left: Meeting List
  Right: Recent Decisions | Open Action Items
```

Visible sections:

- Meeting list
- Recent meetings
- Decision previews
- Action item counts

Primary actions:

- Create meeting
- Open meeting

Secondary actions:

- Filter by project
- Filter by attendee
- Start AI extraction from selected meeting mock

Data needed:

- meetings, users, projects, meeting_action_items

Empty state:

- No meetings yet; prompt create first meeting.

Loading state:

- Meeting list skeleton.

Error state:

- Meeting load error with retry.

## `/meetings/[id]`

Purpose:

Turn meeting notes into decisions and tracked action items.

Wireframe:

```text
Top Bar: Meeting Title | Save | Extract Tasks with AI
Main:
  Left: Metadata | Attendees | Project
  Center: Raw Notes | Summary | Decisions
  Right: Action Items | Linked Tasks | AI Extraction Preview
```

Visible sections:

- Meeting metadata
- Attendees
- Raw notes
- Summary
- Decisions
- Action items
- Linked tasks
- AI extraction preview

Primary actions:

- Save raw notes
- Add decision
- Add action item
- Convert action item to task
- Extract tasks with AI mock

Secondary actions:

- Link existing task
- Edit attendee list
- Edit project link

Data needed:

- meeting, users, project, meeting_action_items, linked tasks, ai_outputs

Empty state:

- Meeting has no notes; focus raw notes editor.

Loading state:

- Detail skeleton.

Error state:

- Meeting not found or failed to load.

## `/notes`

Purpose:

Clean documentation index.

Wireframe:

```text
Top Bar: Notes | Create Note
Filters: Type | Project | Task | Meeting | Author
Main:
  Note List/Grid | Selected Note Preview
```

Visible sections:

- Note filters
- Note list
- Linked entity indicators
- Note preview

Primary actions:

- Create note
- Open note
- Edit note

Secondary actions:

- Filter by type
- Link note to project/task/meeting

Data needed:

- notes, projects, tasks, meetings, users

Empty state:

- No notes yet; prompt create note.

Loading state:

- Note card skeletons.

Error state:

- Notes load error with retry.

## `/notes/[id]`

Purpose:

Focused note reading and editing.

Wireframe:

```text
Top Bar: Note Title | Save | Link
Main:
  Header: Type | Created by | Linked entities
  Body: Content editor/reader
  Side: Related project/task/meeting
```

Visible sections:

- Note metadata
- Content
- Linked project/task/meeting

Primary actions:

- Edit note
- Save note
- Link entity

Secondary actions:

- Change note type
- Open linked entity

Data needed:

- note, creator user, linked project/task/meeting

Empty state:

- Note not found fallback.

Loading state:

- Note detail skeleton.

Error state:

- Note load error with retry.

## `/ai-assistant`

Purpose:

Operational AI workspace for structured suggestions.

Wireframe:

```text
Top Bar: AI Assistant | Saved Prompts
Main:
  Left: Suggested Actions
  Center: Input / Conversation
  Right: Structured Output Preview
Bottom/Panel: Review Queue | Approve selected | Reject selected
```

Visible sections:

- Suggested AI actions
- Chat-style input
- Saved prompts
- Structured output preview
- Review controls
- AI output history

Primary actions:

- Extract tasks
- Summarize meeting
- Generate daily briefing
- Generate founder briefing
- Generate weekly summary draft
- Approve selected suggestions

Secondary actions:

- Edit suggestion
- Reject suggestion
- Copy JSON in mock only

Data needed:

- current user, users, projects, tasks context, meetings context, ai_outputs

Empty state:

- Show operational prompt starters.

Loading state:

- AI thinking placeholder.

Error state:

- AI unavailable message, preserve input.

## `/reports`

Purpose:

Founder view-only execution health.

Wireframe:

```text
Top Bar: Reports | Week Filter | Generate AI Summary Draft
Main Grid:
  Execution Rate | Completed | Delayed | Overdue
  Overdue By Person | Workload | Project Progress
  Routine Completion | Routine Consistency | Missed Routines
  Review Queue | Blocked Tasks | AI Weekly Summary Draft
```

Visible sections:

- Weekly execution rate
- Completed tasks
- Delayed tasks
- Overdue by person
- Workload by assistant
- Project progress
- Review queue
- Blocked tasks
- AI weekly summary
- Routine completion rate
- Missed routines
- Completed routines by user
- Routine consistency this week

Primary actions:

- Filter week
- Open task/project from report
- Generate AI weekly summary mock

Secondary actions:

- None for export in v1

Data needed:

- tasks, users, projects, weekly aggregates, ai_outputs
- routine tasks, routine completions

Empty state:

- Not enough data for selected week.

Loading state:

- Report metric skeletons.

Error state:

- Report load error with retry.

## `/settings`

Purpose:

Simple internal settings.

Wireframe:

```text
Top Bar: Settings
Main:
  Profile
  Team Members
  Roles
  Preferences
  AI API Configuration Placeholder
  Routine Tasks
```

Visible sections:

- Current profile
- Team members
- Roles
- Basic preferences
- AI configuration placeholder
- Routine Tasks mock section

Primary actions:

- Edit profile
- Update team member if Founder
- Toggle assistant task creation setting if Founder
- Mock-create routine if Founder
- Toggle routine active/inactive if Founder

Secondary actions:

- View AI configuration placeholder

Data needed:

- current user, users, roles, preferences mock
- routine tasks

Empty state:

- Not applicable for team; show defaults.

Loading state:

- Settings form skeleton.

Error state:

- Settings load error with retry.
