import { AppState } from './types';

export const seedState: AppState = {
  players: [
    { id: 'p1', name: "Ronnie O'Sullivan", wins: 7, losses: 1, highestBreak: 142 },
    { id: 'p2', name: 'Mark Selby', wins: 6, losses: 2, highestBreak: 135 },
    { id: 'p3', name: 'John Higgins', wins: 5, losses: 3, highestBreak: 124 },
    { id: 'p4', name: 'Judd Trump', wins: 4, losses: 4, highestBreak: 118 },
    { id: 'p5', name: 'Kyren Wilson', wins: 3, losses: 5, highestBreak: 110 },
    { id: 'p6', name: 'Luca Brecel', wins: 2, losses: 6, highestBreak: 102 }
  ],
  teams: [
    { id: 't1', name: 'Green Baize Kings', playerIds: ['p1', 'p2'], group: 'A' },
    { id: 't2', name: 'Cue Titans', playerIds: ['p3', 'p4'], group: 'A' },
    { id: 't3', name: 'Falcon Pots', playerIds: ['p5', 'p6'], group: 'B' },
    { id: 't4', name: 'Chalk Masters', playerIds: ['p1', 'p3'], group: 'B' }
  ],
  bookings: [
    { id: 'b1', date: '2026-03-10', startTime: '19:00', endTime: '20:00', type: 'CASUAL', status: 'CONFIRMED', participantIds: ['p1', 'p2'] },
    { id: 'b2', date: '2026-03-10', startTime: '20:30', endTime: '22:00', type: 'SINGLES_TOURNAMENT', status: 'CONFIRMED', participantIds: ['p3', 'p4'] }
  ],
  activeTournament: {
    id: 'singles-2026',
    name: 'Summer Pro Open',
    type: 'SINGLES',
    groups: ['A'],
    participantIds: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']
  },
  matches: [
    { id: 'm1', tournamentId: 'singles-2026', stage: 'GROUP', group: 'A', side1Id: 'p1', side2Id: 'p2', type: 'SINGLES', result: { score1: 3, score2: 1, winnerId: 'p1' } },
    { id: 'm2', tournamentId: 'singles-2026', stage: 'GROUP', group: 'A', side1Id: 'p3', side2Id: 'p4', type: 'SINGLES', result: { score1: 2, score2: 3, winnerId: 'p4' } }
  ],
  standingsByGroup: {},
  knockout: [
    { id: 'k1', round: 'SEMI' },
    { id: 'k2', round: 'SEMI' },
    { id: 'k3', round: 'FINAL' }
  ]
};
