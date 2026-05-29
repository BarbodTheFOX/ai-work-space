# Eventum Ops Cockpit - AI Behavior Spec

## AI Role

AI acts as an operations assistant that helps transform messy operational input into structured, reviewable outputs.

AI is not the system of record.

The database is the system of record.

## Non-Negotiable Rules

- AI must not directly save tasks, notes, meetings, decisions, or reports without user confirmation.
- AI output must be structured JSON.
- AI suggestions must be previewed before being saved.
- AI provider logic must live in a service layer, not in UI components.
- AI should use existing structured data as context when available.
- AI should be useful even if its output is partially rejected.
- AI should avoid inventing owners, deadlines, or project links when confidence is low.

## Supported AI Actions

### Extract Tasks

Input:

- Raw text
- Optional project context
- Optional meeting context
- Optional team member list

Output:

```json
{
  "tasks": [
    {
      "title": "Prepare Telegram content calendar",
      "description": "Create and organize the Telegram publishing plan for this week.",
      "owner_suggestion": "Assistant 2",
      "priority": "high",
      "deadline": "2026-05-28",
      "timeframe": "weekly",
      "source": "ai",
      "confidence": 0.86
    }
  ],
  "decisions": [],
  "risks": [],
  "notes": []
}
```

User review required:

- Confirm title
- Confirm owner
- Confirm deadline
- Confirm priority
- Confirm project
- Confirm task creation

### Summarize Meeting

Input:

- Meeting raw notes
- Meeting title
- Date
- Attendees
- Optional project context

Output:

```json
{
  "summary": "Short meeting summary here.",
  "decisions": [
    "Decision 1",
    "Decision 2"
  ],
  "action_items": [
    {
      "title": "Action item title",
      "owner_suggestion": "Assistant 1",
      "deadline": "2026-05-28",
      "priority": "normal",
      "confidence": 0.78
    }
  ],
  "risks": [
    "Potential delay in YouTube publishing."
  ]
}
```

User review required:

- Confirm summary before saving to meeting.
- Confirm decisions before saving.
- Confirm action items before converting to meeting action items or tasks.

### Daily Briefing

Input:

- Current user
- User tasks
- Deadlines
- Blocked tasks
- Review tasks
- Related project status

Output:

```json
{
  "briefing": "Your focus today should be...",
  "focus_order": [
    {
      "task_id": "uuid",
      "reason": "Due today and high priority."
    }
  ],
  "risks": [],
  "suggested_updates": []
}
```

Daily briefing should:

- Prioritize overdue and due-today tasks.
- Flag blocked dependencies.
- Keep recommendations short and operational.
- Avoid motivational filler.

### Founder Briefing

Input:

- Dashboard report data
- Team workload
- Project progress
- Review queue
- Blocked tasks
- Recent decisions
- Upcoming deadlines

Output:

```json
{
  "briefing": "Operational summary for today.",
  "urgent_items": [],
  "team_risks": [],
  "project_risks": [],
  "review_needed": [],
  "recommended_actions": []
}
```

Founder briefing should answer:

- What is happening today?
- What is urgent?
- What is late?
- Who is overloaded?
- Which projects are stuck?
- What needs founder review?

### Weekly Summary

Input:

- Weekly report data
- Completed tasks
- Delayed tasks
- Overdue tasks
- Project progress
- Blocked tasks
- Review queue

Output:

```json
{
  "summary": "Weekly execution summary.",
  "wins": [],
  "delays": [],
  "risks": [],
  "next_week_priorities": []
}
```

## Prompting Principles

AI prompts should:

- Ask for JSON only.
- Include allowed enums for status, priority, timeframe, and source.
- Include team member names and roles.
- Include current date when deadlines are inferred.
- Ask AI to use `null` when information is unknown.
- Ask AI to mark low-confidence suggestions.

AI prompts should not:

- Ask for generic brainstorming when an operational output is needed.
- Produce prose-only responses for structured workflows.
- Directly instruct the model to mutate application data.

## Validation Requirements

Before displaying or storing AI output:

- Validate JSON shape.
- Validate enum values.
- Validate deadline format.
- Validate task array size.
- Normalize unknown owners to `null`.
- Store original AI output in `ai_outputs` if useful for audit.

## Suggested Service Structure

Future implementation:

```text
src/
  lib/
    ai/
      ai-service.ts
      schemas.ts
      prompts.ts
      providers/
        custom-provider.ts
```

The UI should call API routes.

API routes should call `ai-service.ts`.

`ai-service.ts` should call the configured provider.

## AI Failure Behavior

If AI fails:

- Show a clear error.
- Preserve user input.
- Do not create records.
- Let the user retry.
- Let the user manually create tasks from the same screen.

## Human Review States

AI suggestions can have these UI states:

- suggested
- edited
- approved
- rejected
- saved

Only approved suggestions are sent to normal create/update endpoints.
