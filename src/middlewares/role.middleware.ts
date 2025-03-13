import { Request, Response, NextFunction } from 'express';
import { logDebug, logError } from '@/utils/logger';

/**
 * 角色验证中间件
 * 验证用户是否具有指定的角色
 * @param requiredRoles 需要的角色列表，用户至少需要拥有其中一个角色
 * @returns 中间件函数
 */
export const roleMiddleware = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 检查是否需要角色验证
      if (!requiredRoles || requiredRoles.length === 0) {
        return next();
      }

      // 检查用户是否已通过认证
      if (!req.user) {
        res.status(401).json({
          code: 401,
          message: '未授权访问',
          data: null
        });
        return;
      }

      logDebug('角色中间件 - 用户ID: ' + req.user.id);
      logDebug('角色中间件 - 需要的角色: ' + JSON.stringify(requiredRoles));

      // 获取用户所有角色
      const userRoles = new Set<string>();
      req.user.roles?.forEach(role => {
        userRoles.add(role.name);
      });

      logDebug('角色中间件 - 用户拥有的所有角色: ' + JSON.stringify(Array.from(userRoles)));

      // 检查是否具有至少一个所需角色
      const hasRequiredRole = requiredRoles.some(role => userRoles.has(role));

      logDebug('角色中间件 - 角色检查结果: ' + hasRequiredRole);

      if (!hasRequiredRole) {
        logError(`用户 ${req.user.id} 尝试访问需要角色 ${requiredRoles.join(', ')} 的接口但没有权限`);
        res.status(403).json({
          code: 403,
          message: '没有足够的角色权限执行此操作',
          data: null
        });
        return;
      }

      next();
    } catch (error) {
      logError('角色中间件错误', error instanceof Error ? error.message : String(error));
      res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };
}; 