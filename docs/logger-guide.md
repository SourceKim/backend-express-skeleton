# 日志系统使用指南

本项目使用 Winston 日志库实现了一个全面的日志系统，支持多级别日志、请求跟踪和日志轮转。

## 日志级别

日志系统支持以下级别（按优先级排序）：

1. `error`: 错误信息，表示出现了影响应用程序运行的问题
2. `warn`: 警告信息，表示可能出现的问题
3. `info`: 普通信息，用于记录应用程序的正常运行情况
4. `http`: HTTP 请求信息，用于记录 API 请求和响应
5. `debug`: 调试信息，仅在开发环境下记录

在生产环境中，日志系统默认只记录 `info` 级别及以上的日志，而在开发环境中会记录所有级别的日志。

## 日志存储

日志文件存储在 `logs/app` 目录下：

- `combined.log`: 包含所有级别的日志
- `error.log`: 只包含 `error` 级别的日志

日志文件配置了自动轮转：

- 错误日志文件：最大 5MB，保留最近 5 个文件
- 所有日志文件：最大 5MB，保留最近 10 个文件

## 如何使用

### 在代码中记录日志

首先引入日志工具：

```typescript
import { logError, logWarn, logInfo, logHttp, logDebug } from '../utils/logger';
```

然后使用相应的函数记录日志：

```typescript
// 记录错误
logError('发生错误', req.requestId, { error: err });

// 记录警告
logWarn('配置不完整', req.requestId, { config });

// 记录普通信息
logInfo('用户登录成功', req.requestId, { userId: user.id });

// 记录 HTTP 相关信息
logHttp('API 请求成功', req.requestId, { response });

// 记录调试信息
logDebug('变量值', req.requestId, { key: value });
```

### 日志上下文

日志系统支持上下文，可以为每个请求添加统一的上下文信息：

- `requestId`: 请求唯一标识符
- `ip`: 客户端 IP 地址
- `userAgent`: 用户代理信息
- `userId`: 用户 ID（如果已登录）

这些信息由 `requestTracingMiddleware` 中间件自动添加。

### 在控制器中使用示例

```typescript
import { Request, Response } from 'express';
import { logInfo, logError } from '../utils/logger';

export class ExampleController {
  public someAction = async (req: Request, res: Response): Promise<void> => {
    try {
      // 记录请求信息
      logInfo('处理请求', req.requestId, { params: req.params });
      
      // 业务逻辑...
      
      // 记录成功信息
      logInfo('请求处理成功', req.requestId, { result });
      
      res.status(200).json({ success: true });
    } catch (error) {
      // 记录错误信息
      logError('请求处理失败', req.requestId, { error });
      
      res.status(500).json({ success: false });
    }
  };
}
```

## 日志中间件

系统已经配置了两个日志中间件：

1. `requestTracingMiddleware`: 为每个请求生成唯一标识符并添加上下文
2. `httpLoggerMiddleware`: 记录所有 HTTP 请求的详细信息

这些中间件已在 `app.ts` 中自动注册，无需额外配置。

## 错误处理

系统的错误处理中间件 `errorMiddleware` 已配置为使用日志系统记录所有未捕获的异常。当发生错误时，会自动记录错误详情，包括堆栈跟踪信息。

## 自定义日志配置

如需修改日志配置，请编辑 `src/config/logger.config.ts` 文件。可以自定义的配置包括：

- 日志级别
- 日志格式
- 日志文件路径
- 文件轮转设置 