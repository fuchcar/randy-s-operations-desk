# Randy's Operations Desk

An interactive demo of a personal operations command center for solo creatives — with a dry-witted AI assistant named Randy (a raccoon who takes his job very seriously).

▶ [Live demo](https://meet-randy-showcase.lovable.app)

## What it is

One calm screen that pulls a freelancer's whole operation together — today's priorities, money, clients, deliverables, and the week ahead — alongside an assistant that drafts the busywork so the human can get back to the craft. It's designed for the solo operator who would rather not run a small business on twelve browser tabs and a sticky note.

All data in this demo is fictional.

## Two ways to explore

- **Demo mode** — Browse a fully seeded fictional business. Every room is already populated, so you can see what the desk looks like on a real Tuesday.
- **Explore mode** — Type your own data and poke at the workflows. Whenever you trigger something that would normally be automated (sending an invoice, parsing a bank text, syncing the calendar, handing a task to Randy), Randy steps in with a tasteful "here's what *would* happen if this were wired to your real tools" popup. Nothing is sent anywhere.

## Features

- **Today** — A smart "do this next" card, a board-heat gauge, and prep for what's coming up.
- **Money & Bills** — Balance at a glance, money in/out for the month, and an owed-vs-paid bill ledger.
- **Clients CRM** — A master-detail mini-CRM with contact bios and job history.
- **Deliverables** — Project tracking with draggable progress sliders and subtask delegation.
- **Calendar** — A seven-day weekly view with color-coded event types.
- **Ask Randy** — A single input for anything that doesn't fit a room.
- **Guided tour** — Spotlight coachmarks that walk a first-time visitor through every room.
- **Theme system** — A warm editorial dark aesthetic with serif headings and a muted-gold accent.

## Tech

- React 19 + TanStack Start (TanStack Router, file-based routing)
- TypeScript (strict)
- Tailwind CSS v4
- framer-motion for transitions and coachmark overlays
- Zustand for in-memory app state
- Radix UI primitives + shadcn-style components
- lucide-react icons
- Vite 8

## Note

This is a sanitized public demo. It contains no real personal, client, or financial data.
