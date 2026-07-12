import { db } from '../config/db.js';
import { bookings } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import * as bookingEngine from '../engines/booking.engine.js';

export async function doBook(req, res, next) {
  try {
    const { assetId, startTime, endTime } = req.body;
    const booking = await bookingEngine.book(assetId, req.user.id, startTime, endTime);
    res.status(201).json(booking);
  } catch (err) { next(err); }
}

export async function doCancel(req, res, next) {
  try {
    const result = await bookingEngine.cancel(parseInt(req.params.id), req.user.id);
    res.json(result);
  } catch (err) { next(err); }
}

export async function getCalendar(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const items = await bookingEngine.getCalendar(parseInt(req.params.assetId), startDate, endDate);
    res.json(items);
  } catch (err) { next(err); }
}

export async function listUserBookings(req, res, next) {
  try {
    const items = await db.select().from(bookings).where(eq(bookings.bookerEmployeeId, req.user.id)).orderBy(bookings.startTime);
    res.json(items);
  } catch (err) { next(err); }
}
