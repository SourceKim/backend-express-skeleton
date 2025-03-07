import { Request, Response, NextFunction } from 'express';
import { logger, setLogContext, clearLogContext, logHttp } from '@/utils/logger';
import { User } from '@/models/user.model';

/**
 * 生成请求跟踪 ID
 * 使用时间戳和随机数组合生成唯一标识符
 */
export const generateRequestId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
};

/**
 * 请求跟踪中间件
 * 为每个请求生成唯一标识符并添加到请求对象和响应头中
 */
export const requestTracingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = generateRequestId();
  // 使用类型断言
  (req as any).requestId = requestId;

  // 添加请求 ID 到响应头
  res.setHeader('X-Request-ID', requestId);

  // 设置日志上下文
  setLogContext(requestId, {
    requestId,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: (req as any).user?.id,
  });

  // 请求结束时清除上下文
  res.on('finish', () => {
    clearLogContext(requestId);
  });

  next();
};

/**
 * HTTP 请求日志中间件
 * 记录请求的详细信息
 */
export const httpLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = (req as any).requestId;
  const start = Date.now();

  // 请求开始日志
  logHttp(`${req.method} ${req.originalUrl} - 请求开始`, requestId, {
    headers: req.headers,
    query: req.query,
    body: req.body,
  });

  // 监听响应完成事件
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'http';

    // 请求完成日志
    logger.log(level, `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`, {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: (req as any).user?.id,
    });
  });

  next();
}; 