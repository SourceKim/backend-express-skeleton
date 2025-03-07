# syntax=docker/dockerfile:1.4

# 依赖阶段
FROM node:18-alpine AS deps
WORKDIR /app

# 安装项目依赖
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile

# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 复制依赖和源码
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用
RUN --mount=type=cache,target=/app/dist \
    yarn build

# 生产阶段
FROM node:18-alpine AS prod
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 复制构建产物和必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# 暴露端口
EXPOSE 4000

# 启动服务
CMD ["node", "dist/server.js"] 