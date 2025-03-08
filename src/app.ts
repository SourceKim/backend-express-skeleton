import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/config/swagger';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { requestTracingMiddleware, httpLoggerMiddleware } from '@/middlewares/logger.middleware';
import routes from '@/routes/index';
import { ENV } from '@/config/env.config';

const app = express();

// 中间件
app.use(cors({
  origin: ENV.CORS_ORIGINS,
  methods: ENV.CORS_METHODS,
  allowedHeaders: ENV.CORS_HEADERS,
  credentials: true
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求跟踪和日志中间件
app.use(requestTracingMiddleware);
app.use(httpLoggerMiddleware);

// 静态文件服务
app.use(ENV.UPLOADS_PATH, express.static(path.join(__dirname, '../uploads')));
app.use(ENV.PUBLIC_PATH, express.static(path.join(__dirname, '../public')));

// API 文档
app.get(ENV.API_DOCS_JSON_PATH, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use(ENV.API_DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 路由
app.use(routes);

// 错误处理中间件
app.use(errorMiddleware);

export default app; 