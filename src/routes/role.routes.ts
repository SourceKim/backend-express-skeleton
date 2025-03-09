import { Router } from 'express';
import { RoleController } from '@/controllers/role.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { adminMiddleware } from '@/middlewares/admin.middleware';

const router = Router();
const controller = new RoleController();

// 所有角色相关路由都需要认证和管理员权限
router.use(authMiddleware, adminMiddleware);

// 角色管理路由
router.get('/', controller.findAllRoles);
router.get('/:id', controller.findRoleById);
router.post('/', controller.createRole);
router.put('/:id', controller.updateRole);
router.delete('/:id', controller.deleteRole);

// 权限分配路由
router.post('/:roleId/permissions', controller.assignPermissionsToRole);
router.post('/users/:userId/roles', controller.assignRolesToUser);

export default router; 