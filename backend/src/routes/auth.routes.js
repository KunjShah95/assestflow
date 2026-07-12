import { Router } from 'express';
import { signup, login, me, updateProfile, changePassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const authRouter = Router();
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/me', authenticate, me);
authRouter.patch('/profile', authenticate, updateProfile);
authRouter.post('/change-password', authenticate, changePassword);
