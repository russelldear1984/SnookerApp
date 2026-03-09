'use client';

import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { BookingCard, SectionTitle } from '@/components/Cards';
import { useAppState } from '@/state/AppStateContext';

export default function DashboardPage() {
  const { state } = useAppState();
  const latestMatch = [...state.matches].reverse().find((m) => m.result);
  const playerName = (id: string) => state.players.find((p) => p.id === id)?.name || state.teams.find((t) => t.id === id)?.name || id;

  return (
    <AppShell title="Gamlingay Snooker">
      <SectionTitle title="Quick Actions" />
      <div className="grid grid-cols-2 gap-3">
        <Link href="/schedule" className="card bg-brand-500 p-6 text-center text-2xl font-bold text-white">Book Table</Link>
        <Link href="/results/entry" className="card p-6 text-center text-2xl font-bold">Enter Result</Link>
      </div>

      <SectionTitle title="Upcoming Bookings" right={<Link href="/schedule" className="font-semibold text-brand-700">View All</Link>} />
      {state.bookings.slice(0, 3).map((b) => <BookingCard key={b.id} booking={b} />)}

      <SectionTitle title="Latest Result" />
      <div className="card p-4">
        {latestMatch?.result ? (
          <div>
            <p className="text-xl font-semibold">{playerName(latestMatch.side1Id)} {latestMatch.result.score1} - {latestMatch.result.score2} {playerName(latestMatch.side2Id)}</p>
            <p className="text-slate-500">{latestMatch.stage} • {latestMatch.type}</p>
          </div>
        ) : <p className="text-slate-500">No results yet.</p>}
      </div>

      <SectionTitle title="Tournament Hub" />
      <div className="card p-4">
        <p className="text-2xl font-bold">Autumn Club Open <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-sm text-brand-700">ACTIVE NOW</span></p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="font-semibold text-slate-500">Group Leaders</p>
            <p>Grp A: {state.teams.find((t) => t.id === state.doublesStandingsA[0]?.sideId)?.name ?? '-'}</p>
            <p>Grp B: {state.teams.find((t) => t.id === state.doublesStandingsB[0]?.sideId)?.name ?? '-'}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-500">Highest Breaks</p>
            {[...state.players].sort((a,b)=>b.highestBreak-a.highestBreak).slice(0,3).map((p)=><p key={p.id}>{p.name} - {p.highestBreak}</p>)}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
