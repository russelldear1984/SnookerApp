import { Match, StandingsRow } from './types';

function recalc(ids: string[], matches: Match[]): StandingsRow[] {
  const map = new Map<string, Omit<StandingsRow, 'rank'>>();
  ids.forEach((id) => map.set(id, { sideId: id, played: 0, won: 0, lost: 0, points: 0, scoreDiff: 0 }));

  matches.forEach((m) => {
    if (!m.result) return;
    const a = map.get(m.side1Id); const b = map.get(m.side2Id);
    if (!a || !b) return;
    a.played += 1; b.played += 1;
    a.scoreDiff += m.result.score1 - m.result.score2;
    b.scoreDiff += m.result.score2 - m.result.score1;
    if (m.result.winnerId === m.side1Id) { a.won += 1; a.points += 2; b.lost += 1; }
    else { b.won += 1; b.points += 2; a.lost += 1; }
  });

  return [...map.values()]
    .sort((x, y) => y.points - x.points || y.scoreDiff - x.scoreDiff || x.sideId.localeCompare(y.sideId))
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function recalcSingles(playerIds: string[], matches: Match[]) {
  return recalc(playerIds, matches.filter((m) => m.type === 'SINGLES' && m.stage === 'GROUP'));
}

export function recalcDoubles(groupTeamIds: string[], matches: Match[], group: 'A' | 'B') {
  return recalc(groupTeamIds, matches.filter((m) => m.type === 'DOUBLES' && m.stage === 'GROUP' && m.group === group));
}
