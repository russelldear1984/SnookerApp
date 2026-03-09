'use client';

import { AppShell } from '@/components/AppShell';
import { SectionTitle } from '@/components/Cards';
import { useAppState } from '@/state/AppStateContext';

export default function KnockoutPage() {
  const { state, setKnockoutWinner } = useAppState();
  const nameOf = (id?: string) => state.teams.find((t)=>t.id===id)?.name ?? (id || 'TBD');

  return (
    <AppShell title="World Snooker Masters">
      <SectionTitle title="Knockout Stage" />
      <div className="grid gap-3 md:grid-cols-3">
        {state.knockout.map((m) => (
          <div key={m.id} className="card p-4">
            <p className="text-sm font-bold text-brand-700">{m.round}</p>
            <p className="mt-2">{nameOf(m.side1Id)}</p>
            <p>{nameOf(m.side2Id)}</p>
            {m.side1Id && m.side2Id && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="rounded bg-slate-100 px-2 py-1 text-sm" onClick={()=>setKnockoutWinner(m.id, m.side1Id!)}>{nameOf(m.side1Id)} won</button>
                <button className="rounded bg-slate-100 px-2 py-1 text-sm" onClick={()=>setKnockoutWinner(m.id, m.side2Id!)}>{nameOf(m.side2Id)} won</button>
              </div>
            )}
            {m.winnerId && <p className="mt-2 rounded bg-green-100 px-2 py-1 text-sm text-brand-700">Winner: {nameOf(m.winnerId)}</p>}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
