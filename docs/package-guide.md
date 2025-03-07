# Package.json 指南

本文档详细说明了项目 `package.json` 中各个部分的作用和功能。

## 脚本命令 (Scripts)

### 基础运行命令
- `start`: 启动生产环境服务
- `dev`: 启动开发环境服务，支持热重载
- `build`: 将 TypeScript 代码编译为 JavaScript

### 代码质量相关命令
- `lint`: 运行 ESLint 检查代码质量
- `lint:fix`: 运行 ESLint 并自动修复问题
- `format`: 使用 Prettier 格式化代码
- `prepare`: Git hooks 安装

### PM2 进程管理命令
- `pm2:dev`: 使用 PM2 在开发环境启动应用
- `pm2:prod`: 使用 PM2 在生产环境启动应用
- `pm2:stop`: 停止 PM2 进程
- `pm2:delete`: 删除 PM2 进程
- `pm2:logs`: 查看 PM2 日志
- `pm2:status`: 查看 PM2 状态
- `pm2:monit`: 监控 PM2 应用

### 调试相关命令
- `debug`: 调试模式启动
- `debug:break`: 调试模式启动并在首行断点

### 数据相关命令
- `seed:sutras`: 运行经文数据库种子脚本

## 依赖说明 (Dependencies)

### 核心依赖
- `express`: Web 应用框架
- `typescript`: TypeScript 编译器
- `typeorm`: ORM 框架
- `mysql2`: MySQL 数据库驱动

### 安全相关
- `helmet`: 安全中间件集合
- `bcryptjs`: 密码加密库
- `jsonwebtoken`: JWT 认证库
- `express-rate-limit`: API 请求速率限制中间件

### 中间件和工具
- `cors`: 跨域资源共享中间件
- `compression`: HTTP 响应压缩中间件
- `winston`: 完整的日志解决方案，用于请求日志、错误日志和应用程序日志
- `dotenv`: 环境变量管理
- `axios`: HTTP 客户端
- `pm2`: 进程管理工具

### 验证相关
- `class-validator`: 数据验证库
- `express-validator`: 请求数据验证中间件

## 开发依赖 (DevDependencies)

### 开发工具
- `nodemon`: 开发环境热重载工具
- `ts-node`: TypeScript 执行环境
- `prettier`: 代码格式化工具
- `eslint`: 代码质量检查工具

### Git 相关
- `lint-staged`: Git hooks 运行的脚本

### TypeScript 类型定义
项目使用了多个 `@types/*` 包来提供 TypeScript 类型支持，包括：
- `@types/bcryptjs`
- `@types/compression`
- `@types/config`
- `@types/cors`
- `@types/express`
- `@types/jsonwebtoken`
- `@types/node` 