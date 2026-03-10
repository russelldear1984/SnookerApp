'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { validateBooking } from '@/lib/booking';
import { buildQualifiedStandings, progressKnockout, seedKnockout } from '@/lib/knockout';
import { seedState } from '@/lib/seed';
import { loadState, saveState } from '@/lib/storage';
import { recalcStandings } from '@/lib/standings';
import { AppState, Booking, Match, Stage, TournamentType } from '@/lib/types';

interface Ctx {
  state: AppState;
  entryOptions: { id: string; name: string }[];
  getEntryName: (id: string) => string;
  addBooking: (booking: Omit<Booking, 'id'>) => { ok: boolean; message?: string };
  submitResult: (payload: { stage: Stage; group?: string; side1Id: string; side2Id: string; score1: number; score2: number; notes?: string; knockoutMatchId?: string }) => void;
  addPlayer: (name: string) => void;
  deletePlayer: (id: string) => void;
  addTeam: (name: string, p1: string, p2: string, group: string) => void;
  setKnockoutWinner: (matchId: string, winnerId: string) => void;
}

const AppStateContext = createContext<Ctx | null>(null);

function buildStandingsByGroup(state: AppState) {
  const tournament = state.activeTournament;
  const groupMatches = state.matches.filter((m) => m.tournamentId === tournament.id && m.stage === 'GROUP');

  const raw: Record<string, ReturnType<typeof recalcStandings>> = {};

  tournament.groups.forEach((group) => {
    const participants = tournament.type === 'SINGLES'
      ? tournament.participantIds
      : state.teams.filter((t) => t.group === group).map((t) => t.id);

    const matches = groupMatches.filter((m) => (tournament.groups.length === 1 ? true : m.group === group));
    raw[group] = recalcStandings(participants, matches);
  });

  return buildQualifiedStandings(raw);
}

function compute(state: AppState): AppState {
  const standingsByGroup = buildStandingsByGroup(state);
  const knockout = seedKnockout(state.knockout, standingsByGroup);
  return { ...state, standingsByGroup, knockout };
}

function reducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case 'hydrate':
      return compute(action.payload);
    case 'addBooking':
      return compute({ ...state, bookings: [...state.bookings, action.payload] });
    case 'submitResult':
      return compute({ ...state, matches: [...state.matches, action.payload.match], knockout: action.payload.knockout });
    case 'addPlayer':
      return compute({
        ...state,
        players: [...state.players, action.payload],
        activeTournament: state.activeTournament.type === 'SINGLES'
          ? { ...state.activeTournament, participantIds: [...state.activeTournament.participantIds, action.payload.id] }
          : state.activeTournament
      });
    case 'deletePlayer':
      return compute({
        ...state,
        players: state.players.filter((p) => p.id !== action.payload),
        teams: state.teams.filter((t) => !t.playerIds.includes(action.payload)),
        bookings: state.bookings.filter((b) => !b.participantIds.includes(action.payload)),
        matches: state.matches.filter((m) => m.side1Id !== action.payload && m.side2Id !== action.payload),
        activeTournament: state.activeTournament.type === 'SINGLES'
          ? { ...state.activeTournament, participantIds: state.activeTournament.participantIds.filter((id) => id !== action.payload) }
          : state.activeTournament
      });
    case 'addTeam':
      return compute({
        ...state,
        teams: [...state.teams, action.payload],
        activeTournament: state.activeTournament.type === 'DOUBLES'
          ? { ...state.activeTournament, participantIds: [...state.activeTournament.participantIds, action.payload.id] }
          : state.activeTournament
      });
    case 'setKnockoutWinner':
      return compute({ ...state, knockout: progressKnockout(state.knockout, action.payload.matchId, action.payload.winnerId) });
    default:
      return state;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, compute(seedState));

  useEffect(() => {
    dispatch({ type: 'hydrate', payload: loadState() });
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<Ctx>(() => {
    const getEntryName = (id: string) =>
      state.players.find((p) => p.id === id)?.name || state.teams.find((t) => t.id === id)?.name || id;

    const entryOptions = state.activeTournament.type === 'SINGLES'
      ? state.players.filter((p) => state.activeTournament.participantIds.includes(p.id)).map((p) => ({ id: p.id, name: p.name }))
      : state.teams.filter((t) => state.activeTournament.participantIds.includes(t.id)).map((t) => ({ id: t.id, name: t.name }));

    return {
      state,
      entryOptions,
      getEntryName,
      addBooking: (booking) => {
        const result = validateBooking(booking, state.bookings);
        if (!result.ok) return result;
        dispatch({ type: 'addBooking', payload: { ...booking, id: `b${Date.now()}` } });
        return { ok: true };
      },
      submitResult: (payload) => {
        const winnerId = payload.score1 >= payload.score2 ? payload.side1Id : payload.side2Id;
        const match: Match = {
          id: `m${Date.now()}`,
          tournamentId: state.activeTournament.id,
          stage: payload.stage,
          group: payload.group,
          side1Id: payload.side1Id,
          side2Id: payload.side2Id,
          type: state.activeTournament.type,
          result: { score1: payload.score1, score2: payload.score2, winnerId, notes: payload.notes }
        };

        let knockout = state.knockout;
        if (payload.knockoutMatchId) {
          knockout = progressKnockout(knockout, payload.knockoutMatchId, winnerId);
        }

        dispatch({ type: 'submitResult', payload: { match, knockout } });
      },
      addPlayer: (name) =>
        dispatch({ type: 'addPlayer', payload: { id: `p${Date.now()}`, name, wins: 0, losses: 0, highestBreak: 0 } }),
      deletePlayer: (id) => dispatch({ type: 'deletePlayer', payload: id }),
      addTeam: (name, p1, p2, group) =>
        dispatch({ type: 'addTeam', payload: { id: `t${Date.now()}`, name, playerIds: [p1, p2], group } }),
      setKnockoutWinner: (matchId, winnerId) => dispatch({ type: 'setKnockoutWinner', payload: { matchId, winnerId } })
    };
  }, [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
};

export const bookingTypeForTournament = (type: TournamentType) =>
  type === 'SINGLES' ? 'SINGLES_TOURNAMENT' : 'DOUBLES_TOURNAMENT';
