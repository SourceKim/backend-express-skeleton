import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/exceptions/http.exception';
import { logError } from '@/utils/logger';

interface ErrorResponse {
    code: number;
    message: string;
    error?: any;
}

export const errorMiddleware = (
    err: Error | HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // 使用类型断言
    const requestId = (req as any).requestId;
    logError('请求处理错误', requestId, {
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    if (err instanceof HttpException) {
        const response: ErrorResponse = {
            code: err.status,
            message: err.message
        };

        // 在开发环境下或明确指定要显示错误详情时，添加错误详情
        if (process.env.NODE_ENV === 'development' || err.error) {
            response.error = err.error;
        }

        res.status(err.status).json(response);
        return;
    }

    // 对于非 HttpException 的错误
    const response: ErrorResponse = {
        code: 500,
        message: '服务器内部错误'
    };

    // 在开发环境下显示详细错误信息
    if (process.env.NODE_ENV === 'development') {
        response.error = {
            name: err.name,
            message: err.message,
            stack: err.stack
        };
    }

    res.status(500).json(response);
}; 