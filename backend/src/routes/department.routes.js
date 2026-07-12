import { Router } from 'express';
import { list, create, update } from '../controllers/department.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const departmentRouter = Router();
departmentRouter.get('/', asyncHandler(list));
departmentRouter.post('/', requireRole('admin'), asyncHandler(create));
departmentRouter.patch('/:id', requireRole('admin'), asyncHandler(update));
