import { Router } from 'express';
import { list, doAllocate, doTransfer, approveTransfer, doReturn } from '../controllers/allocation.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const allocationRouter = Router();
allocationRouter.get('/', list);
allocationRouter.post('/', requireRole('asset_manager', 'admin', 'department_head'), doAllocate);
allocationRouter.post('/transfer', requireRole('asset_manager', 'admin'), doTransfer);
allocationRouter.patch('/transfer/:id/approve', requireRole('asset_manager', 'admin'), approveTransfer);
allocationRouter.post('/:id/return', requireRole('asset_manager', 'admin'), doReturn);
