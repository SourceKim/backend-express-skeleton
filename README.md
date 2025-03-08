# 介绍

## 简介
这是一个 Express 后端的骨架项目，仅包含了一些基础的功能，是一个后端项目的最小实现，可以方便地进行二次开发

## 相关文档：

# 技术栈
* 语言: TypeScript
* 运行时: Node.js 18
* Web框架: Express
* 数据库: MySQL
* ORM: TypeORM
* 认证: JWT (JSON Web Token)
* API文档: Swagger
* 日志: Winston
* 容器化: Docker, Docker Compose
* 依赖管理: Yarn
* 环境管理: 使用 dotenv 区分不同的环境

# 功能
- 用户功能
    - 注册 & 登录
    - 用户管理
- 权限管理
    - 权限管理
- 静态资源管理

# 模块
- 认证模块 auth
- 用户模块 user & user-settings
- 权限模块(RCBA) permission & role
- 静态资源 asset


# 开发步骤

前提依赖 mysql, 可以使用 Docker 提前启动容器。

## 1. 环境变量配置

复制 `.env.example` 到 `.env.development.local`

```
cp .env.example .env.development.local
```

编辑 & 配置环境变量

## 2. 创建数据库 & 管理员账号

```
yarn seed:admin
```

# 本地调试
## 开发测试
1. 安装依赖
```bash
yarn install
```

2. 启动开发服务器
```bash
yarn dev
```

## 调试 build 产物

1. 打包
```bash
yarn build
```

2. 运行 build 产物
```bash
yarn start
```

# 安全说明

## API 认证
- 使用 JWT (JSON Web Token) 进行 API 认证
- Token 在请求头中使用 Bearer 方式传递
- Token 有效期为 24 小时

## 安全配置
- 密码使用 bcrypt 加密存储

# 部署
## 构建 x86_64
```
docker buildx build --platform linux/amd64 \
  --load \
  -t abb:0.5 \
  -f Dockerfile.dev .
```