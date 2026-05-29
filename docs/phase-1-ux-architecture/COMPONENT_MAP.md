# Eventum Ops Cockpit - Component Map

## Component Planning Principles

- Components support Phase 2 frontend mock only.
- Components should be reusable across routes.
- No backend logic inside components.
- No provider-specific AI logic inside components.
- Mock user switching is a Phase 2 development aid, not production auth.

## Layout Components

### AppShell

Purpose:

- Wraps all app routes with sidebar, top bar, main area, and optional right panel.

Props/data:

- currentUser, activeRoute, children, rightPanel, topBarConfig

Used in:

- All routes

Type:

- Layout

### Sidebar

Purpose:

- Primary navigation and user identity.

Props/data:

- navItems, activeRoute, currentUser, role

Used in:

- AppShell

Type:

- Layout

### TopBar

Purpose:

- Page title, status, quick actions, route controls.

Props/data:

- title, subtitle, actions, statusItems

Used in:

- All routes through AppShell

Type:

- Layout

### UserSwitcherMock

Purpose:

- Switch between Founder and Assistants during Phase 2 mock prototype.

Props/data:

- users, currentUserId, onChange

Used in:

- Sidebar or Settings

Type:

- Form / development utility

## Data Display Components

### StatCard

Purpose:

- Show dashboard/report metric with label, value, trend, and severity.

Props/data:

- label, value, tone, helperText, trend

Used in:

- Dashboard, Reports

Type:

- Data display

### TaskCard

Purpose:

- Compact task summary for lists, boards, and widgets.

Props/data:

- task, owner, project, onOpen, allowedActions

Used in:

- Dashboard, My Tasks, Team Tasks, Project Detail, Reports

Type:

- Data display

### TaskList

Purpose:

- Render filtered tasks in dense list format.

Props/data:

- tasks, users, projects, filters, onTaskOpen

Used in:

- Team Tasks, My Tasks, Project Detail

Type:

- Data display

### TaskBoard

Purpose:

- Render tasks grouped by status.

Props/data:

- tasksByStatus, users, projects, onTaskOpen, onStatusChange

Used in:

- Team Tasks

Type:

- Data display

### ProjectCard

Purpose:

- Show project status and progress summary.

Props/data:

- project, owner, activeTasks, completedTasks, overdueTasks, progress, recentActivity

Used in:

- Projects, Dashboard

Type:

- Data display

### ProgressBar

Purpose:

- Show task or project completion.

Props/data:

- value, label, tone

Used in:

- TaskCard, ProjectCard, Project Detail, Reports

Type:

- Data display

### WorkloadWidget

Purpose:

- Show active workload by team member.

Props/data:

- users, workloadCounts, blockedCounts, reviewCounts

Used in:

- Dashboard, Reports

Type:

- Data display

### RoutineCard

Purpose:

- Show one recurring operational checklist item and today's completion state.

Props/data:

- routine, completion, ownerName, projectName, canUpdate, onMarkDone, onMarkSkipped, onClear

Used in:

- Dashboard, My Tasks, Settings

Type:

- Data display / form actions

### RoutineChecklist

Purpose:

- Render active routines for a team or current user with mock check/skip actions.

Props/data:

- routines, completions, ownerNamesById, projectNamesById, currentUserId, canManageTeam

Used in:

- Dashboard, My Tasks

Type:

- Data display / form actions

### RoutineCompletionBadge

Purpose:

- Display pending, done, skipped, or missed state for a routine completion.

Props/data:

- state

Used in:

- RoutineCard, Dashboard, Reports

Type:

- Data display

### RoutineProgressWidget

Purpose:

- Show routine completion totals and completion rate.

Props/data:

- title, summary

Used in:

- Dashboard, Reports

Type:

- Data display

### MeetingCard

Purpose:

- Show meeting summary in meeting list.

Props/data:

- meeting, attendees, project, actionItemCount, decisionCount

Used in:

- Meetings, Project Detail

Type:

- Data display

### ActionItemList

Purpose:

- Show meeting action items and conversion state.

Props/data:

- actionItems, users, linkedTasks, onConvert, onEdit

Used in:

- Meeting Detail

Type:

- Data display / form actions

### NoteCard

Purpose:

- Show note preview and linked entity context.

Props/data:

- note, author, linkedProject, linkedTask, linkedMeeting

Used in:

- Notes, Project Detail

Type:

- Data display

### ReportMetricCard

Purpose:

- Specialized report metric card.

Props/data:

- title, value, detail, severity, relatedItems

Used in:

- Reports

Type:

- Data display

## Form And Interaction Components

### TaskDetailDrawer

Purpose:

- View and edit task details without leaving current page.

Props/data:

- task, users, projects, comments, permissions, onSave, onDelete, onClose

Used in:

- Dashboard, Team Tasks, My Tasks, Reports

Type:

- Form / data display

### TaskFilters

Purpose:

- Filter team task views.

Props/data:

- users, projects, selectedFilters, onChange, onClear

Used in:

- Team Tasks

Type:

- Form

### CreateTaskModal

Purpose:

- Manual task creation.

Props/data:

- users, projects, defaultValues, currentUser, onCreate

Used in:

- Dashboard, My Tasks, Team Tasks, Project Detail

Type:

- Form

### MeetingEditor

Purpose:

- Edit meeting metadata, raw notes, summary, and decisions.

Props/data:

- meeting, users, projects, onSave

Used in:

- Meeting Detail

Type:

- Form

### NoteEditor

Purpose:

- Edit note title, type, content, and links.

Props/data:

- note, projects, tasks, meetings, onSave

Used in:

- Note Detail

Type:

- Form

## AI Components

### AIInsightPanel

Purpose:

- Show contextual AI briefing or suggestion output.

Props/data:

- type, output, loading, error, onGenerate, onApprove

Used in:

- Dashboard, My Tasks, Meeting Detail, AI Assistant, Reports

Type:

- Data display / feedback

### AISuggestionReview

Purpose:

- Review, edit, approve, or reject structured AI suggestions.

Props/data:

- suggestions, users, projects, onEdit, onApprove, onReject, onSaveApproved

Used in:

- AI Assistant, Meeting Detail

Type:

- Form / feedback

## Feedback Components

### EmptyState

Purpose:

- Explain no-data situations and offer next action.

Props/data:

- title, description, actionLabel, onAction

Used in:

- All routes

Type:

- Feedback

### LoadingSkeleton

Purpose:

- Preserve layout while mock or future data loads.

Props/data:

- variant, rows

Used in:

- All routes

Type:

- Feedback

### ErrorState

Purpose:

- Show recoverable errors.

Props/data:

- title, message, retryLabel, onRetry

Used in:

- All routes

Type:

- Feedback

### StatusBadge

Purpose:

- Display task status, project status, AI suggestion state, or live state.

Props/data:

- label, tone

Used in:

- TaskCard, ProjectCard, Meeting Detail, AI Assistant

Type:

- Data display

### PriorityBadge

Purpose:

- Display task priority.

Props/data:

- priority

Used in:

- TaskCard, TaskDetailDrawer, Reports

Type:

- Data display
