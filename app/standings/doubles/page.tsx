'use client';

import { AppShell } from '@/components/AppShell';
import { SectionTitle, StandingsTable } from '@/components/Cards';
import { useAppState } from '@/state/AppStateContext';

export default function DoublesStandingsPage() {
  const { state } = useAppState();
  const nameOf = (id: string) => state.teams.find((t)=>t.id===id)?.name ?? id;
  return (
    <AppShell title="Tournament Standings">
      <div className="card p-4"><p className="text-3xl font-bold">Summer Doubles Cup</p><p className="text-slate-500">Mixed Doubles • Round Robin Stage</p></div>
      <SectionTitle title="Group A" right={<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-brand-700">Top 2 Qualify</span>} />
      <StandingsTable rows={state.doublesStandingsA} nameOf={nameOf} />
      <SectionTitle title="Group B" right={<span className="rounded-full bg-green-100 px-3 py-1 text-sm text-brand-700">Top 2 Qualify</span>} />
      <StandingsTable rows={state.doublesStandingsB} nameOf={nameOf} />
    </AppShell>
  );
}
