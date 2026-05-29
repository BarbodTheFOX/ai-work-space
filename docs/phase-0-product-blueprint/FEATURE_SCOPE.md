# Eventum Ops Cockpit - Feature Scope

## In Scope For V1

### Dashboard

- Founder execution cockpit
- Today's operational pulse
- Active tasks
- Due today
- Overdue tasks
- Waiting for review
- Blocked tasks
- Team workload
- Project progress
- Recent decisions
- Upcoming deadlines
- AI founder briefing panel

### My Tasks

- Personal daily tasks
- Weekly tasks
- Overdue tasks
- Waiting-for-review tasks
- Suggested focus order
- AI daily briefing panel
- Quick status updates

### Team Tasks

- List view
- Board view
- Filters by owner, priority, status, project, timeframe, due today, overdue, review, and blocked
- Task cards with title, project, owner, priority, deadline, status, progress, and source
- Task statuses: todo, in_progress, waiting, review, done, blocked
- Priorities: low, normal, high, urgent
- Timeframes: daily, weekly, monthly, one_time

### Projects

Initial projects:

- Eventum YouTube
- Eventum Instagram
- Eventum Telegram
- Eventum Website
- Purple Evolution
- Eventum Game
- General Operations

Each project shows:

- Owner
- Active tasks
- Completed tasks
- Overdue tasks
- Progress percentage
- Recent activity

### Meetings

- Meeting records
- Attendees
- Raw notes
- Summary
- Decisions
- Action items
- Linked tasks
- Extract Tasks with AI button
- Action item to task conversion after review

### Notes

Note types:

- General note
- Content brief
- Idea
- Decision
- Internal documentation
- Meeting-related note

Notes can link to:

- Project
- Task
- Meeting

### AI Assistant

AI Assistant supports operational outputs:

- Raw text to structured tasks
- Meeting notes summary
- Action item extraction
- Daily briefing
- Founder briefing
- Weekly execution report draft
- Overdue risk detection
- Priority suggestions

AI must return structured JSON and require user confirmation before saving anything.

### Reports

- Weekly execution rate
- Completed tasks
- Delayed tasks
- Overdue by person
- Workload by assistant
- Project progress
- Review queue
- Blocked tasks
- AI weekly summary

### Settings

- Team members
- Roles
- Profile
- Basic preferences
- AI API configuration placeholder

## Out Of Scope For V1

- Public SaaS onboarding
- Billing
- Multi-workspace support
- Public marketing pages
- CRM pipelines
- Full Notion-style document blocks
- Complex team chat
- Mobile app
- Enterprise permissions
- Guest users
- Client portals
- Advanced file management
- Calendar sync
- Email automation
- Native desktop app
- Native mobile app

## Scope Guardrails

- Build for the real Eventum team, not hypothetical customers.
- Prefer operational clarity over feature volume.
- Use simple CRUD and focused workflows before adding automation.
- AI features must sit on top of reliable structured data.
- Every feature should help reduce forgotten work, unclear priorities, or lost decisions.

## Version Scope Summary

| Version | Scope |
| --- | --- |
| v0.0 | Product blueprint |
| v0.1 | UX architecture and wireframes |
| v0.2 | Frontend mock prototype |
| v0.3 | Backend and database foundation |
| v0.4 | Connected task system |
| v0.5 | Meetings and notes |
| v0.6 | AI text-to-task |
| v0.7 | AI briefings and reports |
| v0.8 | Realtime dashboard |
| v0.9 | Permissions and internal beta |
| v1.0 | Stable internal release |
