# Data Connection Status

| Entity | Local mode | Supabase read | Supabase create | Supabase update | Supabase delete | Notes |
|---|---|---:|---:|---:|---:|---|
| profiles | Mock users | Yes | No | Yes | No | `getCurrentProfile()` and `updateProfile()` exist; signup/onboarding not built. |
| projects | localStorage | Yes | Yes | Yes | Data layer only | UI does not expose project delete yet. |
| tasks | localStorage | Yes | Yes | Yes | Yes | Supports nullable Supabase deadline for No Date calendar tasks. |
| meetings | localStorage | Yes | Yes | Yes | Yes | Decisions map to/from JSONB array. |
| action items | localStorage | Yes | Yes | Yes | Yes | Conversion to task is implemented in data layer. |
| notes | localStorage | Yes | Yes | Yes | Yes | Links to project/task/meeting are preserved. |
| routines | localStorage | Yes | Yes | Yes | Yes | Toggle active/inactive is connected. |
| routine completions | localStorage | Yes | Yes via upsert | Yes via upsert | Yes | Unique key: `routine_id`, `user_id`, `date`. |
| activity logs | local state/localStorage | Yes | Yes | No | No | Append-only by design for now. |
| ai outputs | Mock/localStorage | Yes | Yes | No | No | Stored records only; no real AI calls. |

## Important Mode Behavior

`NEXT_PUBLIC_DATA_MODE=local`:

- uses localStorage
- works with empty Supabase env variables
- remains the default

`NEXT_PUBLIC_DATA_MODE=supabase`:

- uses Supabase for core collections
- logs warnings if env/session/database access is missing
- keeps the current UI from crashing during failed writes

## Remaining Data Work

- Make provider actions explicitly async.
- Add user-visible error states for failed Supabase writes.
- Add route protection once auth/profile mapping is finalized.
- Decide whether project delete should be exposed in UI.
