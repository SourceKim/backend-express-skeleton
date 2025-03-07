# AskBudda API设计规范

本文档规定了AskBudda后端API的设计原则和规范，以确保API的一致性、可维护性和易用性。所有API开发必须严格遵循本规范。

## 1. 基础URL规范

- 基础URL: `http://localhost:3000/api/v1`（开发环境）
- 生产环境URL: `https://api.askbudda.com/api/v1`
- 所有API路径采用REST风格的资源命名方式
- 使用版本号（v1）控制API版本，未来版本升级使用v2、v3等

## 2. HTTP方法使用规范

- **GET**: 获取资源，不应修改数据
- **POST**: 创建资源
- **PUT**: 全量更新资源
- **PATCH**: 部分更新资源
- **DELETE**: 删除资源

## 3. 请求规范

### 3.1 认证与授权

- 除登录、注册等公开接口外，所有请求必须在header中携带JWT令牌：
  ```
  Authorization: Bearer <token>
  ```

### 3.2 请求参数格式

- **查询参数 (GET请求)**:
  - 分页参数: `page`（页码，默认1）和`limit`（每页数量，默认20）
  - 过滤参数: 如`category`、`keyword`等
  - 排序参数: 使用`sort`和`order`，如`sort=created_at&order=desc`

- **请求体 (POST/PUT/PATCH请求)**:
  - 请求体使用JSON格式
  - Content-Type为`application/json`
  
### 3.3 命名规范

- 路径名使用**小写英文单词**，多个单词用短横线（kebab-case）连接
  - 正确: `/api/v1/meditation-records`
  - 错误: `/api/v1/meditationRecords`或`/api/v1/meditation_records`

- URL路径使用**名词复数**表示资源集合
  - 正确: `/api/v1/users`、`/api/v1/sutras`
  - 错误: `/api/v1/user`、`/api/v1/sutra`

- 特殊操作使用名词+动词形式
  - 正确: `/api/v1/users/login`、`/api/v1/meditation/start`
  - 避免: `/api/v1/login-user`、`/api/v1/start-meditation`

## 4. 返回规范

### 4.1 统一响应结构

所有API响应必须使用统一的结构：

```json
{
  "code": 0,        // 业务状态码：0表示成功，非0表示错误
  "message": "",    // 消息说明：成功时为"success"，错误时为具体错误信息
  "data": {}        // 响应数据：根据API不同而不同
}
```

### 4.2 状态码使用

- HTTP状态码用于表示请求处理的基础状态
  - 200 OK: 请求成功
  - 201 Created: 资源创建成功
  - 400 Bad Request: 请求参数错误
  - 401 Unauthorized: 未认证或认证失败
  - 403 Forbidden: 无权限访问
  - 404 Not Found: 资源不存在
  - 500 Internal Server Error: 服务器内部错误

- 业务状态码（code字段）用于表示具体业务处理结果
  - 0: 成功
  - 1xxx: 通用错误
  - 2xxx: 用户相关错误
  - 3xxx: 对话相关错误
  - 4xxx: 佛经相关错误
  - 其他: 见业务错误定义章节

### 4.3 单个资源响应格式

获取或操作单个资源时，使用以下响应格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    // 其他资源属性...
    "created_at": "2023-02-20T12:00:00Z",
    "updated_at": "2023-02-21T12:00:00Z"
  }
}
```

### 4.4 多个资源响应格式

获取多个资源时（列表），统一使用以下分页响应格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,       // 总记录数
    "items": [          // 当前页数据项数组
      {
        "id": "string",
        "name": "string",
        // 其他资源属性...
        "created_at": "2023-02-20T12:00:00Z"
      },
      // 更多资源...
    ],
    "page": 1,          // 当前页码
    "limit": 20,        // 每页条数
    "total_pages": 5    // 总页数
  }
}
```

**注意**: 所有列表API必须使用`items`作为数据项集合的属性名，不得使用其他名称如`list`、`data`等。

