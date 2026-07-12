import { Router } from 'express';
import { create, approve, reject, resolve, updateStatus, list } from '../controllers/maintenance.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const maintenanceRouter = Router();
maintenanceRouter.get('/', list);
maintenanceRouter.post('/', create);
maintenanceRouter.patch('/:id/approve', requireRole('asset_manager', 'admin'), approve);
maintenanceRouter.patch('/:id/reject', requireRole('asset_manager', 'admin'), reject);
maintenanceRouter.patch('/:id/resolve', requireRole('asset_manager', 'admin'), resolve);
maintenanceRouter.patch('/:id/status', requireRole('asset_manager', 'admin'), updateStatus);
