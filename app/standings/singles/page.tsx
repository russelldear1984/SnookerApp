'use client';

import { AppShell } from '@/components/AppShell';
import { SectionTitle, StandingsTable } from '@/components/Cards';
import { useAppState } from '@/state/AppStateContext';

export default function StandingsPage() {
  const { state, getEntryName } = useAppState();
  const groups = Object.keys(state.standingsByGroup);

  return (
    <AppShell title="Tournament Standings">
      <div className="card p-5">
        <p className="text-3xl font-bold">{state.activeTournament.name}</p>
        <p className="text-slate-500">Active Tournament • {state.activeTournament.type}</p>
      </div>

      {groups.map((group) => (
        <div key={group} className="space-y-2">
          <SectionTitle title={groups.length > 1 ? `Group ${group}` : 'Standings'} />
          <StandingsTable rows={state.standingsByGroup[group]} nameOf={getEntryName} />
        </div>
      ))}
    </AppShell>
  );
}
