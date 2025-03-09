import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const userController = new UserController();

// 需要认证的API - 用户可以查看和更新自己的信息
router.get('/profile', authMiddleware, userController.getUser); // 获取当前用户信息
router.put('/profile', authMiddleware, userController.updateUser); // 更新当前用户信息

// 管理员API - 需要管理员权限
router.use('/admin', authMiddleware, adminMiddleware);
router.post('/admin', userController.createUser); // 创建用户
router.put('/admin/:id', userController.updateUser); // 更新指定用户
router.delete('/admin/:id', userController.deleteUser); // 删除用户
router.get('/admin/:id', userController.getUser); // 获取指定用户
router.get('/admin', userController.getUsers); // 获取所有用户

export default router; 