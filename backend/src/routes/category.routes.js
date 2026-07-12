import { Router } from 'express';
import { list, create, update } from '../controllers/category.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const categoryRouter = Router();
categoryRouter.get('/', asyncHandler(list));
categoryRouter.post('/', requireRole('admin'), asyncHandler(create));
categoryRouter.patch('/:id', requireRole('admin'), asyncHandler(update));
