import { Router } from 'express';
import { create, list } from '../controllers/policy.controller.js';
import { requireRole } from '../middleware/role.middleware.js';

export const policyRouter = Router();
policyRouter.get('/', list);
policyRouter.post('/', requireRole('admin'), create);
