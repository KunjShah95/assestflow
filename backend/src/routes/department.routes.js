import { Router } from 'express';
import { list, create, update } from '../controllers/department.controller.js';
import { requireRole } from '../middleware/role.middleware.js';

export const departmentRouter = Router();
departmentRouter.get('/', list);
departmentRouter.post('/', requireRole('admin'), create);
departmentRouter.patch('/:id', requireRole('admin'), update);
