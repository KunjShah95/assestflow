import { Router } from 'express';
import { list, doAllocate, doTransfer, approveTransfer, doReturn } from '../controllers/allocation.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const allocationRouter = Router();
allocationRouter.get('/', asyncHandler(list));
allocationRouter.post('/', requireRole('asset_manager', 'admin', 'department_head'), asyncHandler(doAllocate));
allocationRouter.post('/transfer', asyncHandler(doTransfer));
allocationRouter.patch('/transfer/:id/approve', requireRole('asset_manager', 'admin'), asyncHandler(approveTransfer));
allocationRouter.post('/:id/return', requireRole('asset_manager', 'admin'), asyncHandler(doReturn));
