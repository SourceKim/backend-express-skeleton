import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

// 环境变量加载优先级：
// 1. .env.${NODE_ENV}.local (本地开发环境特定配置，不提交到版本控制)
// 2. .env.${NODE_ENV} (环境特定配置)
// 3. .env.local (本地所有环境通用配置，不提交到版本控制)
// 4. .env (默认配置)

const NODE_ENV = process.env.NODE_ENV || 'development';

// 定义可能的环境变量文件路径
const envPaths = [
  path.resolve(process.cwd(), `.env.${NODE_ENV}.local`),
  path.resolve(process.cwd(), `.env.${NODE_ENV}`),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
];

// 按优先级加载存在的环境变量文件
envPaths.forEach(envPath => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ENV] 环境变量文件加载成功: ${envPath}`);
    }
  }
});

// 导出一些常用的环境变量配置
export const ENV = {
  NODE_ENV,
  PORT: process.env.PORT || '3000',
  API_BASE_URL: process.env.API_BASE_URL || '/api/v1',
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  CORS_METHODS: process.env.CORS_METHODS ? process.env.CORS_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  CORS_HEADERS: process.env.CORS_HEADERS ? process.env.CORS_HEADERS.split(',') : ['Content-Type', 'Authorization'],
  UPLOADS_PATH: process.env.UPLOADS_PATH || '/uploads',
  PUBLIC_PATH: process.env.PUBLIC_PATH || '/public',
  API_DOCS_JSON_PATH: process.env.API_DOCS_JSON_PATH || '/api-docs.json',
  API_DOCS_PATH: process.env.API_DOCS_PATH || '/api-docs',
  LOG_LEVEL: process.env.LOG_LEVEL || (NODE_ENV === 'development' ? 'debug' : 'info'),
  
  // 数据库配置
  MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
  MYSQL_PORT: process.env.MYSQL_PORT || '3306',
  MYSQL_USER: process.env.MYSQL_USER || 'root',
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'database_name',
  
  // 素材管理配置
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  API_URL: process.env.API_URL || 'http://localhost:3000',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 默认10MB
  ALLOWED_MIME_TYPES: process.env.ALLOWED_MIME_TYPES ? process.env.ALLOWED_MIME_TYPES.split(',') : ['image/*', 'audio/*', 'video/*', 'application/pdf', 'text/plain'],
};

if (process.env.NODE_ENV === 'development') {
  console.log(`[ENV] 环境变量加载完成，当前环境: ${NODE_ENV}`);
} 