## 5. 参数命名规范

### 5.1 JSON字段命名

所有JSON字段名（包括请求和响应）统一使用**下划线命名法（snake_case）**：

- 正确：`user_id`、`first_name`、`created_at`
- 错误：`userId`、`firstName`、`created_at`

### 5.2 时间日期格式

- 所有日期时间字段统一使用ISO 8601格式的字符串：`YYYY-MM-DDTHH:MM:SSZ`
- 字段命名使用统一的规范：
  - `created_at`：创建时间
  - `updated_at`：更新时间
  - `deleted_at`：删除时间（如使用软删除）
  - 特定操作时间使用`<action>_at`格式，如`login_at`、`start_at`等

### 5.3 常见字段命名规范

- 主键ID: `id`
- 外键: `<resource>_id`，如`user_id`、`sutra_id`
- 计数字段: `<resource>_count`，如`read_count`、`comment_count`
- 状态字段: `status`
- 类型字段: `type`
- 名称字段: `name`或`title`（标题）
- 描述字段: `description`
- 内容字段: `content`
- 排序字段: `order`或`sort`
- 用户相关: `username`、`email`、`password`等

## 6. 业务错误定义规范

所有业务错误必须定义明确的错误码和错误信息：

### 6.1 错误码范围分配

- 0: 成功
- 1001-1999: 通用错误
  - 1001: 参数错误
  - 1002: 未授权
  - 1003: 禁止访问
  - 1004: 资源不存在
  - 1005: 请求方法不支持
  - 1006: 服务暂时不可用
  - 1007: 请求超时
  - 1008: 请求频率超限

- 2001-2999: 用户相关错误
  - 2001: 用户名或密码错误
  - 2002: 用户已存在
  - 2003: 用户不存在
  - 2004: 账户已被禁用
  - 2005: 密码强度不足
  - 2006: 验证码错误或已过期
  - 2007: 邮箱格式错误
  - 2008: 手机号格式错误

- 3001-3999: 对话相关错误
  - 3001: 对话失败
  - 3002: 超出对话频率限制
  - 3003: 对话内容敏感
  - 3004: 会话不存在
  - 3005: 无效的对话状态

- 4001-4999: 佛经相关错误
  - 4001: 经文不存在
  - 4002: 经文分类不存在
  - 4003: 经文内容不规范

- 5001-5999: 上香相关错误
  - 5001: 功德记录失败
  - 5002: 上香材料不存在
  - 5003: 上香超出日限额

- 6001-6999: 冥想相关错误
  - 6001: 冥想课程不存在
  - 6002: 冥想记录失败
  - 6003: 冥想状态切换失败

- 7001-7999: 权限相关错误
  - 7001: 权限不存在
  - 7002: 角色不存在
  - 7003: 权限名称已存在
  - 7004: 角色名称已存在

### 6.2 错误响应示例

```json
{
  "code": 1001,
  "message": "参数错误：缺少必填字段username",
  "data": null
}
```

## 7. JWT认证规范

- Access Token: 1小时
- Refresh Token: 7天

## 8. API文档规范

- 所有API必须提供完整的Swagger/OpenAPI文档
- 文档必须包含：
  - 接口路径和方法
  - 请求参数说明（路径参数、查询参数、请求体）
  - 响应格式和示例
  - 可能的错误码和说明
  - 认证要求说明

## 9. 接口变更管理

- 不可破坏性变更（添加新字段、新接口）：可直接在当前版本实施
- 破坏性变更（删除或修改字段、修改接口行为）：必须创建新版本
- 弃用流程：先标记为弃用，至少保留6个月后才能移除

## 10. 安全规范

- 所有生产环境API必须使用HTTPS
- 敏感数据（如密码）不得在响应中返回
- 错误响应不应暴露服务器内部实现细节
- 所有API调用必须有适当的访问控制机制
- 实施速率限制防止滥用 