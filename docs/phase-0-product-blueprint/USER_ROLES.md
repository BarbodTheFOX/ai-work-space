# Eventum Ops Cockpit - User Roles

## Role Model

Permissions are intentionally simple because Eventum Ops Cockpit serves one private 4-person team.

The system has two practical permission levels:

- Founder
- Assistant

Assistant responsibilities differ by function, but their permissions remain mostly shared unless a later phase proves a real need for more detail.

## Founder

The founder is the operational owner of the cockpit.

### Founder Can

- View all dashboard data.
- View all tasks.
- Create, edit, assign, and delete tasks.
- Change task priority, owner, deadline, status, timeframe, and progress.
- View all projects.
- Create, edit, and archive projects.
- View all meetings and notes.
- Create and edit meeting records.
- Review meeting decisions and action items.
- Convert action items into tasks.
- View all reports.
- View overdue, blocked, and review queues.
- Use AI founder briefing.
- Use AI task extraction and meeting summary tools.
- Approve or reject AI suggestions before saving.
- Manage basic team settings.

### Founder Should See First

- Today's execution pulse
- Urgent and overdue work
- Work waiting for review
- Blocked work
- Team workload
- Project progress
- Recent decisions
- Upcoming deadlines
- AI founder briefing

## Assistants

Assistants are execution owners for their assigned areas.

### Assistant 1 - Publishing & Documentation

Primary focus:

- Publishing workflows
- Internal documentation
- Notes hygiene
- Meeting documentation
- Content publishing support

### Assistant 2 - Content & Social Ops

Primary focus:

- Instagram operations
- Telegram operations
- Social content calendars
- Content tracking
- Social publishing tasks

### Assistant 3 - Production / Coordination

Primary focus:

- Production tasks
- Coordination work
- Follow-ups
- Scheduling support
- Cross-project operational movement

## Assistant Permissions

### Assistants Can

- View their own tasks.
- View tasks related to projects they participate in.
- Update status on assigned tasks.
- Update progress on assigned tasks.
- Add task comments or notes.
- View related project details.
- View related meetings.
- Create notes.
- Create tasks if the founder allows this in settings.
- Use AI daily briefing.
- Use AI text-to-task as a draft workflow.
- Review AI suggestions before creating tasks they are allowed to create.

### Assistants Cannot In Early Versions

- Delete other users' tasks.
- Change global settings.
- View private founder-only reports if such reports are added later.
- Directly save AI-generated tasks without review.
- Manage billing, workspaces, or organization settings because those features do not exist.

## Initial Team Members

| Name | Role | Operational Area |
| --- | --- | --- |
| Founder | founder | Full operational visibility |
| Assistant 1 | assistant | Publishing & Documentation |
| Assistant 2 | assistant | Content & Social Ops |
| Assistant 3 | assistant | Production / Coordination |

## Permission Principle

Start permissive enough for a trusted internal team, then add restrictions only when real workflow risk appears.

Avoid enterprise-style role systems until the product proves they are needed.
