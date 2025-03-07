/// <reference path="./types/express/index.d.ts" />
import 'reflect-metadata';
import '@/config/env.config';
import app from '@/app';
import { logInfo, logError, logDebug } from '@/utils/logger';
import { AppDataSource } from '@/config/database';

const PORT = process.env.PORT || 3000;

// 初始化数据库连接
AppDataSource.initialize()
    .then(() => {
        logInfo('数据库连接成功');
        
        // 启动服务器
        app.listen(PORT, () => {
            logInfo(`服务器运行在 http://localhost:${PORT}`);
        });
    })
    .catch((error: Error) => {
        logError('数据库连接失败', "", error);
        logDebug("数据库配置", "", {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
    }); 