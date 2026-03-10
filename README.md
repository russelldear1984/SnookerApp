# Gamlingay Social Club Snooker Booking & Tournament Manager

A responsive Next.js App Router application based on the provided Stitch exports.

## Features
- Dashboard with quick actions, upcoming bookings, and latest result.
- One **Active Tournament** configuration (Singles or Doubles, never both at once).
- Schedule/booking flow with single-table conflict detection.
- Booking form includes Player/Team 1 and Player/Team 2 selection.
- Results entry updates standings and knockout progression.
- Standings screen shows only the active tournament (supports variable group sizes).
- Knockout screen shows and progresses active tournament bracket.
- Members management for players and doubles teams.
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
