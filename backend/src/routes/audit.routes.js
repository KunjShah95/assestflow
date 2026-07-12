import { Router } from 'express';
import { createCycle, markAsset, closeCycle, listCycles, getCycleResults } from '../controllers/audit.controller.js';
import { requireRole } from '../middleware/role.middleware.js';

export const auditRouter = Router();
auditRouter.get('/', requireRole('admin'), listCycles);
auditRouter.post('/', requireRole('admin'), createCycle);
auditRouter.post('/:cycleId/mark', markAsset);
auditRouter.patch('/:id/close', requireRole('admin'), closeCycle);
auditRouter.get('/:id/results', getCycleResults);
