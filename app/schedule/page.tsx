'use client';

import { FormEvent, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { BookingCard, SectionTitle } from '@/components/Cards';
import { BookingType } from '@/lib/types';
import { useAppState } from '@/state/AppStateContext';

export default function SchedulePage() {
  const { state, addBooking } = useAppState();
  const [message, setMessage] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = addBooking({
      date: form.get('date') as string,
      startTime: form.get('start') as string,
      endTime: form.get('end') as string,
      type: form.get('type') as BookingType,
      status: 'CONFIRMED',
      participantIds: []
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
          <div className="grid grid-cols-2 gap-2"><input className="input" type="time" name="start" required /><input className="input" type="time" name="end" required /></div>
          <select className="input" name="type" defaultValue="CASUAL"><option value="CASUAL">Casual</option><option value="SINGLES_TOURNAMENT">Singles Tournament</option><option value="DOUBLES_TOURNAMENT">Doubles Tournament</option></select>
          <button className="btn-primary w-full" type="submit">Create Booking</button>
        </form>
        {message && <p className={`mt-3 rounded-xl p-3 ${message.startsWith('Conflict') || message.startsWith('Start') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-brand-700'}`}>{message}</p>}
      </div>

      <SectionTitle title="Upcoming Bookings" />
      {[...state.bookings].sort((a,b)=>`${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)).map((b)=> <BookingCard key={b.id} booking={b} />)}
    </AppShell>
  );
}
