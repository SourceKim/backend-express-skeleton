import winston from 'winston';
import path from 'path';
import fs from 'fs';

// 使用 process.cwd() 获取项目根目录
const logDir = path.join(process.cwd(), 'logs/app');

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 定义日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 根据环境选择日志级别
const getLogLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  const configuredLevel = process.env.LOG_LEVEL;
  
  if (configuredLevel && Object.keys(levels).includes(configuredLevel)) {
    return configuredLevel;
  }
  
  return env === 'development' ? 'debug' : 'info';
};

// 自定义序列化函数，确保显示 undefined 值
const customStringify = (obj: any): string => {
  return JSON.stringify(obj, (key, value) => {
    if (value === undefined) {
      return 'undefined';
    }
    return value;
  }, 2);
};

// 自定义日志格式
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 修改控制台输出格式
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    // 提取基本字段
    const { timestamp, level, message, stack, ...meta } = info;
    
    // 构建基本日志信息
    let log = `${timestamp} ${level}: ${message}`;
    
    // 如果有堆栈信息，添加堆栈
    if (stack) {
      log += '\n' + stack;
    }
    
    // 使用自定义序列化，确保显示所有字段
    if (Object.keys(meta).length > 0) {
      log += '\n' + customStringify(meta);
    }
    
    return log;
  })
);

// 定义日志传输目标
const transports = [
  // 控制台
  new winston.transports.Console({
    format: consoleFormat,
  }),
  // 错误日志文件
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  // 所有日志文件
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 10,
  }),
];

// 导出日志配置
export const loggerConfig = {
  level: getLogLevel(),
  levels,
  format,
  transports,
}; 