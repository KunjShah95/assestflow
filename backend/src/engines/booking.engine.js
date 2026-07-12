import { db } from '../config/db.js';
import { bookings } from '../models/schema.js';
import { eq, and, gt, lt, ne } from 'drizzle-orm';
import { AppError } from '../utils/AppError.js';

export async function book(assetId, employeeId, startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  if (start >= end) throw new AppError('End time must be after start time', 400);
  const [conflict] = await db.select().from(bookings).where(and(eq(bookings.assetId, assetId), lt(bookings.startTime, end), gt(bookings.endTime, start), ne(bookings.status, 'cancelled'))).limit(1);
  if (conflict) throw new AppError('Time slot overlaps with existing booking', 409, { conflictingBooking: conflict });
  const [booking] = await db.insert(bookings).values({ assetId, bookerEmployeeId: employeeId, startTime: start, endTime: end, status: 'upcoming' }).returning();
  return booking;
}

export async function cancel(bookingId, employeeId) {
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) throw new AppError('Booking not found', 404);
  await db.update(bookings).set({ status: 'cancelled' }).where(eq(bookings.id, bookingId));
  return { message: 'Booking cancelled' };
}

export async function getCalendar(assetId, startDate, endDate) {
  const items = await db.select().from(bookings).where(and(eq(bookings.assetId, assetId), gt(bookings.endTime, new Date(startDate)), lt(bookings.startTime, new Date(endDate)))).orderBy(bookings.startTime);
  return items;
}
