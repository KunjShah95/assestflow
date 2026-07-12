import { Router } from 'express';
import { list, getById, create, update } from '../controllers/asset.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const assetRouter = Router();
assetRouter.get('/', asyncHandler(list));
assetRouter.get('/:id', asyncHandler(getById));
assetRouter.post('/', requireRole('asset_manager', 'admin'), asyncHandler(create));
assetRouter.patch('/:id', requireRole('asset_manager', 'admin'), asyncHandler(update));
