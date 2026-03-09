# Gamlingay Social Club Snooker Booking & Tournament Manager

A responsive Next.js App Router application based on the provided Stitch exports.

## Features
- Dashboard with quick actions, upcoming bookings, latest result, and tournament summary.
- Schedule/booking flow with single-table conflict detection.
- Results entry for singles and doubles with automatic winner inference.
- Auto-recalculated singles and doubles standings.
- Doubles Group A/B qualification and knockout bracket seeding/progression.
- Players and doubles team management.
- localStorage persistence for app state.

## Tech
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Local setup
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Static export build
This app is configured for fully static hosting (GitHub Pages compatible):
- `output: 'export'`
- client-side state + localStorage persistence only
- no API routes/server actions/backend runtime required

Run a static build:
```bash
npm run build
```
The generated static site is written to `out/`.

## GitHub Pages deployment
A GitHub Actions workflow is included at:
- `.github/workflows/deploy-pages.yml`

### One-time repository settings
1. In GitHub, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually).

### Base path behavior (project site vs user site)
The workflow supports repository subpaths and sets `NEXT_PUBLIC_BASE_PATH` automatically:
- **Project site** (`https://<user>.github.io/<repo>/`): uses `/<repo>`.
- **User/org site** (`https://<user>.github.io/`): uses empty base path.

You can override this by setting a repository variable:
- `PAGES_BASE_PATH` (example: `/SnookerApp`)

### Manual deploy build (optional)
If you want to build exactly like the workflow locally for a project site:
```bash
NEXT_PUBLIC_BASE_PATH=/SnookerApp npm run build
```

## Data and persistence
- Seeded mock data is loaded initially (`src/lib/seed.ts`).
- State persists to localStorage key `gsm.v1.state` (`src/lib/storage.ts`).

## Core business rules implemented
- One table only.
- Booking must have start before end.
- No overlapping bookings on the same date.
- New bookings appear instantly in schedule list.
- Standings ranking logic:
  1. points (win = 2, loss = 0)
  2. score difference
  3. alphabetical fallback by ID

## Backend integration notes
To connect to a backend later:
1. Replace `src/lib/storage.ts` with API-backed repository methods.
2. Keep `src/state/AppStateContext.tsx` action contracts stable.
3. Optionally move standings/qualification/knockout calculation to server endpoints and keep the same return shapes.
