#!/bin/bash
set -e

echo "等待MySQL服务完全启动..."
sleep 10

echo "开始执行TypeORM迁移..."

# 切换到应用目录
cd /app

# 执行TypeORM迁移
yarn run migration:run

echo "TypeORM迁移执行完成!" 