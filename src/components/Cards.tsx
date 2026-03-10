import { Booking, StandingsRow } from '@/lib/types';

export function SectionTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <h2 className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">{title}</h2>
      {right}
    </div>
  );
}

export function BookingCard({ booking, nameOf }: { booking: Booking; nameOf: (id: string) => string }) {
  const side1 = booking.participantIds[0] ? nameOf(booking.participantIds[0]) : 'TBD';
  const side2 = booking.participantIds[1] ? nameOf(booking.participantIds[1]) : 'TBD';

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{booking.type.replaceAll('_', ' ')}</p>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{booking.status}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-500">Date</p>
      <p className="font-semibold text-slate-900">{booking.date}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">Time</p>
      <p className="text-xl font-bold text-slate-900">{booking.startTime} - {booking.endTime}</p>
      <p className="mt-2 text-sm font-medium text-slate-500">Match</p>
      <p className="font-semibold text-slate-900">{side1} <span className="text-emerald-700">vs</span> {side2}</p>
    </div>
  );
}

export function StandingsTable({ rows, nameOf }: { rows: StandingsRow[]; nameOf: (id: string) => string }) {
  if (!rows.length) return <div className="card p-4 text-slate-500">No standings yet.</div>;
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-emerald-50/60 text-xs uppercase text-slate-600"><tr><th className="p-3">#</th><th>Player/Team</th><th>P</th><th>W</th><th>L</th><th>PTS</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.sideId} className="border-t border-slate-100">
              <td className="p-3 font-semibold text-slate-900">{r.rank}</td>
              <td className="py-3 font-semibold text-slate-900">{nameOf(r.sideId)} {r.qualified && <span className="ml-2 rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Qualified</span>}</td>
              <td>{r.played}</td><td>{r.won}</td><td>{r.lost}</td><td className="font-bold text-emerald-700">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
