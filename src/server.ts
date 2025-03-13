/// <reference path="./types/express/index.d.ts" />
import 'reflect-metadata';
import { ENV } from '@/configs/env.config';
import app from '@/app';
import { logInfo, logError, logDebug } from '@/utils/logger';
import { AppDataSource } from '@/configs/database.config';

// 初始化数据库连接
AppDataSource.initialize()
    .then(() => {
        logInfo('数据库连接成功');
        
        // 启动服务器
        app.listen(ENV.PORT, () => {
            logInfo(`服务器运行在 http://localhost:${ENV.PORT}`);
        });
    })
    .catch((error: Error) => {
        logError('数据库连接失败', "", error);
        logDebug("数据库配置", "", {
            host: ENV.MYSQL_HOST,
            port: ENV.MYSQL_PORT,
            username: ENV.MYSQL_USER,
            password: ENV.MYSQL_PASSWORD,
            database: ENV.MYSQL_DATABASE
        });
    }); 