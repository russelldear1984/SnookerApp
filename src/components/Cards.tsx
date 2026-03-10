import { Booking, StandingsRow } from '@/lib/types';

export function SectionTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  return <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2>{right}</div>;
}

export function BookingCard({ booking, nameOf }: { booking: Booking; nameOf: (id: string) => string }) {
  const side1 = booking.participantIds[0] ? nameOf(booking.participantIds[0]) : 'TBD';
  const side2 = booking.participantIds[1] ? nameOf(booking.participantIds[1]) : 'TBD';

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-brand-700">{booking.type.replaceAll('_', ' ')}</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{booking.status}</span>
      </div>
      <p className="mt-2 text-sm text-slate-500">Date</p>
      <p className="font-semibold">{booking.date}</p>
      <p className="mt-1 text-sm text-slate-500">Time</p>
      <p className="text-xl font-semibold">{booking.startTime} - {booking.endTime}</p>
      <p className="mt-2 text-sm text-slate-500">Match</p>
      <p className="font-semibold">{side1} vs {side2}</p>
    </div>
  );
}

export function StandingsTable({ rows, nameOf }: { rows: StandingsRow[]; nameOf: (id: string) => string }) {
  if (!rows.length) return <div className="card p-4 text-slate-500">No standings yet.</div>;
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">#</th><th>Player/Team</th><th>P</th><th>W</th><th>L</th><th>PTS</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.sideId} className="border-t">
              <td className="p-3 font-semibold">{r.rank}</td>
              <td className="py-3 font-semibold">{nameOf(r.sideId)} {r.qualified && <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-brand-700">Qualified</span>}</td>
              <td>{r.played}</td><td>{r.won}</td><td>{r.lost}</td><td className="font-bold text-brand-700">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
