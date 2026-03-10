export type ID = string;
export type BookingType = 'CASUAL' | 'SINGLES_TOURNAMENT' | 'DOUBLES_TOURNAMENT';
export type BookingStatus = 'CONFIRMED' | 'PENDING';
export type TournamentType = 'SINGLES' | 'DOUBLES';
export type Stage = 'GROUP' | 'SEMI' | 'FINAL';

export interface Player { id: ID; name: string; avatar?: string; wins: number; losses: number; highestBreak: number; }
export interface DoublesTeam { id: ID; name: string; playerIds: [ID, ID]; group: string; }

export interface Booking {
  id: ID;
  date: string;
  startTime: string;
  endTime: string;
  type: BookingType;
  status: BookingStatus;
  participantIds: [ID, ID];
  notes?: string;
}

export interface ActiveTournament {
  id: ID;
  name: string;
  type: TournamentType;
  groups: string[];
  participantIds: ID[];
}

export interface MatchResult {
  score1: number;
  score2: number;
  winnerId: ID;
  notes?: string;
}

export interface Match {
  id: ID;
  tournamentId: ID;
  stage: Stage;
  group?: string;
  side1Id: ID;
  side2Id: ID;
  type: TournamentType;
  result?: MatchResult;
}

export interface StandingsRow {
  sideId: ID;
  played: number;
  won: number;
  lost: number;
  points: number;
  scoreDiff: number;
  rank: number;
  qualified?: boolean;
}

export interface KnockoutMatch {
  id: ID;
  round: 'SEMI' | 'FINAL';
  side1Id?: ID;
  side2Id?: ID;
  winnerId?: ID;
}

export interface AppState {
  players: Player[];
  teams: DoublesTeam[];
  bookings: Booking[];
  activeTournament: ActiveTournament;
  matches: Match[];
  standingsByGroup: Record<string, StandingsRow[]>;
  knockout: KnockoutMatch[];
}
