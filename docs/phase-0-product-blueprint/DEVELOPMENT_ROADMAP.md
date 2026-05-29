# Eventum Ops Cockpit - Development Roadmap

## Development Philosophy

Build the system phase by phase.

The first goal is not to build a clever AI product. The first goal is to build a reliable operational system for a real 4-person team.

AI is added only after the task, project, meeting, note, and reporting structures are useful without it.

## Version Roadmap

| Version | Phase | Outcome |
| --- | --- | --- |
| v0.0 | Phase 0 | Product Blueprint |
| v0.1 | Phase 1 | UX/Wireframe |
| v0.2 | Phase 2 | Frontend Mock Prototype |
| v0.3 | Phase 3 | Backend + Database |
| v0.4 | Phase 4 | Connected Task System |
| v0.5 | Phase 5 | Meetings & Notes |
| v0.6 | Phase 6 | AI Text-to-Task |
| v0.7 | Phase 7 | AI Briefings & Reports |
| v0.8 | Phase 8 | Realtime Dashboard |
| v0.9 | Phase 9 | Permissions + Internal Beta |
| v1.0 | Phase 10-11 | Stable Internal Release |

## Phase 0 - Product Blueprint

Status: current phase.

Deliverables:

- PROJECT_BRIEF.md
- USER_ROLES.md
- FEATURE_SCOPE.md
- UI_ROUTES.md
- DATA_MODEL.md
- API_CONTRACT.md
- AI_BEHAVIOR_SPEC.md
- DEVELOPMENT_ROADMAP.md

Goal:

- Define exactly what is being built.
- Define what is not being built.
- Define roles, scope, routes, data model, API contract, AI behavior, and roadmap.

Exit criteria:

- All blueprint documents exist.
- Scope is clear.
- Later phases can proceed without product ambiguity.

## Phase 1 - UX Architecture + Wireframes

Deliverables:

- Route-level wireframes
- Page section maps
- Primary user flows
- Button and action inventory
- Data requirements per page
- Empty, loading, and error state notes

Focus:

- Structure before styling.
- Founder and assistant workflows.
- Review-before-save AI flow.

Do not:

- Build final UI polish.
- Connect backend.
- Implement real AI.

## Phase 2 - Frontend Mock Prototype

Deliverables:

- Next.js App Router app
- TypeScript setup
- Tailwind CSS setup
- Framer Motion setup
- Shared layout shell
- Sidebar
- Top command/status bar
- Dashboard
- My Tasks
- Team Tasks list and board views
- Projects
- Meetings
- Notes
- AI Assistant UI
- Reports
- Settings
- Mock data layer

Focus:

- Polished desktop-first dark UI.
- Practical operational screens.
- No backend dependency.

Do not:

- Implement auth.
- Call real AI.
- Connect Supabase.

## Phase 3 - Backend + Database Foundation

Deliverables:

- Supabase schema
- Database migrations
- API route structure
- CRUD for tasks
- CRUD for projects
- CRUD for meetings
- CRUD for notes
- Seed data for 4 users and initial Eventum projects

Focus:

- Clean data foundation.
- Reliable API contracts.
- Basic validation.

## Phase 4 - Connect Frontend To Backend

Deliverables:

- Replace mock task data with API data
- Replace mock project data with API data
- Create task flow
- Assign task flow
- Update task status flow
- Dashboard data from database
- Project progress from real tasks

Focus:

- Make the task system operational.
- Keep UX fast and simple.

## Phase 5 - Meetings & Notes System

Deliverables:

- Meeting creation
- Raw notes editing
- Summary field
- Decisions field
- Action items
- Convert action item to task
- Link tasks to meetings
- Link notes to projects, tasks, and meetings

Focus:

- Stop losing meeting decisions.
- Turn action items into tracked work.

## Phase 6 - AI Layer v1

Deliverables:

- AI service abstraction
- AI provider adapter placeholder
- Structured output schemas
- Raw text to structured tasks
- Meeting notes to summary
- Meeting notes to action items
- Review-before-save UI

Focus:

- AI suggestions, not AI authority.
- Validation and user approval.

## Phase 7 - Reports

Deliverables:

- Weekly execution report
- Completed task metrics
- Delayed task metrics
- Overdue by person
- Workload by assistant
- Project progress
- Review queue
- Blocked tasks
- AI weekly summary draft

Focus:

- Founder understands execution health quickly.

## Phase 8 - Realtime Dashboard

Deliverables:

- Realtime task updates
- Realtime dashboard counters
- Activity feed updates

Focus:

- Live operational awareness.
- Keep realtime scoped to useful dashboard movement.

## Phase 9 - Permissions & Security

Deliverables:

- Founder vs assistant permissions
- Protected routes
- Role-based views
- Safe database access
- Basic audit expectations

Focus:

- Simple internal security.
- Avoid enterprise complexity.

## Phase 10 - Internal Beta

Deliverables:

- 7-day Eventum team usage
- Bug fixes
- Usability fixes
- Workflow adjustments
- Performance cleanup

Focus:

- Does the system reduce forgotten tasks?
- Does the founder have clearer visibility?
- Do assistants know what to do?

## Phase 11 - v1 Polish

Deliverables:

- UI polish
- Responsive polish
- Loading states
- Empty states
- Error states
- Better animations
- Better AI prompts
- Documentation
- Deployment cleanup

Focus:

- Stable internal release.

## Build Order Guardrail

Do not skip from Phase 0 to AI.

Recommended order:

1. Blueprint
2. UX structure
3. Mock frontend
4. Database/API
5. Connected workflows
6. Meeting and note reliability
7. AI assistance
8. Reports and realtime
9. Permissions and beta

This order keeps the product grounded in real structured operations instead of speculative automation.
