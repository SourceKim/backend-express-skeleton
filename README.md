# 介绍

## 简介
佛学 + AI 聊天的应用,支持 web 网页端 （兼容移动端), 支持发布到微信小程序。

这是一个后端的程序，主要功能是提供 API 接口，用于前端调用。

## 相关文档：
- [数据库设计](docs/database.md)
- [前端设计](docs/frontend_design.md)
- [接口文档](docs/api.md)
- [实现文档](docs/implementation.md)
- [开发记录](docs/development_record.md)
- [开发清单](docs/development_checklist.md)
- [目录结构说明](docs/directory-structure.md)
- [包管理说明](docs/package-guide.md)

# 技术栈

后端: express + Typescript

数据库：mysql

版本管理: github，链接 https://github.com/SourceKim/AskBuddaBackend

部署: 自有服务器 + Github Actions 实现自动化部署

进程管理: PM2 实现多进程管理、负载均衡、自动重启

# 功能

## 核心功能
- AskBudda 前端的 api 接口
- 静态资源服务

## 模块
- 用户模块
    - 用户登录
    - 用户注册
    - 用户信息管理
- 对话模块
    - 对话管理
    - 对话记录
- 佛经模块
    - 佛经列表
    - 用户佛经学习记录
- 功德模块
    - 功德对应列表
    - 用户功德记录
- 冥想模块
    - 冥想列表
    - 用户冥想记录
- 上香模块
    - 供奉佛像管理
    - 用户供奉记录

# 编码规范
- 组件命名:使用小写字母,单词之间用连字符连接
- 组件化:尽量使用组件化,减少重复代码,提高代码复用率
- 日志:使用统一的日志工具,方便调试和问题追踪
- 注释:代码关键逻辑必须添加注释,使用 JSDoc 规范
- 错误处理:统一的错误处理机制,包括用户提示
- 简单原则：尽量使用简单的方式实现功能，避免过度设计，如无必要不要引入第三方库
- 开发记录：
    - 开发记录：开发过程中，请将开发记录更新到 [开发记录](docs/development_record.md) 中
    - 数据库记录：开发过程中，请将数据库相关的改动记录更新到 [数据库设计](docs/database.md) 中
    - 接口文档：开发过程中，请将接口文档更新到 [接口文档](docs/api.md) 中
    - 实现文档：开发过程中，请将实现文档更新到 [实现文档](docs/implementation.md) 中
- 注重单元测试：
    - 每个模块都要有单元测试
    - 单元测试记录：开发过程中，请将单元测试记录更新到 [单元测试记录](docs/unit_test_record.md) 中

# 开发环境配置

## 环境变量配置
1. 复制 `.env.example` 到 `.env`
```
cp .env.example .env
```
2. 配置以下环境变量：
```bash
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ask_budda

# API 配置
API_BASE_URL=/api/v1
```

## MySQL 配置
1. 创建数据库
```sql
CREATE DATABASE ask_budda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
2. 导入初始数据（如果有）
```bash
mysql -u your_username -p ask_budda < init.sql
```

# 本地调试
## 开发测试
1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
# 使用 nodemon 启动（单进程）
npm run dev

# 使用 PM2 启动（多进程）
npm run pm2:dev
```

## 调试 build 产物

1. 打包
```bash
npm run build
```

2. 运行 build 产物
```bash
# 单进程运行
npm run start

# 使用 PM2 运行（推荐）
npm run pm2:prod
```

## PM2 常用命令
```bash
# 查看应用状态
npm run pm2:status

# 查看日志
npm run pm2:logs

# 监控
npm run pm2:monit

# 停止应用
npm run pm2:stop

# 删除应用
npm run pm2:delete
```

# CI/CD

项目使用 GitHub Actions 进行自动化部署：

1. 代码提交到 master 分支后自动触发构建
2. 构建完成后自动部署到服务器
3. 部署流程：
   - 安装依赖
   - 运行测试
   - 构建项目
   - 通过 SSH 部署到服务器
   - 发送部署通知

详细配置请查看 `.github/workflows/deploy.yml`

# API 示例

基础 URL: `http://localhost:3000/api/v1`

示例接口：
```bash
# 用户登录
POST /auth/login
Content-Type: application/json

{
    "username": "test",
    "password": "password"
}

# 获取佛经列表
GET /sutras?page=1&limit=10
```

# 安全说明

## API 认证
- 使用 JWT (JSON Web Token) 进行 API 认证
- Token 在请求头中使用 Bearer 方式传递
- Token 有效期为 24 小时

## 安全配置
- 密码使用 bcrypt 加密存储

# 构建 x86_64
```
docker buildx build --platform linux/amd64 \
  --load \
  -t abb:0.5 \
  -f Dockerfile.dev .
```