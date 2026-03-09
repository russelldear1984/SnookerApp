'use client';

import { AppShell } from '@/components/AppShell';
import { SectionTitle, StandingsTable } from '@/components/Cards';
import { useAppState } from '@/state/AppStateContext';

export default function SinglesStandingsPage() {
  const { state } = useAppState();
  return (
    <AppShell title="Singles League Table">
      <SectionTitle title="Summer Pro Open" right={<span className="rounded bg-brand-500 px-2 py-1 text-white">LIVE</span>} />
      <StandingsTable rows={state.singlesStandings} nameOf={(id) => state.players.find((p)=>p.id===id)?.name ?? id} />
      <SectionTitle title="Tournament High Breaks" />
      <div className="card p-4">{[...state.players].sort((a,b)=>b.highestBreak-a.highestBreak).slice(0,5).map((p)=><p key={p.id} className="py-1 font-medium">{p.name} <span className="float-right text-brand-700">{p.highestBreak}</span></p>)}</div>
    </AppShell>
  );
}
