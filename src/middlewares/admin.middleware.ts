import { Request, Response, NextFunction } from 'express';
import { logDebug, logError } from '@/utils/logger';

/**
 * 管理员权限中间件
 * 验证用户是否具有管理员角色
 */
export async function adminMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // 检查用户是否已通过认证
        if (!req.user) {
            res.status(401).json({ message: '未授权访问' });
            return;
        }

        // 检查用户是否具有管理员角色
        const isAdmin = req.user.roles?.some(role => 
            role.name === 'admin' || role.name === 'super_admin'
        );

        if (!isAdmin) {
            logError(`用户 ${req.user.id} 尝试访问管理员接口但没有权限`);
            res.status(403).json({ message: '没有管理员权限' });
            return;
        }

        logDebug(`管理员 ${req.user.id} 访问管理员接口`);
        next();
    } catch (error) {
        logError('管理员中间件错误', error instanceof Error ? error.message : String(error));
        res.status(500).json({ message: '服务器内部错误' });
    }
} 