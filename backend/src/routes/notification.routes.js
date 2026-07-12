import { Router } from 'express';
import { list, markRead, activityLog } from '../controllers/notification.controller.js';

export const notificationRouter = Router();
notificationRouter.get('/', list);
notificationRouter.patch('/:id/read', markRead);
notificationRouter.get('/activity-log', activityLog);
