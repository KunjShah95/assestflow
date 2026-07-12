import { Router } from 'express';
import { list, promote, deactivate } from '../controllers/employee.controller.js';
import { requireRole } from '../middleware/role.middleware.js';

export const employeeRouter = Router();
employeeRouter.get('/', requireRole('admin', 'asset_manager'), list);
employeeRouter.patch('/:id/role', requireRole('admin'), promote);
employeeRouter.patch('/:id/deactivate', requireRole('admin'), deactivate);
