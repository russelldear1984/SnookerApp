import { KnockoutMatch, StandingsRow } from './types';

const addQualifiedFlags = (rows: StandingsRow[]) => rows.map((row, i) => ({ ...row, qualified: i < 2 }));

export function buildQualifiedStandings(byGroup: Record<string, StandingsRow[]>) {
  const result: Record<string, StandingsRow[]> = {};
  Object.entries(byGroup).forEach(([group, rows]) => {
    result[group] = addQualifiedFlags(rows);
  });
  return result;
}

export function getQualifierIds(byGroup: Record<string, StandingsRow[]>) {
  const groups = Object.keys(byGroup);
  if (groups.length >= 2) {
    const g1 = byGroup[groups[0]] ?? [];
    const g2 = byGroup[groups[1]] ?? [];
    return [g1[0]?.sideId, g1[1]?.sideId, g2[0]?.sideId, g2[1]?.sideId].filter(Boolean) as string[];
  }

  const only = byGroup[groups[0] ?? 'A'] ?? [];
  return only.slice(0, 4).map((r) => r.sideId);
}

export function seedKnockout(knockout: KnockoutMatch[], byGroup: Record<string, StandingsRow[]>) {
  const [q1, q2, q3, q4] = getQualifierIds(byGroup);

  return knockout.map((match) => {
    if (match.id === 'k1' && !match.winnerId) return { ...match, side1Id: q1, side2Id: q4 };
    if (match.id === 'k2' && !match.winnerId) return { ...match, side1Id: q3, side2Id: q2 };
    return match;
  });
}

export function progressKnockout(knockout: KnockoutMatch[], matchId: string, winnerId: string) {
  const updated = knockout.map((match) => (match.id === matchId ? { ...match, winnerId } : match));
  const semi1Winner = updated.find((m) => m.id === 'k1')?.winnerId;
  const semi2Winner = updated.find((m) => m.id === 'k2')?.winnerId;

  return updated.map((match) => (match.id === 'k3' ? { ...match, side1Id: semi1Winner, side2Id: semi2Winner } : match));
}
