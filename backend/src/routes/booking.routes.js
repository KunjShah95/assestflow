import { Router } from 'express';
import { doBook, doCancel, getCalendar, listUserBookings } from '../controllers/booking.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const bookingRouter = Router();
bookingRouter.get('/', asyncHandler(listUserBookings));
bookingRouter.post('/', asyncHandler(doBook));
bookingRouter.patch('/:id/cancel', asyncHandler(doCancel));
bookingRouter.get('/calendar/:assetId', asyncHandler(getCalendar));
