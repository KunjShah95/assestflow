import { Router } from 'express';
import { kpi, idleAssets, utilization, bookingHeatmap, maintenanceFrequency } from '../controllers/report.controller.js';
import { requireRole } from '../middleware/role.middleware.js';

export const reportRouter = Router();
reportRouter.get('/kpi', kpi);
reportRouter.get('/idle-assets', requireRole('admin', 'asset_manager'), idleAssets);
reportRouter.get('/utilization', requireRole('admin', 'asset_manager'), utilization);
reportRouter.get('/booking-heatmap', requireRole('admin', 'asset_manager'), bookingHeatmap);
reportRouter.get('/maintenance-frequency', requireRole('admin', 'asset_manager'), maintenanceFrequency);
