FROM node:18-alpine

WORKDIR /app

# 复制整个项目
COPY package.json yarn.lock ./

# 安装所有工作区的依赖
RUN yarn install --frozen-lockfile --network-timeout 100000

COPY . .

# 暴露开发服务器端口
EXPOSE 4000

# 默认启动命令（可被 docker-compose.yml 中的 command 覆盖）
CMD ["yarn", "dev"]