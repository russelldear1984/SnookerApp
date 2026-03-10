# Gamlingay Social Club Snooker Booking & Tournament Manager

## 1) App structure implied by the exported Stitch screens

The screens suggest a **mobile-first club operations app** with a unified dashboard and domain areas:

- **Dashboard (home/overview)**
  - Quick actions: Book Table, Enter Result
  - Upcoming bookings preview
  - Latest result preview
  - Tournament hub summary (leaders/high breaks)
- **Booking/Schedule module**
  - Daily/Weekly views
  - Calendar/date navigation
  - Booking cards with status (confirmed/pending)
  - Explicit conflict alert banner
  - Single-table availability constraints
- **Results Entry module**
  - Form-driven result entry
  - Stage selection (Group/Semi/Final)
  - Player/team selectors
  - Frame score inputs and auto winner
  - Recent results feed
- **Standings module (Singles and Doubles)**
  - Table rankings with P/W/L/PTS
  - Live/completed tournament tabs
  - High breaks side panel/list
  - Doubles split into Group A and Group B
  - Qualification markers (Qualified / In Position)
- **Knockout module**
  - Bracket progression cards
  - Quarter-final -> Semi-final -> Final flow
  - Live match indicator support
  - Entrants sourced from qualifiers
- **Players & Teams management module**
  - Manage individual players (create/edit/delete)
  - Manage doubles teams (create from 2 players)
  - Team overview cards and quick-create controls

Cross-cutting concerns implied by designs:
- Bottom-tab style mobile navigation with section-specific tabs.
- Shared design tokens (greens, neutral grays, rounded cards, icon-led controls).
- “Live/Active” states and lightweight status chips.
- Public-facing schedule visibility after booking creation.

## 2) Recommended implementation approach (Next.js + React + TypeScript + Tailwind)

### Architectural approach
- Use **Next.js App Router** with route groups for major domains.
- Build UI in **client components** where local state and localStorage hydration are needed.
- Keep business rules in pure **TypeScript domain modules** under `src/lib`.
- Keep storage adapter abstracted (`localStorage` implementation now, API adapter later).
- Use a centralized lightweight state layer via React Context + reducer (or Zustand if desired), wrapped by provider in root layout.

### UI conversion strategy from Stitch exports
- Translate each exported screen into:
  1. **Page shell/layout**
  2. **Reusable cards/sections**
  3. **Primitive components** (Badge, StatRow, SegmentedControl, etc.)
- Preserve spacing, typography scale, and color hierarchy using Tailwind custom theme tokens.
- Avoid one-off markup duplication by extracting repeated structures (booking cards, standings rows, match cards).

### Future backend readiness
- Domain services should expose methods like `createBooking`, `submitResult`, `recomputeStandings`, `seedKnockout`.
- Persist through repository interfaces; switch from local storage repo to HTTP repo later without changing UI pages.

## 3) Routes/pages to create

Use App Router paths:

- `/` – Unified Club Dashboard (`unified_club_dashboard`)
- `/schedule` – Schedule & bookings (`schedule_bookings`)
- `/results/entry` – Enter match result (`results_entry`)
- `/standings/singles` – Singles standings (`updated_singles_standings`)
- `/standings/doubles` – Doubles standings with Group A/B (`updated_doubles_standings`)
- `/knockout` – Knockout bracket (`knockout_bracket`)
- `/members` – Players & doubles teams management (`players_teams_management`)

Optional supportive routes for cleaner UX:
- `/bookings/new` – Create booking form/modal route
- `/results/history` – Full results listing
- `/tournaments` – Tournament list/selector if multiple are active
- `/settings` – Club/tournament settings

## 4) Reusable components to create

### Layout/navigation
- `AppHeader` (title + leading/trailing icons)
- `BottomNav` (mobile tabs with active state)
- `PageSection` (consistent section heading spacing)
- `QuickActionCard`

### Booking/schedule
- `ScheduleToggle` (Daily/Weekly segmented control)
- `CalendarStrip` (month/day selection)
- `BookingCard`
- `BookingStatusBadge`
- `ConflictAlert`
- `BookingForm` (time inputs, participants, purpose)

### Results/standings
- `ResultEntryForm`
- `StageTabs` (Group/Semi/Final)
- `ScoreInputRow`
- `RecentResultCard`
- `StandingsTable`
- `StandingsRow`
- `HighBreaksCard`
- `QualificationTag`

