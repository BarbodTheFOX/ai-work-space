# Eventum Ops Cockpit - UX Architecture

## Phase 1 Purpose

Define the application experience before implementation.

Phase 1 does not create production UI, real routes, backend connections, authentication, Supabase integration, or AI calls.

## Product Frame

Eventum Ops Cockpit is a private internal operations cockpit for:

- 1 Founder
- 3 Assistants

The UX should help the team remember tasks, preserve decisions, clarify priorities, and give the Founder live operational visibility.

## App Shell

All main routes use one desktop-first shell:

```text
┌────────────────────────────────────────────────────────────────────┐
│ Left Sidebar │ Top Command / Status Bar                            │
│              ├─────────────────────────────────────────────────────┤
│              │ Main Content Area                 │ Optional AI Panel│
│              │                                   │                  │
│              │                                   │                  │
└──────────────┴───────────────────────────────────┴──────────────────┘
```

## Left Sidebar

Purpose:

- Persistent navigation.
- Current-user identity.
- Fast context switching.

Items:

- Dashboard
- My Tasks
- Team Tasks
- Projects
- Meetings
- Notes
- AI Assistant
- Reports
- Settings

Bottom profile area:

- Avatar or initials
- Name
- Role
- Status

Phase 2 mock behavior:

- Include a mocked current-user switcher for Founder, Assistant 1, Assistant 2, and Assistant 3.
- Switching users changes role-based page emphasis and task visibility in mock data.

## Top Command / Status Bar

Purpose:

- Show current route context.
- Provide quick actions.
- Surface operational status.

Common contents:

- Page title
- Date context, using the app-local date
- Global create task button
- Search or command input placeholder
- Live status indicator placeholder
- Quick filter or view controls where useful

Do not build a full command palette in Phase 2 unless it is a static mock.

## Main Content Area

Purpose:

- Holds the primary workflow for each route.
- Uses dense but calm operational layouts.

Layout principles:

- Desktop-first.
- Clear hierarchy.
- Dashboard and reports use grid-based widgets.
- Task pages use list, board, and drawer patterns.
- Meetings and notes use master-detail patterns.
- Avoid nested card stacks.
- Avoid marketing-page sections.

## Optional Right AI Briefing Panel

Purpose:

- Show contextual AI draft insight without making AI the main system.

Appears on:

- Dashboard: Founder briefing draft
- My Tasks: Daily briefing draft
- Meeting Detail: Summary/action extraction preview
- AI Assistant: Structured suggestion preview
- Reports: Weekly summary draft

Rules:

- Panel can be collapsed.
- AI content is marked as draft or suggestion.
- AI-generated items require review before saving.
- If AI is unavailable, the core page still works.

## Navigation Behavior

Primary navigation:

- Sidebar controls route changes.
- Active route is visually highlighted.
- Founder sees all sidebar items.
- Assistants see all core items, but Reports are read-restricted or hidden in production unless permitted.

Phase 2 mock:

- Keep Reports visible but label founder-only behavior in mock states.
- Use the mocked user switcher to demonstrate role differences.

## Role-Based View Differences

### Founder

Default route:

- `/dashboard`

Founder view emphasizes:

- All tasks
- Overdue and blocked work
- Review queue
- Team workload
- Project progress
- Reports
- Founder briefing
- Full task management

Founder actions:

- Create, edit, assign, and delete tasks
- Manage projects
- Review work
- Convert action items to tasks
- Manage team settings

### Assistants

Default route:

- `/my-tasks`

Assistant view emphasizes:

- Personal tasks
- Today and weekly priorities
- Related projects
- Related meetings
- Task status updates
- Notes and comments
- Daily briefing

Assistant actions:

- Create tasks
- Update assigned tasks
- Add notes and comments
- Send tasks to review
- Use AI drafts with review

Assistant limits:

- Cannot delete other users' tasks.
- Cannot manage global settings.
- Reports are not a primary assistant workflow in v1.

## Desktop-First Responsive Logic

Desktop:

- Sidebar fixed.
- Main content uses 2 or 3 columns depending on route.
- Right AI panel appears where useful.
- Task detail appears as a drawer.

Tablet:

- Sidebar can collapse to icon mode.
- AI panel stacks below or becomes drawer.
- Boards can scroll horizontally.

Mobile:

- Not a Phase 2 priority.
- Ensure no critical controls are impossible to reach.
- Full mobile app behavior is out of scope for v1.

## UX Guardrails

- Every screen should answer a concrete operational question.
- AI is always optional and review-based.
- No billing, workspaces, CRM pipelines, public onboarding, or complex chat.
- Empty states should guide internal setup, not sell the product.
- Reports are view-only in v1.
