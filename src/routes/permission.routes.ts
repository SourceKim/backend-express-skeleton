import { Router } from 'express';
import { PermissionController } from '@/controllers/permission.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new PermissionController();

// 权限相关路由 - 需要认证和管理员权限
router.use(authMiddleware, adminMiddleware);

// 权限管理路由
router.get('/', controller.findAllPermissions);
router.get('/:id', controller.findPermissionById);
router.post('/', controller.createPermission);
router.put('/:id', controller.updatePermission);
router.delete('/:id', controller.deletePermission);

export default router; 