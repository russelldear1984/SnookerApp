import { KnockoutMatch, StandingsRow } from './types';

export function applyQualification(groupA: StandingsRow[], groupB: StandingsRow[]) {
  const mark = (rows: StandingsRow[]) => rows.map((r, i) => ({ ...r, qualified: i < 2, inPosition: i < 2 }));
  return { groupA: mark(groupA), groupB: mark(groupB) };
}

export function seedKnockout(knockout: KnockoutMatch[], groupA: StandingsRow[], groupB: StandingsRow[]): KnockoutMatch[] {
  const a1 = groupA[0]?.sideId; const a2 = groupA[1]?.sideId;
  const b1 = groupB[0]?.sideId; const b2 = groupB[1]?.sideId;
  return knockout.map((k) => {
    if (k.id === 'k1' && !k.winnerId) return { ...k, side1Id: a1, side2Id: b2 };
    if (k.id === 'k2' && !k.winnerId) return { ...k, side1Id: b1, side2Id: a2 };
    if (k.id === 'k3') {
      const w1 = knockout.find((x) => x.id === 'k1')?.winnerId;
      const w2 = knockout.find((x) => x.id === 'k2')?.winnerId;
      return { ...k, side1Id: w1, side2Id: w2 };
    }
    return k;
  });
}

export function progressKnockout(knockout: KnockoutMatch[], matchId: string, winnerId: string): KnockoutMatch[] {
  const updated = knockout.map((k) => (k.id === matchId ? { ...k, winnerId } : k));
  const w1 = updated.find((x) => x.id === 'k1')?.winnerId;
  const w2 = updated.find((x) => x.id === 'k2')?.winnerId;
  return updated.map((k) => (k.id === 'k3' ? { ...k, side1Id: w1, side2Id: w2 } : k));
}
