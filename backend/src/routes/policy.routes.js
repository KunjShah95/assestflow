import { Router } from 'express';
import { create, list } from '../controllers/policy.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const policyRouter = Router();
policyRouter.get('/', asyncHandler(list));
policyRouter.post('/', requireRole('admin'), asyncHandler(create));
