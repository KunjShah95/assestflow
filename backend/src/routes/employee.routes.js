import { Router } from 'express';
import { list, promote, deactivate } from '../controllers/employee.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const employeeRouter = Router();
employeeRouter.get('/', requireRole('admin', 'asset_manager'), asyncHandler(list));
employeeRouter.patch('/:id/role', requireRole('admin'), asyncHandler(promote));
employeeRouter.patch('/:id/deactivate', requireRole('admin'), asyncHandler(deactivate));
