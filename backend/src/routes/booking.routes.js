import { Router } from 'express';
import { doBook, doCancel, getCalendar, listUserBookings } from '../controllers/booking.controller.js';

export const bookingRouter = Router();
bookingRouter.get('/', listUserBookings);
bookingRouter.post('/', doBook);
bookingRouter.patch('/:id/cancel', doCancel);
bookingRouter.get('/calendar/:assetId', getCalendar);