### Knockout
- `BracketColumn`
- `BracketMatchCard`
- `BracketConnector`
- `LiveMatchBadge`

### Members management
- `PlayerCard`
- `TeamCard`
- `AddPlayerForm`
- `CreateTeamForm`
- `PlayerTeamSelector`

### Shared primitives
- `Badge`
- `IconButton`
- `EmptyState`
- `ConfirmDialog`
- `FormField`

## 5) Typed data model definitions

```ts
// Core IDs
export type ID = string;

export type TimestampISO = string; // ISO-8601

export type MatchStage = 'GROUP' | 'SEMI' | 'FINAL' | 'QUARTER_FINAL';
export type TournamentType = 'SINGLES' | 'DOUBLES';

export interface Player {
  id: ID;
  name: string;
  avatarUrl?: string;
  rank?: number;
  stats?: {
    wins: number;
    losses: number;
    framesWon: number;
    framesLost: number;
    highestBreak: number;
  };
  active: boolean;
  createdAt: TimestampISO;
  updatedAt: TimestampISO;
}

export interface DoublesTeam {
  id: ID;
  name: string;
  playerIds: [ID, ID];
  formedAt: TimestampISO;
  active: boolean;
}

export interface Booking {
  id: ID;
  tableId: 'TABLE_1'; // single-table constraint
  date: string; // YYYY-MM-DD local club date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'CASUAL' | 'TOURNAMENT' | 'PRACTICE';
  participantIds: ID[]; // players involved
  title?: string;
  notes?: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: TimestampISO;
  updatedAt: TimestampISO;
}

export interface Tournament {
  id: ID;
  name: string;
  type: TournamentType;
  season: string; // e.g. "Summer 2024"
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
  settings: {
    winPoints: number; // default 3
    lossPoints: number; // default 0
    qualificationCountPerGroup?: number; // doubles: top 2
    groups?: ('A' | 'B')[];
  };
}

export interface MatchParticipant {
  entryType: TournamentType;
  playerId?: ID;
  teamId?: ID;
}

export interface MatchResult {
  participant1Frames: number;
  participant2Frames: number;
  winnerSide: 1 | 2;
  highestBreakP1?: number;
  highestBreakP2?: number;
  notes?: string;
  submittedAt: TimestampISO;
}

export interface Match {
  id: ID;
  tournamentId: ID;
  stage: MatchStage;
  group?: 'A' | 'B';
  scheduledAt?: TimestampISO;
  participant1?: MatchParticipant;
  participant2?: MatchParticipant;
  result?: MatchResult;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  bracketSlot?: string; // e.g. QF1, SF1, F1
}

export interface StandingsRow {
  entryId: ID; // playerId or teamId
  played: number;
  won: number;
  lost: number;
  points: number;
  framesFor: number;
  framesAgainst: number;
  frameDiff: number;
  highestBreak: number;
  rank: number;
  qualified?: boolean;
  inPosition?: boolean;
}

export interface TournamentStandings {
  tournamentId: ID;
  type: TournamentType;
  group?: 'A' | 'B';
  updatedAt: TimestampISO;
  rows: StandingsRow[];
}

export interface AppState {
  players: Player[];
  doublesTeams: DoublesTeam[];
  bookings: Booking[];
  tournaments: Tournament[];
  matches: Match[];
  standings: TournamentStandings[];
}
```

## 6) Utility/business-logic modules

- `datetime.ts`
  - Parse/combine date+time
  - Interval overlap helpers
  - Day/week range builders
- `booking-conflicts.ts`
  - Detect overlaps for `TABLE_1`
  - Produce conflict messages for UI
- `booking-service.ts`
  - Validate booking input
  - Enforce no-overlap rule
  - Create/update/cancel booking
- `results-service.ts`
  - Validate score entry
  - Auto-calculate winner
  - Persist result
- `standings-service.ts`
  - Recompute standings from all finished matches
  - Rank sorting & tie-breakers
  - Qualification flags
- `doubles-qualification.ts`
  - Resolve Group A/B qualifiers (top N)
  - Mark “qualified” and “in position”
- `knockout-service.ts`
  - Seed bracket from qualifiers
  - Advance winners to next rounds
- `seed-data.ts`
  - Mock initial data aligned to designs
- `storage/keys.ts`
  - Versioned localStorage keys
- `storage/local-storage-repo.ts`
  - Load/save state with schema guard and migrations

## 7) localStorage persistence plan

