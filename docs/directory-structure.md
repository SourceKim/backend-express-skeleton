# 项目目录结构说明

## 主要目录结构

```
├── config/                     # 配置文件
│   ├── default.ts             # 默认配置
│   ├── development.ts         # 开发环境配置
│   ├── production.ts          # 生产环境配置
│   └── test.ts               # 测试环境配置
├── src/                       # 源代码目录
│   ├── controllers/          # 控制器层
│   │   ├── auth/            # 认证相关控制器
│   │   ├── chat/            # 对话相关控制器
│   │   ├── sutra/           # 佛经相关控制器
│   │   ├── merit/           # 功德相关控制器
│   │   ├── meditation/      # 冥想相关控制器
│   │   └── worship/         # 上香相关控制器
│   ├── models/              # 数据模型层
│   │   ├── user.ts         # 用户模型
│   │   ├── chat.ts         # 对话模型
│   │   ├── sutra.ts        # 佛经模型
│   │   └── ...
│   ├── services/           # 服务层
│   │   ├── auth.service.ts
│   │   ├── chat.service.ts
│   │   └── ...
│   ├── middlewares/        # 中间件
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logger.middleware.ts
│   ├── utils/              # 工具函数
│   │   ├── logger.ts
│   │   ├── validator.ts
│   │   └── helper.ts
│   ├── routes/             # 路由配置
│   │   ├── auth.routes.ts
│   │   ├── chat.routes.ts
│   │   └── ...
│   ├── types/             # TypeScript 类型定义
│   │   ├── user.types.ts # 用户类型定义
│   │   └── ...
│   └── app.ts             # 应用入口文件
├── docs/                 # 文档目录
│   ├── api.md           # API文档
│   ├── database.md      # 数据库设计文档
│   └── ...
├── scripts/             # 脚本文件
│   ├── deploy.sh        # 部署脚本
│   └── db-migrate.sh    # 数据库迁移脚本
├── .github/             # GitHub 配置
│   └── workflows/       # GitHub Actions 工作流
├── logs/               # 日志文件目录
├── public/             # 静态资源目录
├── .env.example        # 环境变量示例
├── .eslintrc.js        # ESLint 配置
├── .prettierrc         # Prettier 配置
├── tsconfig.json       # TypeScript 配置
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 静态资源目录结构

```
public/                 # 公共静态资源目录
├── images/            # 图片资源
│   └── buddha/       # 佛像图片
├── audio/             # 音频资源
│   └── meditation/   # 冥想音频
└── index.html         # 静态资源说明页面

uploads/               # 用户上传文件目录
```

## 目录说明

### 源代码目录 (`src/`)
- `controllers/`: MVC 中的控制器层，处理请求逻辑
- `models/`: 数据模型层，定义数据结构和数据库交互
- `services/`: 业务逻辑层，处理复杂业务逻辑
- `middlewares/`: Express 中间件，处理通用功能
- `utils/`: 工具函数和辅助方法
- `routes/`: 路由配置，定义 API 路由
- `types/`: TypeScript 类型定义文件

### 配置目录 (`config/`)
包含不同环境的配置文件，使用 `config` 包进行管理：
- `default.ts`: 默认配置
- `development.ts`: 开发环境配置
- `production.ts`: 生产环境配置
- `test.ts`: 测试环境配置

### 文档目录 (`docs/`)
包含项目所有文档：
- API 文档
- 数据库设计文档
- 开发指南
- 部署文档等

### 脚本目录 (`scripts/`)
包含各种自动化脚本：
- 部署脚本
- 数据库迁移脚本
- 其他维护脚本

### 静态资源目录 (`public/`)
用于存放静态文件：
- 图片资源
- 音频文件
- 其他静态资源

### 上传文件目录 (`uploads/`)
用于存放用户上传的文件，需要：
1. 定期清理
2. 设置适当的访问权限
3. 考虑迁移到对象存储服务

## 文件说明

### 配置文件
- `.env.example`: 环境变量模板
- `.eslintrc.js`: ESLint 代码规范配置
- `.prettierrc`: Prettier 代码格式化配置
- `tsconfig.json`: TypeScript 编译配置
- `package.json`: 项目依赖和脚本配置

### 文档文件
- `README.md`: 项目主文档
- `docs/*.md`: 各类详细文档 