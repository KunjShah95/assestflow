import { Router } from 'express';
import { kpi, idleAssets, utilization, bookingHeatmap, maintenanceFrequency } from '../controllers/report.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const reportRouter = Router();
reportRouter.get('/kpi', asyncHandler(kpi));
reportRouter.get('/idle-assets', requireRole('admin', 'asset_manager'), asyncHandler(idleAssets));
reportRouter.get('/utilization', requireRole('admin', 'asset_manager'), asyncHandler(utilization));
reportRouter.get('/booking-heatmap', requireRole('admin', 'asset_manager'), asyncHandler(bookingHeatmap));
reportRouter.get('/maintenance-frequency', requireRole('admin', 'asset_manager'), asyncHandler(maintenanceFrequency));
