# Eventum Ops Cockpit - Page Actions

## Action Rules

- Phase 2 actions are mock-only unless explicitly documented otherwise later.
- No real API routes are created in Phase 1 or Phase 2.
- AI actions produce reviewed suggestions only.
- Founder can manage everything.
- Assistants can create tasks and update their work, but cannot delete other users' tasks.

## Dashboard

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Create task | Create Task | Founder, Assistants | Adds task | No | Yes | `POST /api/tasks` |
| Open task | Task row/card | Founder, Assistants | Opens drawer | No | Yes | `GET /api/tasks` |
| Review task | Review | Founder | Updates status | No | Yes | `PATCH /api/tasks/:id` |
| Open blocked queue | Blocked card | Founder | Filters tasks | No | Yes | `GET /api/tasks?blocked=true` |
| Generate founder briefing | Generate Briefing | Founder | Creates AI draft | No | Yes | `POST /api/ai/founder-briefing` |
| Check routine | Check | Founder, assigned owner | Creates local routine completion | No | Yes | Future routine endpoint |
| Uncheck routine | Uncheck | Founder, assigned owner | Removes local routine completion | No | Yes | Future routine endpoint |

## My Tasks

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Start task | Start | Assigned user, Founder | Status to in_progress | No | Yes | `PATCH /api/tasks/:id` |
| Mark waiting | Waiting | Assigned user, Founder | Status to waiting | No | Yes | `PATCH /api/tasks/:id` |
| Send to review | Send to Review | Assigned user, Founder | Status to review | No | Yes | `PATCH /api/tasks/:id` |
| Mark done | Done | Assigned user, Founder | Status to done | Optional for non-founder | Yes | `PATCH /api/tasks/:id` |
| Add comment | Add Comment | Assigned user, Founder | Adds comment | No | Yes | `POST /api/comments` later |
| Generate daily briefing | Daily Briefing | Current user | Creates AI draft | No | Yes | `POST /api/ai/daily-briefing` |
| Mark routine done | Check | Current user, Founder | Creates local routine completion | No | Yes | Future routine endpoint |
| Mark routine skipped | Skip | Current user, Founder | Creates local skipped completion | No | Yes | Future routine endpoint |

## Team Tasks

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Switch view | List / Board | Founder, Assistants | Local view state | No | Yes | None |
| Filter tasks | Filter controls | Founder, Assistants | Local query state | No | Yes | `GET /api/tasks` |
| Create task | Create Task | Founder, Assistants | Adds task | No | Yes | `POST /api/tasks` |
| Edit task | Edit | Founder, owner | Updates task | No | Yes | `PATCH /api/tasks/:id` |
| Assign owner | Owner select | Founder | Updates owner | No | Yes | `PATCH /api/tasks/:id` |
| Delete task | Delete | Founder, task creator if allowed | Deletes task | Yes | Yes | `DELETE /api/tasks/:id` |

## Projects

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Open project | Project card | Founder, Assistants | Navigates | No | Yes | `GET /api/projects` |
| Create project | Create Project | Founder | Adds project | No | Yes | `POST /api/projects` |
| Create task in project | Add Task | Founder, Assistants | Adds task with project_id | No | Yes | `POST /api/tasks` |
| Edit project | Edit | Founder | Updates project | No | Yes | `PATCH /api/projects/:id` |

## Project Detail

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Create task | Create Task | Founder, Assistants | Adds project task | No | Yes | `POST /api/tasks` |
| Add note | Add Note | Founder, Assistants | Adds linked note | No | Yes | `POST /api/notes` |
| Edit project | Edit Project | Founder | Updates project | No | Yes | `PATCH /api/projects/:id` |
| Open linked meeting | Meeting item | Founder, Assistants | Navigates | No | Yes | `GET /api/meetings` |

## Meetings

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Create meeting | Create Meeting | Founder, Assistants | Adds meeting | No | Yes | `POST /api/meetings` |
| Open meeting | Meeting card | Founder, Assistants | Navigates | No | Yes | `GET /api/meetings` |
| Filter meetings | Filter controls | Founder, Assistants | Local query state | No | Yes | `GET /api/meetings` |

## Meeting Detail

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Save notes | Save Notes | Founder, Assistants | Updates raw_notes | No | Yes | `PATCH /api/meetings/:id` |
| Add decision | Add Decision | Founder, Assistants | Adds decision | No | Yes | `PATCH /api/meetings/:id` |
| Add action item | Add Action Item | Founder, Assistants | Adds action item | No | Yes | `POST /api/meetings/:id/action-items` |
| Convert action item | Convert to Task | Founder, Assistants | Creates task | Yes | Yes | `POST /api/meetings/:id/action-items/:actionItemId/convert-to-task` |
| Extract tasks with AI | Extract Tasks with AI | Founder, Assistants | Creates AI draft | No | Yes | `POST /api/ai/summarize-meeting` |

## Notes

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Create note | Create Note | Founder, Assistants | Adds note | No | Yes | `POST /api/notes` |
| Open note | Note card | Founder, Assistants | Navigates | No | Yes | `GET /api/notes` |
| Filter notes | Filter controls | Founder, Assistants | Local query state | No | Yes | `GET /api/notes` |

## Note Detail

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Save note | Save | Founder, creator | Updates note | No | Yes | `PATCH /api/notes/:id` |
| Link entity | Link | Founder, creator | Updates note link | No | Yes | `PATCH /api/notes/:id` |
| Delete note | Delete | Founder, creator | Deletes note | Yes | Yes | `DELETE /api/notes/:id` |

## AI Assistant

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Extract tasks | Extract Tasks | Founder, Assistants | Creates suggestions | No | Yes | `POST /api/ai/extract-tasks` |
| Summarize meeting | Summarize Meeting | Founder, Assistants | Creates suggestions | No | Yes | `POST /api/ai/summarize-meeting` |
| Approve suggestion | Approve | Founder, Assistants | Marks suggestion approved | No | Yes | Normal create/update endpoints |
| Reject suggestion | Reject | Founder, Assistants | Marks suggestion rejected | No | Yes | None |
| Save approved tasks | Create Approved Tasks | Founder, Assistants | Creates tasks | Yes | Yes | `POST /api/tasks` |

## Reports

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Filter week | Week selector | Founder | Changes report period | No | Yes | `GET /api/reports/weekly` |
| Open task | Task item | Founder | Opens task drawer | No | Yes | `GET /api/tasks` |
| Generate weekly summary | Generate Summary Draft | Founder | Creates AI draft | No | Yes | `POST /api/ai/weekly-summary` |
| View routine metrics | Routine metrics cards | Founder | No data mutation | No | Yes | Future report endpoint |

## Settings

| Action | Trigger Label | Who Can Use | Changes | Confirmation | Mock-Only Now | Future API |
| --- | --- | --- | --- | --- | --- | --- |
| Switch mock user | User switcher | Phase 2 demo user | Changes mock current user | No | Yes | None |
| Edit profile | Save Profile | Current user | Updates profile | No | Yes | Future user endpoint |
| Edit team member | Save Member | Founder | Updates user | No | Yes | Future user endpoint |
| Toggle assistant task creation | Allow Assistant Task Creation | Founder | Updates preference | No | Yes | Future settings endpoint |
| Mock-create routine | Create Routine | Founder | Adds local routine definition | No | Yes | Future routine endpoint |
| Toggle routine active | Active toggle | Founder | Updates local routine active state | No | Yes | Future routine endpoint |
