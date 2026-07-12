import { Router } from 'express';
import { list, markRead, activityLog } from '../controllers/notification.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const notificationRouter = Router();
notificationRouter.get('/', asyncHandler(list));
notificationRouter.patch('/:id/read', asyncHandler(markRead));
notificationRouter.get('/activity-log', asyncHandler(activityLog));