- Use one versioned root key, e.g. `gsm.v1.state`.
- On app start:
  1. Attempt load from localStorage (client side only).
  2. If absent, initialize from seeded mock data.
  3. If present but older schema version, run migration map.
- Persist on every mutating action (booking create, result submit, player edits, etc.).
- Add optional debounced write (100–300ms) to reduce churn.
- Keep deterministic derivations (like standings) either:
  - stored and refreshed after writes, or
  - recomputed on load and after each result mutation.
  - Recommended: recompute standings from match data to avoid drift.
- Add export/import JSON utility for manual backup/reset (useful during local-only phase).

## 8) Booking conflict detection plan

Given one table only, booking validation is global per day for `TABLE_1`.

### Rules
- A booking conflicts if intervals overlap:
  - `new.start < existing.end && new.end > existing.start`
- Edge-touch is allowed:
  - New starts exactly when existing ends => **no conflict**
- Ignore cancelled bookings in conflict checks.
- Optionally exclude current booking ID when editing.

### Flow
1. Convert `date + time` to comparable timestamps.
2. Validate start < end.
3. Fetch same-day bookings for table 1 where status != cancelled.
4. Check overlap against each booking.
5. If conflict exists, return structured error including conflicting slot(s) for UI banner text.
6. If no conflict, save and update public schedule list immediately (same state store).

## 9) Standings recalculation from results

Recalculate standings from **finished match results** (source of truth), not manual editing.

### Algorithm
1. Select tournament + scope (singles global or doubles by group).
2. Initialize row accumulator for all entrants.
3. For each finished match result:
   - Increment played for both entrants.
   - Increment won/lost based on winner.
   - Add points (`winPoints`/`lossPoints`).
   - Aggregate frames for/against.
   - Update highest break if supplied.
4. Compute derived values:
   - frameDiff = framesFor - framesAgainst
5. Sort with tie-breakers (recommended):
   1. points DESC
   2. frameDiff DESC
   3. framesFor DESC
   4. head-to-head (if available)
   5. name ASC (stable fallback)
6. Assign rank numbers.
7. Apply qualification markers based on configured cutoff.
8. Persist/re-render standings views.

## 10) Doubles Group A / Group B qualification -> knockout flow

Use deterministic cross-group seeding once group stage is complete (or progressively as “in position”).

### Qualification
- For each group (A, B), pick top `qualificationCountPerGroup` (default 2).
- Label top two as `qualified=true` once mathematically/administratively confirmed.
- If not finalized, show `inPosition` for provisional top two.

### Bracket seeding (4-team knockout)
- Semi-final 1: **A1 vs B2**
- Semi-final 2: **B1 vs A2**
- Winners -> Final

### Update behavior
- When standings change from new group result:
  - Re-evaluate qualifiers.
  - If semis not started, reseed semifinal participants.
  - If semis started/finished, lock seeds and only progress winners.
- Knockout page reads seeded matches and renders cards/connectors.

## 11) Ambiguities + sensible implementation decisions

- **Multiple bottom nav variants across screens**: adopt one app-wide nav and allow section-specific labels/icons where needed; keep visual style consistent.
- **Singles qualification text (“Top 2 qualify”) but no bracket link shown**: include CTA from standings to knockout when tournament has knockout stage.
- **Results entry currently player-based UI**: support both player and doubles team selectors depending on tournament type.
- **Status semantics (Live/Confirmed/Pending)**: standardize enums and map to chips.
- **High breaks scope ambiguity**: track per-player (singles) and per-team plus optional per-player within doubles; render whichever is available.
- **Recent results ordering**: use `submittedAt DESC` and cap preview length on dashboard/entry page.
- **Schedule daily/weekly interaction depth**: initial version can keep weekly as grouped daily cards; full time-grid can come later.
- **Notifications/share icons in headers**: wire as placeholders initially (no-op or toast), to preserve layout fidelity.

## 12) Proposed file/folder plan (whole project)

