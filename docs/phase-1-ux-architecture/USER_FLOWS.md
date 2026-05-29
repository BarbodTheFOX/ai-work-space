# Eventum Ops Cockpit - User Flows

## A. Founder Daily Dashboard Flow

Goal:

Founder understands today's execution state and handles urgent operational risk.

Flow:

1. Founder opens `/dashboard`.
2. Dashboard shows execution pulse, overdue tasks, due-today tasks, review queue, blocked tasks, workload, and project progress.
3. Founder scans urgent/overdue/review/blocked sections.
4. Founder opens a task in the task detail drawer.
5. Founder updates owner, priority, deadline, status, or progress.
6. If task is in review, Founder approves by marking done or sends it back to in_progress/waiting.
7. Activity feed reflects the update in mock form during Phase 2.

Success result:

- Founder knows what is urgent, what is late, what needs review, and who is overloaded.

## B. Assistant Daily Execution Flow

Goal:

Assistant knows what to work on today and updates execution status.

Flow:

1. Assistant opens `/my-tasks`.
2. Page shows today tasks, weekly tasks, overdue tasks, waiting-for-review tasks, and suggested focus order.
3. Assistant opens the highest priority task.
4. Assistant clicks `Start Task`.
5. Task status changes to `in_progress`.
6. Assistant adds note/comment if needed.
7. Assistant updates progress.
8. Assistant clicks `Send to Review` when complete.
9. Task appears in Founder review queue.

Success result:

- Assistant has a clear daily focus and Founder sees review-ready work.

## C. Create Task Manually Flow

Goal:

User creates a structured task without AI.

Flow:

1. User clicks `Create Task`.
2. Create task form opens.
3. User enters title and optional description.
4. User selects owner, project, priority, deadline, timeframe, and status.
5. User saves task.
6. Task appears in `/team-tasks`.
7. If owner is current user, task appears in `/my-tasks`.
8. If due today, overdue, review, or blocked, task appears in dashboard counters.

Permissions:

- Founder can create tasks for anyone.
- Assistants can create tasks.
- Assistants cannot delete other users' tasks.

Success result:

- Work is captured as structured operational data.

Future API:

- `POST /api/tasks`

## D. Meeting To Action Item Flow

Goal:

Meeting notes produce trackable decisions and action items without AI.

Flow:

1. User opens `/meetings`.
2. User clicks `Create Meeting`.
3. User enters title, date, attendees, project, and raw notes.
4. User manually adds decisions.
5. User manually adds action items with owner and deadline.
6. User reviews an action item.
7. User clicks `Convert to Task`.
8. System creates a task with `source = meeting`.
9. Action item is marked `converted`.
10. Linked task appears on the meeting detail page.

Success result:

- Meeting outcomes become tracked work.

Future APIs:

- `POST /api/meetings`
- `POST /api/meetings/:id/action-items`
- `POST /api/meetings/:id/action-items/:actionItemId/convert-to-task`

## E. AI Text-To-Task Review Flow

Goal:

AI helps extract tasks, but user remains in control.

Flow:

1. User opens `/ai-assistant` or a contextual AI panel.
2. User selects `Extract Tasks`.
3. User submits raw operational text.
4. AI returns structured suggestions in mock form during Phase 2.
5. Suggestions appear in review state.
6. User edits owner, priority, deadline, project, or title.
7. User approves useful suggestions.
8. User rejects weak suggestions.
9. Approved suggestions are created as tasks.
10. Rejected suggestions are discarded or kept only in AI output history.

Rules:

- AI never writes directly to the database.
- Approved tasks use normal task creation flow.
- Unknown owners should be left unassigned until reviewed.

Future APIs:

- `POST /api/ai/extract-tasks`
- `POST /api/tasks`

## F. AI Meeting Summary Review Flow

Goal:

AI helps summarize meeting notes and detect action items, but user reviews every saved item.

Flow:

1. User opens `/meetings/[id]`.
2. User writes or pastes raw notes.
3. User clicks `Extract Tasks with AI` or `Summarize Meeting`.
4. AI returns summary, decisions, action items, and risks in mock form during Phase 2.
5. User reviews the summary.
6. User approves or edits decisions.
7. User approves, edits, or rejects action items.
8. Approved summary is saved to the meeting.
9. Approved decisions are saved to the meeting.
10. Approved action items become meeting action items or tasks after explicit confirmation.

Rules:

- AI summary is not saved automatically.
- Action items are not converted to tasks automatically.

Future APIs:

- `POST /api/ai/summarize-meeting`
- `PATCH /api/meetings/:id`
- `POST /api/meetings/:id/action-items`

## G. Weekly Report Flow

Goal:

Founder reviews execution health for a selected week.

Flow:

1. Founder opens `/reports`.
2. Page loads current week by default.
3. Founder changes week filter if needed.
4. Report shows execution rate, completed tasks, delayed tasks, overdue by person, workload by assistant, project progress, review queue, and blocked tasks.
5. Founder opens specific tasks or projects from report sections.
6. Founder optionally clicks `Generate AI Weekly Summary Draft`.
7. AI summary appears as a draft, not a saved official report.

Rules:

- Reports are view-only in v1.
- Export is later, not Phase 2.

Future APIs:

- `GET /api/reports/weekly`
- `POST /api/ai/weekly-summary`
