import { Router } from 'express';
import { UserSettingsController } from '@/controllers/user-settings.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new UserSettingsController();

// 需要认证的API - 用户可以管理自己的设置
router.get('/profile/settings', authMiddleware, controller.getUserSettings); // 获取当前用户设置
router.post('/profile/settings', authMiddleware, controller.createUserSettings); // 创建当前用户设置
router.put('/profile/settings', authMiddleware, controller.updateUserSettings); // 更新当前用户设置
router.delete('/profile/settings', authMiddleware, controller.deleteUserSettings); // 删除当前用户设置

// 管理员API - 需要管理员权限管理任意用户的设置
router.use('/admin', authMiddleware, adminMiddleware);
router.get('/admin/:userId/settings', controller.getUserSettings); // 获取指定用户设置
router.post('/admin/:userId/settings', controller.createUserSettings); // 创建指定用户设置
router.put('/admin/:userId/settings', controller.updateUserSettings); // 更新指定用户设置
router.delete('/admin/:userId/settings', controller.deleteUserSettings); // 删除指定用户设置

export default router; 