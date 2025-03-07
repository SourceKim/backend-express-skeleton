import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { PermissionController } from '@/controllers/permission.controller';
import { checkPermissions } from '@/middlewares/permission.middleware';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new PermissionController();

// 添加类型声明以避免 TypeScript 错误
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
type ControllerMethod = (req: Request, res: Response) => Promise<void>;

// 将控制器方法转换为 Express 中间件
const wrapHandler = (handler: ControllerMethod): AsyncRequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await handler.call(controller, req, res);
        } catch (error) {
            next(error);
        }
    };
};

// 权限相关路由
router.get('/', authMiddleware, controller.findAllPermissions);

// 角色相关路由 - 注意：将具体路径放在参数路由之前
router.get('/roles', authMiddleware, controller.findAllRoles);
router.get('/roles/:id', authMiddleware, controller.findRoleById);
router.post('/roles', authMiddleware, controller.createRole);
router.put('/roles/:id', authMiddleware, controller.updateRole);
router.delete('/roles/:id', authMiddleware, controller.deleteRole);

// 权限分配路由
router.post('/roles/:roleId/permissions', authMiddleware, controller.assignPermissionsToRole);
router.post('/users/:userId/roles', authMiddleware, controller.assignRolesToUser);

// 单个权限路由 - 移到具体路径之后
router.get('/:id', authMiddleware, controller.findPermissionById);
router.post('/', authMiddleware, controller.createPermission);
router.put('/:id', authMiddleware, controller.updatePermission);
router.delete('/:id', authMiddleware, controller.deletePermission);

export default router; 