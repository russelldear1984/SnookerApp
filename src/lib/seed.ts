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
    { id: 't1', name: 'Smith / Jones', playerIds: ['p1', 'p2'], group: 'A' },
    { id: 't2', name: 'Doe / Brown', playerIds: ['p3', 'p4'], group: 'A' },
    { id: 't3', name: 'Wilson / Lee', playerIds: ['p5', 'p6'], group: 'A' },
    { id: 't4', name: 'Garcia / Miller', playerIds: ['p1', 'p3'], group: 'A' },
    { id: 't5', name: 'Taylor / Clark', playerIds: ['p2', 'p4'], group: 'B' },
    { id: 't6', name: 'Davis / White', playerIds: ['p5', 'p1'], group: 'B' },
    { id: 't7', name: 'Evans / King', playerIds: ['p6', 'p3'], group: 'B' },
    { id: 't8', name: 'Baker / Hill', playerIds: ['p4', 'p2'], group: 'B' }
  ],
  bookings: [
    { id: 'b1', date: '2026-03-10', startTime: '19:00', endTime: '20:00', type: 'CASUAL', status: 'CONFIRMED', participantIds: ['p1'] },
    { id: 'b2', date: '2026-03-10', startTime: '20:30', endTime: '22:00', type: 'SINGLES_TOURNAMENT', status: 'CONFIRMED', participantIds: ['p2', 'p3'] }
  ],
  tournaments: [
    { id: 'singles', name: 'Summer Pro Open', type: 'SINGLES', active: true },
    { id: 'doubles', name: 'Summer Doubles Cup', type: 'DOUBLES', active: true }
  ],
  matches: [
    { id: 'm1', tournamentId: 'singles', stage: 'GROUP', side1Id: 'p1', side2Id: 'p2', type: 'SINGLES', result: { score1: 3, score2: 1, winnerId: 'p1' } },
    { id: 'm2', tournamentId: 'doubles', stage: 'GROUP', group: 'A', side1Id: 't1', side2Id: 't2', type: 'DOUBLES', result: { score1: 4, score2: 2, winnerId: 't1' } },
    { id: 'm3', tournamentId: 'doubles', stage: 'GROUP', group: 'B', side1Id: 't5', side2Id: 't6', type: 'DOUBLES', result: { score1: 4, score2: 3, winnerId: 't5' } }
  ],
  singlesStandings: [],
  doublesStandingsA: [],
  doublesStandingsB: [],
  knockout: [
    { id: 'k1', round: 'SEMI' },
    { id: 'k2', round: 'SEMI' },
    { id: 'k3', round: 'FINAL' }
  ]
};
