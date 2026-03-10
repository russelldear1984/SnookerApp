'use client';

import { FormEvent, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { BookingCard, SectionTitle } from '@/components/Cards';
import { useAppState, bookingTypeForTournament } from '@/state/AppStateContext';

export default function SchedulePage() {
  const { state, addBooking, entryOptions, getEntryName } = useAppState();
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const side1 = form.get('side1') as string;
    const side2 = form.get('side2') as string;

    if (side1 === side2) {
      setMessage('Player / Team 1 and Player / Team 2 must be different.');
      return;
    }

    const result = addBooking({
      date: form.get('date') as string,
      startTime: form.get('start') as string,
      endTime: form.get('end') as string,
      type: (form.get('type') as any) || bookingTypeForTournament(state.activeTournament.type),
      status: 'CONFIRMED',
      participantIds: [side1, side2]
    });

    setMessage(result.ok ? 'Booking created and visible immediately.' : result.message ?? 'Validation failed');
    if (result.ok) e.currentTarget.reset();
  };

  return (
    <AppShell title="Schedule">
      <div className="card p-4">
        <SectionTitle title="Book the Table" />
        <form className="mt-3 space-y-2" onSubmit={onSubmit}>
          <input className="input" type="date" name="date" required />
          <div className="grid grid-cols-2 gap-2">
            <input className="input" type="time" name="start" required />
            <input className="input" type="time" name="end" required />
          </div>
          <select className="input" name="type" defaultValue={bookingTypeForTournament(state.activeTournament.type)}>
            <option value="CASUAL">Casual</option>
            <option value="SINGLES_TOURNAMENT">Singles Tournament</option>
            <option value="DOUBLES_TOURNAMENT">Doubles Tournament</option>
          </select>
          <select className="input" name="side1" required>
            <option value="">Player / Team 1</option>
            {entryOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
          </select>
          <select className="input" name="side2" required>
            <option value="">Player / Team 2</option>
            {entryOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
          </select>
          <button className="btn-primary w-full" type="submit">Create Booking</button>
        </form>
        {message && (
          <p className={`mt-3 rounded-xl p-3 ${message.includes('Conflict') || message.includes('must') || message.includes('Start') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-brand-700'}`}>
            {message}
          </p>
        )}
      </div>

      <SectionTitle title="Upcoming Bookings" />
      {[...state.bookings]
        .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))
        .map((booking) => <BookingCard key={booking.id} booking={booking} nameOf={getEntryName} />)}
    </AppShell>
  );
}
