import { Router } from 'express';
import { create, approve, reject, resolve, list } from '../controllers/maintenance.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const maintenanceRouter = Router();
maintenanceRouter.get('/', asyncHandler(list));
maintenanceRouter.post('/', asyncHandler(create));
maintenanceRouter.patch('/:id/approve', requireRole('asset_manager', 'admin'), asyncHandler(approve));
maintenanceRouter.patch('/:id/reject', requireRole('asset_manager', 'admin'), asyncHandler(reject));
maintenanceRouter.patch('/:id/resolve', requireRole('asset_manager', 'admin'), asyncHandler(resolve));
