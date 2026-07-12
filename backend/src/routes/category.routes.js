import { Router } from 'express';
import { list, create, update } from '../controllers/category.controller.js';
import { requireRole } from '../middleware/role.middleware.js';

export const categoryRouter = Router();
categoryRouter.get('/', list);
categoryRouter.post('/', requireRole('admin'), create);
categoryRouter.patch('/:id', requireRole('admin'), update);
