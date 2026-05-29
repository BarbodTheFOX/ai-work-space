# Eventum Ops Cockpit - Phase 2.6 Monthly Calendar

## Purpose

Phase 2.6 changes Team Tasks Calendar Board from a weekly board to a monthly board.

This remains a frontend-only local workspace update. No Supabase, backend routes, auth, external calendar library, or real AI integration was added.

## Monthly Calendar Behavior

The Calendar Board now shows one full month at a time.

- 7 columns: Mon, Tue, Wed, Thu, Fri, Sat, Sun
- 5 or 6 rows depending on the visible month
- Leading and trailing days from adjacent months are included and visually muted
- Today has a subtle warm highlight
- The month label shows the current visible month, such as `May 2026`

## Task Placement Logic

Tasks are placed by matching `task.deadline` to each calendar day id in `YYYY-MM-DD` format.

Each task appears as a compact calendar pill instead of a full task card. The compact pill shows:

- task title
- status text
- priority marker
- owner avatar or initial

Clicking a task pill opens the existing task drawer.

Tasks without a deadline remain in the `No date` section below the calendar.

## Calendar Controls

The board includes:

- Previous month
- Today
- Next month

The implementation uses `monthOffset` from the mock `today` date instead of the previous `weekOffset` logic.

## Filters

Existing Team Tasks filters still apply before rendering the monthly calendar:

- owner
- status
- project
- priority

The monthly calendar only shows filtered tasks.

## Design Notes

The monthly board follows the Eventum Workspace OS direction:

- warm workspace surfaces
- thin borders
- compact database-like task rows
- muted adjacent-month cells
- restrained color use
- no Google Calendar styling
- no large task cards inside day cells

## Remaining Mock-Only Limitations

- Calendar state is local UI state only.
- Task data is still localStorage-backed mock data.
- Clicking an empty day does not prefill task creation yet.
- There is no drag-and-drop.
- There is no recurring calendar expansion from routines.
- There is no backend persistence or multi-device sync.

## Quality Check

- `npm run lint` passes.
- `npm run build` passes.
- `/team-tasks` responds successfully in local dev.
- Status Board remains available.
- localStorage persistence remains unchanged.
