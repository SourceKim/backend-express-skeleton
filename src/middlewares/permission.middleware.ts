import { Request, Response, NextFunction } from 'express';
import { logDebug } from '@/utils/logger';

export const checkPermissions = (requiredPermissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 如果不需要权限验证，直接通过
            if (!requiredPermissions || requiredPermissions.length === 0) {
                return next();
            }

            // 检查用户是否存在
            if (!req.user) {
                return res.status(401).json({
                    code: 1001,
                    message: '未授权访问',
                    data: null
                });
            }

            logDebug('权限中间件 - 用户ID: ' + req.user.id);
            logDebug('权限中间件 - 需要的权限: ' + JSON.stringify(requiredPermissions));
            logDebug('权限中间件 - 用户完整信息: ' + JSON.stringify(req.user, null, 2));

            // 获取用户所有权限
            const userPermissions = new Set<string>();
            req.user.roles?.forEach(role => {
                logDebug('权限中间件 - 角色: ' + role.name);
                role.permissions?.forEach(permission => {
                    logDebug('权限中间件 - 权限: ' + permission.name);
                    userPermissions.add(permission.name);
                });
            });

            logDebug('权限中间件 - 用户拥有的所有权限: ' + JSON.stringify(Array.from(userPermissions)));

            // 检查是否具有所有必需的权限
            const hasAllPermissions = requiredPermissions.every(permission =>
                userPermissions.has(permission)
            );

            logDebug('权限中间件 - 权限检查结果: ' + hasAllPermissions);

            if (!hasAllPermissions) {
                return res.status(403).json({
                    code: 1003,
                    message: '没有足够的权限执行此操作',
                    data: null
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}; 