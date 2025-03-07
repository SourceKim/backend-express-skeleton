import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '@/config/database';
import { User } from '@/models/user.model';
import { logDebug, logError } from '@/utils/logger';

interface JwtPayload {
    id: string;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: '未提供认证令牌' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not configured');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOne({
            where: { id: decoded.id },
            relations: ['roles', 'roles.permissions']
        });

        if (!user) {
            logError('Auth 中间件 - 用户不存在');
            res.status(401).json({ message: '用户不存在' });
            return;
        }

        // 将用户信息添加到请求对象
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: '认证失败' });
        return;
    }
} 