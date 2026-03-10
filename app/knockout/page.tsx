'use client';

import { AppShell } from '@/components/AppShell';
import { SectionTitle } from '@/components/Cards';
import { useAppState } from '@/state/AppStateContext';

export default function KnockoutPage() {
  const { state, setKnockoutWinner, getEntryName } = useAppState();

  return (
    <AppShell title="Knockout">
      <SectionTitle title={state.activeTournament.name} />
      <div className="grid gap-3 md:grid-cols-3">
        {state.knockout.map((match) => (
          <div key={match.id} className="card p-4">
            <p className="text-sm font-bold text-brand-700">{match.round}</p>
            <p className="mt-2">{getEntryName(match.side1Id ?? 'TBD')}</p>
            <p>{getEntryName(match.side2Id ?? 'TBD')}</p>

            {match.side1Id && match.side2Id && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded bg-slate-100 px-2 py-1 text-sm" onClick={() => setKnockoutWinner(match.id, match.side1Id!)}>
                  {getEntryName(match.side1Id)} won
                </button>
                <button className="rounded bg-slate-100 px-2 py-1 text-sm" onClick={() => setKnockoutWinner(match.id, match.side2Id!)}>
                  {getEntryName(match.side2Id)} won
                </button>
              </div>
            )}

            {match.winnerId && <p className="mt-2 rounded bg-green-100 px-2 py-1 text-sm text-brand-700">Winner: {getEntryName(match.winnerId)}</p>}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
