import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { requestTracingMiddleware, httpLoggerMiddleware } from '@/middlewares/logger.middleware';
import routes from '@/routes/index';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();

// 中间件
app.use(cors({
  origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 配置 Helmet 以平衡安全性和跨域需求
if (process.env.NODE_ENV === 'production') {
  // 生产环境：使用更严格的安全配置，但仍允许跨域资源
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'http://localhost:8000', 'http://127.0.0.1:8000']
      }
    }
  }));
} else {
  // 开发环境：使用较宽松的配置
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false
  }));
}

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求跟踪和日志中间件
app.use(requestTracingMiddleware);
app.use(httpLoggerMiddleware);

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// API 文档
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 路由
app.use(routes);

// 错误处理中间件
app.use(errorMiddleware);

export default app; 