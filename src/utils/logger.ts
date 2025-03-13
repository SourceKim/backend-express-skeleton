import winston from 'winston';
import { loggerConfig } from '@/configs/logger.config';

// 创建 Winston logger 实例
export const logger = winston.createLogger(loggerConfig);

// 请求跟踪 ID 中间件使用的上下文存储
const contextStorage = new Map<string, any>();

/**
 * 设置日志上下文，可用于添加请求ID、用户ID等
 * @param requestId 请求标识符
 * @param context 上下文对象
 */
export const setLogContext = (requestId: string, context: any): void => {
  contextStorage.set(requestId, context);
};

/**
 * 获取日志上下文
 * @param requestId 请求标识符
 */
export const getLogContext = (requestId: string): any => {
  return contextStorage.get(requestId) || {};
};

/**
 * 清除日志上下文
 * @param requestId 请求标识符
 */
export const clearLogContext = (requestId: string): void => {
  contextStorage.delete(requestId);
};

/**
 * 带上下文的日志记录函数
 * @param level 日志级别
 * @param message 日志消息
 * @param requestId 请求标识符（可选）
 * @param meta 其他元数据（可选）
 */
export const logWithContext = (
  level: string,
  message: string,
  requestId?: string,
  meta?: any
): void => {
  const context = requestId ? getLogContext(requestId) : {};
  logger.log(level, message, { ...context, ...meta });
};

// 导出便捷的日志记录函数
export const logError = (message: string, requestId?: string, meta?: any): void => {
  logWithContext('error', message, requestId, meta);
};

export const logWarn = (message: string, requestId?: string, meta?: any): void => {
  logWithContext('warn', message, requestId, meta);
};

export const logInfo = (message: string, requestId?: string, meta?: any): void => {
  logWithContext('info', message, requestId, meta);
};

export const logHttp = (message: string, requestId?: string, meta?: any): void => {
  logWithContext('http', message, requestId, meta);
};

export const logDebug = (message: string, requestId?: string, meta?: any): void => {
  logWithContext('debug', message, requestId, meta);
};

// 默认导出
export default {
  logger,
  logError,
  logWarn,
  logInfo,
  logHttp,
  logDebug,
  setLogContext,
  getLogContext,
  clearLogContext,
}; 