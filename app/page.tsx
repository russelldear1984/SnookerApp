'use client';

import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { BookingCard, SectionTitle } from '@/components/Cards';
import { useAppState } from '@/state/AppStateContext';

export default function DashboardPage() {
  const { state, getEntryName } = useAppState();
  const latestMatch = [...state.matches].reverse().find((m) => m.result);

  return (
    <AppShell title="Gamlingay Snooker Club App">
      <SectionTitle title="Quick Actions" />
      <div className="grid grid-cols-2 gap-3">
        <Link href="/schedule" className="card bg-brand-500 p-6 text-center text-2xl font-bold text-white">Book Table</Link>
        <Link href="/results/entry" className="card p-6 text-center text-2xl font-bold">Enter Result</Link>
      </div>

      <SectionTitle title="Upcoming Bookings" right={<Link href="/schedule" className="font-semibold text-brand-700">View All</Link>} />
      {state.bookings.slice(0, 3).map((booking) => <BookingCard key={booking.id} booking={booking} nameOf={getEntryName} />)}

      <SectionTitle title="Latest Result" />
      <div className="card p-4">
        {latestMatch?.result ? (
          <div>
            <p className="text-xl font-semibold">
              {getEntryName(latestMatch.side1Id)} {latestMatch.result.score1} - {latestMatch.result.score2} {getEntryName(latestMatch.side2Id)}
            </p>
            <p className="text-slate-500">{state.activeTournament.name} • {latestMatch.stage}</p>
          </div>
        ) : (
          <p className="text-slate-500">No results yet.</p>
        )}
      </div>
    </AppShell>
  );
}
