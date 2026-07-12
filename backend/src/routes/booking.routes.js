import { Router } from 'express';
import { doBook, doCancel, getCalendar, listUserBookings } from '../controllers/booking.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const bookingRouter = Router();
bookingRouter.get('/', authenticate, asyncHandler(listUserBookings));
bookingRouter.post('/', authenticate, asyncHandler(doBook));
bookingRouter.patch('/:id/cancel', authenticate, asyncHandler(doCancel));
bookingRouter.get('/calendar/:assetId', authenticate, asyncHandler(getCalendar));
