# Docker 环境配置说明

## MySQL 服务配置

本项目使用 Docker Compose 来管理 MySQL 服务。配置文件位于项目根目录的 `docker-compose.yml`。

### 环境变量配置

MySQL 服务使用以下环境变量：

- `DB_PORT`: MySQL 端口号（默认：3306）
- `DB_USER`: MySQL 用户名
- `DB_PASSWORD`: MySQL 密码
- `DB_NAME`: 数据库名称（默认：ask_budda）

这些环境变量可以在 `.env` 或 `.env.docker` 文件中配置。

### 启动 MySQL 服务

1. 确保已安装 Docker 和 Docker Compose

2. 使用环境变量文件启动服务：

```bash
# 使用默认环境变量
docker-compose up -d

# 或指定环境变量文件
docker-compose --env-file .env.docker up -d
```

3. 停止服务：

```bash
docker-compose down
```

### 数据持久化

MySQL 数据存储在名为 `mysql_data` 的 Docker 卷中，确保数据在容器重启后不会丢失。

初始化脚本（如果有）应放在项目的 `migrations` 目录中，这些脚本将在容器首次启动时执行。

### 连接到 MySQL

- 在容器内部或其他 Docker 服务中：使用 `mysql` 作为主机名
- 在宿主机上：使用 `localhost` 和映射的端口（默认 3306）

```bash
# 从宿主机连接
mysql -h localhost -P 3306 -u [DB_USER] -p
``` 