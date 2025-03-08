import { Router } from 'express';
import { PermissionController } from '@/controllers/permission.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new PermissionController();

// 权限相关路由
router.get('/', authMiddleware, controller.findAllPermissions);
router.get('/:id', authMiddleware, controller.findPermissionById);
router.post('/', authMiddleware, controller.createPermission);
router.put('/:id', authMiddleware, controller.updatePermission);
router.delete('/:id', authMiddleware, controller.deletePermission);

export default router; 