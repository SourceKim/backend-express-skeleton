import { Router } from 'express';
import { UserSettingsController } from '../controllers/user-settings.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new UserSettingsController();

// 用户设置路由
router.get('/users/:userId/settings', authMiddleware, controller.getUserSettings);
router.post('/users/:userId/settings', authMiddleware, controller.createUserSettings);
router.put('/users/:userId/settings', authMiddleware, controller.updateUserSettings);
router.delete('/users/:userId/settings', authMiddleware, controller.deleteUserSettings);

export default router; 