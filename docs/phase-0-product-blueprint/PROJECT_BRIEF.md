# Eventum Ops Cockpit - Project Brief

## Product Name

Eventum Ops Cockpit

## Product Type

A private internal operations cockpit for the Eventum team.

This is not a public SaaS, CRM, Notion clone, generic project management tool, billing platform, or multi-workspace collaboration product.

## Team Context

Eventum Ops Cockpit is designed for a focused 4-person internal team:

- Founder
- Assistant 1 - Publishing & Documentation
- Assistant 2 - Content & Social Ops
- Assistant 3 - Production / Coordination

## Core Problem

The Eventum team loses execution clarity because:

- Tasks are forgotten.
- Meeting decisions are not reliably captured.
- Action items do not always become tracked work.
- Priorities become unclear across daily, weekly, and monthly cycles.
- The founder lacks a live operational dashboard.
- Reports are difficult to assemble from scattered information.

## Product Goal

Build a practical internal system where the Eventum team can manage:

- Daily, weekly, monthly, and one-time tasks
- Projects
- Meeting notes
- Decisions
- Action items
- Notes and internal documentation
- Operational reports
- Founder dashboard
- AI-assisted task extraction and briefings

## Product Principle

The system must work without AI first.

AI improves execution by reading and producing structured suggestions from real operational data. AI is not the foundation of the system and must not directly write to the database without user confirmation.

## Success Criteria

The product is successful when:

- The founder can understand today's operational state in under 60 seconds.
- Each assistant can see exactly what they should work on today.
- Meeting action items can reliably become tracked tasks.
- Weekly execution health can be reviewed without manual spreadsheet work.
- Overdue, blocked, and review-needed work is visible.
- AI suggestions are useful but always reviewable before being saved.

## Target Platform

Desktop-first responsive web application.

Mobile polish is not part of the early product scope.

## Technical Direction

Frontend:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion for subtle animation
- Component-based architecture

Backend:

- Supabase Postgres, or a clean API layer if backend infrastructure is already prepared
- Supabase Auth only when authentication becomes necessary
- Supabase Realtime later for live dashboard updates

AI:

- Provider-agnostic AI service layer
- Structured JSON outputs
- Review-before-save workflow
- No provider-specific logic in UI components

## Design Direction

The interface should feel like:

- Private operations room
- Internal team brain
- Founder control tower
- AI-powered execution cockpit

The interface should avoid:

- Generic admin dashboard styling
- Public SaaS marketing patterns
- CRM workflows
- Cluttered task manager layouts
- Full document-editor complexity

Visual base:

- Dark mode by default
- Near-black background
- Dark navy and gray surfaces
- Soft borders
- Rounded cards
- Subtle purple glow
- Eventum purple accent
- Neon lime active/live accent
- Clean modern typography

## Phase 0 Outcome

Phase 0 defines what will be built, what will not be built, and how later phases should proceed.

No production app screens, backend integration, authentication, or AI provider wiring should be built in Phase 0.
