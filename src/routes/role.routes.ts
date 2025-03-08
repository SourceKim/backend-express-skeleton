import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new RoleController();

// 角色相关路由
router.get('/', authMiddleware, controller.findAllRoles);
router.get('/:id', authMiddleware, controller.findRoleById);
router.post('/', authMiddleware, controller.createRole);
router.put('/:id', authMiddleware, controller.updateRole);
router.delete('/:id', authMiddleware, controller.deleteRole);

// 权限分配路由
router.post('/:roleId/permissions', authMiddleware, controller.assignPermissionsToRole);
router.post('/users/:userId/roles', authMiddleware, controller.assignRolesToUser);

export default router; 