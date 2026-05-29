# Phase 3.1 - Complete Supabase Data Connection

## Goal

Phase 3.1 makes Supabase mode realistically testable while preserving localStorage mode.

Local mode remains the default and works without Supabase environment variables.

Supabase mode now hydrates all core collections and routes writes through the data layer instead of page components.

## Problems Fixed

- Supabase mode no longer hydrates only profiles, projects, and tasks.
- Projects create/update now call Supabase in Supabase mode.
- Meetings now have Supabase read/create/update/delete functions.
- Meeting action items now have Supabase read/create/update/delete functions.
- Action item to task conversion now has a Supabase data-layer function.
- Notes now have Supabase read/create/update/delete functions.
- Routine tasks now have Supabase read/create/update/delete/toggle functions.
- Routine completions now use Supabase upsert behavior on `routine_id`, `user_id`, and `date`.
- Activity logs now have Supabase read/create functions.
- AI outputs can be read/created as stored records, but no real AI calls were added.
- The provider now hydrates all core collections in Supabase mode.
- Database mismatch for no-date calendar tasks was fixed by allowing `tasks.deadline` to be nullable.

## Provider Behavior

`useOps()` remains stable for existing pages.

In local mode:

- existing localStorage behavior remains active
- mock user switcher remains active
- no Supabase env variables are required

In Supabase mode:

- profiles, projects, tasks, meetings, action items, notes, routines, routine completions, activity logs, and AI outputs hydrate from Supabase
- create/update/delete actions call the relevant data-layer functions
- failed Supabase writes log a useful warning instead of crashing the whole UI

## Supabase Mode Caveat

The current provider keeps synchronous action signatures for UI compatibility, so writes use local UI updates plus async Supabase writes. Phase 3.2 should move these actions to explicit async flows with user-visible error states.

## Still Not Implemented

- Real AI APIs
- Realtime subscriptions
- Telegram bot
- External integrations
- Billing
- Multi-workspace SaaS
- Full protected-route auth product
- Signup/onboarding

## Validation

- `npm run lint` passes.
- `npm run build` passes.
- Local mode still works.
- Team Tasks still has Status Board and Monthly Calendar Board.
