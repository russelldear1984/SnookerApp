import { Booking } from './types';

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export function validateBooking(candidate: Omit<Booking, 'id'>, existing: Booking[], editingId?: string) {
  const start = toMinutes(candidate.startTime);
  const end = toMinutes(candidate.endTime);
  if (start >= end) return { ok: false, message: 'Start time must be before end time.' };

  const sameDay = existing.filter((b) => b.date === candidate.date && b.id !== editingId);
  const overlap = sameDay.find((b) => {
    const bStart = toMinutes(b.startTime);
    const bEnd = toMinutes(b.endTime);
    return start < bEnd && end > bStart;
  });

  if (overlap) return { ok: false, message: `Conflict detected: ${overlap.startTime} - ${overlap.endTime} is already booked.` };
  return { ok: true };
}
