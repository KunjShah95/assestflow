import { Router } from 'express';
import { list, getById, create, update } from '../controllers/asset.controller.js';
import { requireRole } from '../middleware/role.middleware.js';

export const assetRouter = Router();
assetRouter.get('/', list);
assetRouter.get('/:id', getById);
assetRouter.post('/', requireRole('asset_manager', 'admin'), create);
assetRouter.patch('/:id', requireRole('asset_manager', 'admin'), update);
