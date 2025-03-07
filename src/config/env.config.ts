import { logDebug } from "@/utils/logger"
import * as path from 'path';

// 加载 .env.${process.env.NODE_ENV} 文件
const envPath = path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`);
require('dotenv').config({ path: envPath });

// 加载 .env.docker 文件
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.docker') });

logDebug('环境变量加载成功', "", {
    NODE_ENV: process.env.NODE_ENV,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
});