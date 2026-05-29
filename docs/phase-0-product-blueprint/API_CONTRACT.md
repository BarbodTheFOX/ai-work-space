# Eventum Ops Cockpit - API Contract

## API Principles

- API routes should expose operational resources, not UI-specific hacks.
- AI routes must call an AI service layer.
- UI components must not contain provider-specific AI logic.
- AI routes return structured JSON suggestions.
- Mutating routes should record activity logs when connected to the database.
- Permission checks can start simple and become stricter in Phase 9.

## Response Shape

Recommended success response:

```json
{
  "data": {},
  "meta": {}
}
```

Recommended error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message"
  }
}
```

## Tasks

### GET `/api/tasks`

Returns tasks.

Query filters:

- `owner_id`
- `project_id`
- `status`
- `priority`
- `timeframe`
- `due=today`
- `overdue=true`
- `review=true`
- `blocked=true`

### POST `/api/tasks`

Creates a task.

Body:

```json
{
  "title": "Prepare Telegram content calendar",
  "description": "Create and organize the Telegram publishing plan for this week.",
  "owner_id": "uuid",
  "project_id": "uuid",
  "priority": "high",
  "status": "todo",
  "deadline": "2026-05-28",
  "timeframe": "weekly",
  "source": "manual"
}
```

### PATCH `/api/tasks/:id`

Updates a task.

Allowed fields:

- title
- description
- owner_id
- project_id
- priority
- status
- deadline
- timeframe
- progress

### DELETE `/api/tasks/:id`

Deletes or archives a task.

Early implementation can hard delete only for founder. Later implementation should prefer soft deletion if audit history matters.

## Projects

### GET `/api/projects`

Returns projects with optional computed counts:

- active_tasks
- completed_tasks
- overdue_tasks
- progress

### POST `/api/projects`

Creates a project.

### PATCH `/api/projects/:id`

Updates project fields:

- name
- description
- status
- owner_id

### DELETE `/api/projects/:id`

Archives or deletes a project.

Preferred behavior:

- Archive if tasks exist.
- Delete only if no operational history exists.

## Meetings

### GET `/api/meetings`

Returns meetings.

Query filters:

- `project_id`
- `attendee_id`
- `from`
- `to`

### POST `/api/meetings`

Creates a meeting.

Body:

```json
{
  "title": "Weekly Eventum Ops Sync",
  "date": "2026-05-28T10:00:00Z",
  "attendees": ["uuid"],
  "raw_notes": "Raw notes here",
  "project_id": "uuid"
}
```

### PATCH `/api/meetings/:id`

Updates meeting fields:

- title
- date
- attendees
- raw_notes
- summary
- decisions
- project_id

### DELETE `/api/meetings/:id`

Deletes a meeting if permitted.

## Meeting Action Items

### POST `/api/meetings/:id/action-items`

Creates an action item under a meeting.

### PATCH `/api/meetings/:id/action-items/:actionItemId`

Updates action item owner, deadline, status, or title.

### POST `/api/meetings/:id/action-items/:actionItemId/convert-to-task`

Converts an approved action item into a real task.

Expected behavior:

- Create a task with `source = meeting`.
- Link `meeting_action_items.task_id` to the new task.
- Set action item status to `converted`.
- Write activity log.

## Notes

### GET `/api/notes`

Returns notes.

Query filters:

- `type`
- `project_id`
- `task_id`
- `meeting_id`
- `created_by`

### POST `/api/notes`

Creates a note.

### PATCH `/api/notes/:id`

Updates note title, content, type, or links.

### DELETE `/api/notes/:id`

Deletes a note if permitted.

## Reports

### GET `/api/reports/dashboard`

Returns dashboard aggregates:

```json
{
  "data": {
    "counts": {
      "active_tasks": 18,
      "due_today": 4,
      "overdue": 3,
      "waiting_for_review": 2,
      "blocked": 1
    },
    "team_workload": [],
    "project_progress": [],
    "recent_decisions": [],
    "upcoming_deadlines": []
  }
}
```

### GET `/api/reports/weekly`

Returns weekly execution report.

Query filters:

- `week_start`
- `week_end`

Includes:

- execution rate
- completed tasks
- delayed tasks
- overdue by person
- workload by assistant
- project progress
- review queue
- blocked tasks

## AI

AI endpoints call a provider-agnostic service layer.

Recommended internal interface:

```ts
interface AiOperationsService {
  extractTasks(input: ExtractTasksInput): Promise<ExtractTasksOutput>;
  summarizeMeeting(input: SummarizeMeetingInput): Promise<SummarizeMeetingOutput>;
  generateDailyBriefing(input: DailyBriefingInput): Promise<BriefingOutput>;
  generateFounderBriefing(input: FounderBriefingInput): Promise<BriefingOutput>;
  generateWeeklySummary(input: WeeklySummaryInput): Promise<WeeklySummaryOutput>;
}
```

### POST `/api/ai/extract-tasks`

Input:

```json
{
  "text": "Raw operational text",
  "context": {
    "project_id": "uuid",
    "meeting_id": "uuid"
  }
}
```

Output:

```json
{
  "data": {
    "tasks": [],
    "decisions": [],
    "risks": [],
    "notes": []
  }
}
```

### POST `/api/ai/summarize-meeting`

Returns summary, decisions, action items, and risks.

### POST `/api/ai/daily-briefing`

Returns a briefing for the current user.

### POST `/api/ai/founder-briefing`

Returns founder-focused operational summary.

### POST `/api/ai/weekly-summary`

Returns draft weekly execution summary.

## Review-Before-Save Flow

1. User submits text or requests a briefing.
2. API calls AI service layer.
3. AI service returns structured JSON.
4. API stores optional `ai_outputs` record.
5. UI displays suggestions in a review state.
6. User edits, approves, or rejects suggestions.
7. Approved items are saved through normal resource APIs.

AI endpoints do not directly create tasks, notes, meetings, or decisions unless a later explicit approved endpoint is added.
