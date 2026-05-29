# Eventum Ops Cockpit - UI States

## Global State Principles

- Loading states should preserve layout shape.
- Empty states should suggest the next operational action.
- Error states should be clear and recoverable.
- Success states should be subtle.
- Disabled states should explain why an action is unavailable.

## Dashboard

Loading:

- Skeleton stat cards.
- Skeleton workload and project progress widgets.
- AI panel shows briefing placeholder.

Empty:

- "No operational data yet."
- Show actions: Create Task, Create Project.

Error:

- "Dashboard could not be loaded."
- Retry button.

Success:

- Brief status toast after task review or update.

Disabled:

- AI briefing button disabled when no task/project data exists.

Routine checklist:

- Empty when no active routines exist.
- Pending routines show a clear Check action.
- Skipped and missed routines use distinct badges.
- Check/uncheck only changes local mock state.

## Task List

Loading:

- Row skeletons with owner/avatar placeholders.

Empty:

- No tasks match current filters.
- Show Clear Filters and Create Task.

Error:

- Task list failed to load.

Success:

- Task created or updated toast.

Disabled:

- Delete disabled for assistants on other users' tasks.

## Task Board

Loading:

- Column skeletons for todo, in_progress, waiting, review, done, blocked.

Empty:

- Board columns remain visible with "No tasks here."

Error:

- Board failed to load.

Success:

- Status update feedback when task moves columns.

Disabled:

- Drag/status change disabled for tasks user cannot edit.

## Task Detail Drawer

Loading:

- Drawer opens with field skeletons.

Empty:

- No task selected state if drawer area is persistent.

Error:

- Could not load task details.

Success:

- Changes saved indicator.

Disabled:

- Owner, priority, and delete controls disabled for users without permission.

## Project Cards

Loading:

- Card grid skeleton.

Empty:

- No projects yet; show initial Eventum project setup prompt.

Error:

- Project list failed to load.

Success:

- Project created or updated feedback.

Disabled:

- Edit project disabled for assistants.

## Meeting List

Loading:

- Meeting card skeletons.

Empty:

- No meetings yet; show Create Meeting.

Error:

- Meeting list failed to load.

Success:

- Meeting created feedback.

Disabled:

- AI extraction disabled if meeting has no raw notes.

## Meeting Detail

Loading:

- Metadata, notes, and action item skeletons.

Empty:

- Raw notes area focused with prompt to capture meeting notes.

Error:

- Meeting not found or failed to load.

Success:

- Notes saved, decision added, action item converted.

Disabled:

- Convert to task disabled until action item has title, owner, and deadline.
- Save AI output disabled until at least one suggestion is approved.

## Notes

Loading:

- Note card skeletons.

Empty:

- No notes found; show Create Note.

Error:

- Notes failed to load.

Success:

- Note saved feedback.

Disabled:

- Delete disabled for users without permission.

## AI Assistant

Loading:

- "Generating structured suggestions" panel.
- Preserve user input.

Empty:

- Show prompt starters:
  - Extract tasks from raw text
  - Summarize meeting notes
  - Generate daily briefing
  - Generate founder briefing
  - Generate weekly summary draft

Error:

- AI unavailable message.
- Retry button.
- Manual create task fallback.

Success:

- Suggestions generated.
- Approved items created after confirmation.

Disabled:

- Submit disabled when input is empty.
- Create approved tasks disabled until at least one suggestion is approved.
- AI actions disabled if no mock context exists for selected action.

## Reports

Loading:

- Metric card and chart/widget skeletons.

Empty:

- Not enough data for selected week.
- Show different week selector.

Error:

- Report failed to load.

Success:

- Weekly summary draft generated.

Disabled:

- Export disabled or absent in v1.
- AI weekly summary disabled when report has no data.
- Routine consistency metrics disabled when no routine completions exist for the selected week.
