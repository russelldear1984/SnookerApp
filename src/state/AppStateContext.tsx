'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { validateBooking } from '@/lib/booking';
import { seedKnockout, progressKnockout, applyQualification } from '@/lib/knockout';
import { seedState } from '@/lib/seed';
import { loadState, saveState } from '@/lib/storage';
import { recalcDoubles, recalcSingles } from '@/lib/standings';
import { AppState, Booking, Match, Stage } from '@/lib/types';

interface Ctx {
  state: AppState;
  addBooking: (booking: Omit<Booking, 'id'>) => { ok: boolean; message?: string };
  submitResult: (payload: { tournamentId: string; stage: Stage; group?: 'A'|'B'; side1Id: string; side2Id: string; score1: number; score2: number; notes?: string }) => void;
  addPlayer: (name: string) => void;
  deletePlayer: (id: string) => void;
  addTeam: (name: string, p1: string, p2: string, group: 'A'|'B') => void;
  setKnockoutWinner: (matchId: string, winnerId: string) => void;
}

const AppStateContext = createContext<Ctx | null>(null);

function compute(state: AppState): AppState {
  const singles = recalcSingles(state.players.map((p) => p.id), state.matches);
  const aTeams = state.teams.filter((t) => t.group === 'A').map((t) => t.id);
  const bTeams = state.teams.filter((t) => t.group === 'B').map((t) => t.id);
  let a = recalcDoubles(aTeams, state.matches, 'A');
  let b = recalcDoubles(bTeams, state.matches, 'B');
  const q = applyQualification(a, b);
  a = q.groupA; b = q.groupB;
  const knockout = seedKnockout(state.knockout, a, b);
  return { ...state, singlesStandings: singles, doublesStandingsA: a, doublesStandingsB: b, knockout };
}

function reducer(state: AppState, action: any): AppState {
  switch (action.type) {
    case 'hydrate': return compute(action.payload);
    case 'addBooking': return compute({ ...state, bookings: [...state.bookings, action.payload] });
    case 'submitResult': return compute({ ...state, matches: [...state.matches, action.payload] });
    case 'addPlayer': return compute({ ...state, players: [...state.players, action.payload] });
    case 'deletePlayer': return compute({ ...state, players: state.players.filter((p) => p.id !== action.payload), teams: state.teams.filter((t) => !t.playerIds.includes(action.payload)) });
    case 'addTeam': return compute({ ...state, teams: [...state.teams, action.payload] });
    case 'setKnockoutWinner': return compute({ ...state, knockout: progressKnockout(state.knockout, action.payload.matchId, action.payload.winnerId) });
    default: return state;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, compute(seedState));

  useEffect(() => { dispatch({ type: 'hydrate', payload: loadState() }); }, []);
  useEffect(() => { saveState(state); }, [state]);

  const value = useMemo<Ctx>(() => ({
    state,
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
        tournamentId: payload.tournamentId,
        stage: payload.stage,
        group: payload.group,
        side1Id: payload.side1Id,
        side2Id: payload.side2Id,
        type: payload.tournamentId === 'doubles' ? 'DOUBLES' : 'SINGLES',
        result: { score1: payload.score1, score2: payload.score2, winnerId, notes: payload.notes }
      };
      dispatch({ type: 'submitResult', payload: match });
    },
    addPlayer: (name) => dispatch({ type: 'addPlayer', payload: { id: `p${Date.now()}`, name, wins: 0, losses: 0, highestBreak: 0 } }),
    deletePlayer: (id) => dispatch({ type: 'deletePlayer', payload: id }),
    addTeam: (name, p1, p2, group) => dispatch({ type: 'addTeam', payload: { id: `t${Date.now()}`, name, playerIds: [p1,p2], group } }),
    setKnockoutWinner: (matchId, winnerId) => dispatch({ type: 'setKnockoutWinner', payload: { matchId, winnerId } })
  }), [state]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
};