```text
SnookerApp/
├─ app/
│  ├─ layout.tsx
│  ├─ globals.css
│  ├─ page.tsx                           # dashboard
│  ├─ schedule/
│  │  └─ page.tsx
│  ├─ bookings/
│  │  └─ new/page.tsx
│  ├─ results/
│  │  ├─ entry/page.tsx
│  │  └─ history/page.tsx
│  ├─ standings/
│  │  ├─ singles/page.tsx
│  │  └─ doubles/page.tsx
│  ├─ knockout/
│  │  └─ page.tsx
│  ├─ members/
│  │  └─ page.tsx
│  └─ settings/
│     └─ page.tsx
├─ src/
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ AppHeader.tsx
│  │  │  ├─ BottomNav.tsx
│  │  │  └─ PageSection.tsx
│  │  ├─ dashboard/
│  │  │  ├─ QuickActionCard.tsx
│  │  │  ├─ UpcomingBookingPreview.tsx
│  │  │  └─ TournamentHubCard.tsx
│  │  ├─ bookings/
│  │  │  ├─ ScheduleToggle.tsx
│  │  │  ├─ CalendarStrip.tsx
│  │  │  ├─ BookingCard.tsx
│  │  │  ├─ BookingForm.tsx
│  │  │  └─ ConflictAlert.tsx
│  │  ├─ results/
│  │  │  ├─ ResultEntryForm.tsx
│  │  │  ├─ StageTabs.tsx
│  │  │  ├─ ScoreInputRow.tsx
│  │  │  └─ RecentResultCard.tsx
│  │  ├─ standings/
│  │  │  ├─ StandingsTable.tsx
│  │  │  ├─ StandingsRow.tsx
│  │  │  ├─ HighBreaksCard.tsx
│  │  │  └─ QualificationTag.tsx
│  │  ├─ knockout/
│  │  │  ├─BracketColumn.tsx
│  │  │  ├─BracketMatchCard.tsx
│  │  │  └─BracketConnector.tsx
│  │  ├─ members/
│  │  │  ├─ PlayerCard.tsx
│  │  │  ├─ TeamCard.tsx
│  │  │  ├─ AddPlayerForm.tsx
│  │  │  └─ CreateTeamForm.tsx
│  │  └─ ui/
│  │     ├─ Badge.tsx
│  │     ├─ IconButton.tsx
│  │     ├─ FormField.tsx
│  │     ├─ EmptyState.tsx
│  │     └─ ConfirmDialog.tsx
│  ├─ lib/
│  │  ├─ models/
│  │  │  ├─ ids.ts
│  │  │  ├─ player.ts
│  │  │  ├─ team.ts
│  │  │  ├─ booking.ts
│  │  │  ├─ tournament.ts
│  │  │  ├─ match.ts
│  │  │  └─ standings.ts
│  │  ├─ services/
│  │  │  ├─ booking-service.ts
│  │  │  ├─ results-service.ts
│  │  │  ├─ standings-service.ts
│  │  │  ├─ doubles-qualification.ts
│  │  │  └─ knockout-service.ts
│  │  ├─ utils/
│  │  │  ├─ datetime.ts
│  │  │  ├─ booking-conflicts.ts
│  │  │  ├─ ranking.ts
│  │  │  └─ validation.ts
│  │  ├─ data/
│  │  │  └─ seed-data.ts
│  │  └─ storage/
│  │     ├─ keys.ts
│  │     ├─ local-storage-repo.ts
│  │     └─ migrations.ts
│  ├─ state/
│  │  ├─ app-state-context.tsx
│  │  ├─ reducer.ts
│  │  ├─ selectors.ts
│  │  └─ actions.ts
│  └─ styles/
│     └─ tokens.ts
├─ public/
│  ├─ avatars/
│  └─ icons/
├─ tailwind.config.ts
├─ tsconfig.json
└─ package.json
```

## Build order (recommended)

1. **Scaffold foundation**: Next.js App Router + Tailwind + theme tokens + root layout + nav shell.
2. **Define domain types**: models and enums for players/teams/bookings/tournaments/matches/standings.
3. **State + persistence**: context/reducer + localStorage adapter + seed load + migrations.
4. **Booking module**: schedule page, booking cards/forms, conflict detection, immediate schedule updates.
5. **Members module**: player CRUD + doubles team creation and validation.
6. **Results entry module**: tournament/stage selectors, score input, winner auto-calc, recent results feed.
7. **Standings engine**: recompute singles/doubles standings from results with tie-breakers.
8. **Doubles qualification logic**: Group A/B qualifiers and in-position flags.
9. **Knockout module**: bracket seeding from qualifiers + winner advancement.
10. **Dashboard composition**: connect quick actions, upcoming bookings, latest result, tournament hub summary.
11. **Polish & QA**: empty/error states, responsive tweaks, design fidelity pass against Stitch exports.
12. **Backend-ready hardening**: repository interface extraction, API adapter stubs, import/export tools.
