import { Router } from 'express';
import { createCycle, markAsset, closeCycle, listCycles, getCycleResults } from '../controllers/audit.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const auditRouter = Router();
auditRouter.get('/', requireRole('admin'), asyncHandler(listCycles));
auditRouter.post('/', requireRole('admin'), asyncHandler(createCycle));
auditRouter.post('/:cycleId/mark', asyncHandler(markAsset));
auditRouter.patch('/:id/close', requireRole('admin'), asyncHandler(closeCycle));
auditRouter.get('/:id/results', asyncHandler(getCycleResults));
