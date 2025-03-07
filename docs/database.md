# 数据库管理

- 安装 mysql `brew install mysql`
- 安装 mysqlworkbench `brew install mysqlworkbench`

- 相关指令

| 操作 | 命令 |
| --- | --- |
| 启动 MySQL | brew services start mysql |
| 停止 MySQL | brew services stop mysql |
| 重启 MySQL | brew services restart mysql |
| 查看状态 | brew services info mysql |
| 开机自启 | brew services enable mysql（启用） |
| 开机自启 | brew services disable mysql（禁用） |

## 创建数据库
打开 mysqlworkbench，创建 scheme，输入 数据库名称输入：ask_budda
字符集选择：utf8mb4_unicode_ci

数据库账号密码：root@localhost 没有密码

# 数据库设计

## 用户表 (users)

用于存储用户基本信息。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | varchar(16) | 主键 | 是 | - |
| username | varchar(100) | 用户名 | 是 | - |
| password | varchar(255) | 密码 | 是 | - |
| email | varchar(100) | 邮箱 | 否 | null |
| phone | varchar(20) | 手机号 | 否 | null |
| avatar | varchar(255) | 头像URL | 否 | null |
| status | enum | 用户状态 | 是 | 'active' |
| bio | varchar(500) | 用户简介 | 否 | null |
| merit_points | int | 功德点数 | 是 | 0 |
| meditation_minutes | int | 冥想时长（分钟） | 是 | 0 |
| is_active | boolean | 是否激活 | 是 | true |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | 是 | CURRENT_TIMESTAMP |

### 用户状态说明
- active: 正常
- inactive: 未激活
- banned: 已封禁

### 字段约束
- username: 长度3-100，唯一
- password: 最小长度6
- email: 唯一，符合邮箱格式
- phone: 唯一，符合手机号格式
- bio: 最大长度500

## 用户设置表 (user_settings)

用于存储用户个性化设置。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | int | 主键 | 是 | auto_increment |
| user_id | varchar(16) | 用户ID（外键） | 是 | - |
| theme | varchar(50) | 主题设置 | 是 | 'light' |
| language | varchar(10) | 语言设置 | 是 | 'zh-CN' |
| notifications | boolean | 是否开启通知 | 是 | true |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | 是 | CURRENT_TIMESTAMP |

### 外键关系
- user_settings.user_id -> users.id (CASCADE)

## 会话表 (conversations)

用于存储用户的会话信息。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | uuid | 主键 | 是 | uuid_generate_v4() |
| user_id | varchar(16) | 用户ID | 是 | - |
| last_chat_id | varchar(36) | 最后一条对话ID | 否 | null |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | 是 | CURRENT_TIMESTAMP |

### 外键关系
- conversations.user_id -> users.id (CASCADE)

## 对话表 (chats)

用于存储用户的对话记录。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | uuid | 主键 | 是 | uuid_generate_v4() |
| conversation_id | uuid | 会话ID（外键） | 是 | - |
| user_id | varchar(16) | 用户ID | 是 | - |
| question_content | text | 问题内容 | 是 | - |
| question_content_type | varchar(50) | 问题内容类型 | 是 | 'text' |
| answer_content | text | 回答内容 | 否 | null |
| answer_content_type | varchar(50) | 回答内容类型 | 否 | 'text' |
| status | enum | 对话状态 | 是 | 'in_progress' |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |

### 对话状态说明
- in_progress: 进行中
- completed: 已完成
- failed: 失败

### 外键关系
- chats.conversation_id -> conversations.id (CASCADE)
- chats.user_id -> users.id (CASCADE)

## 经文表 (sutras)

用于存储佛经文本和相关信息。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | uuid | 主键 | 是 | uuid_generate_v4() |
| title | varchar(100) | 经文标题 | 是 | - |
| category | varchar(50) | 经文分类 | 是 | - |
| description | text | 经文简介 | 是 | - |
| content | longtext | 经文内容 | 是 | - |
| read_count | int | 阅读次数 | 是 | 0 |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | 是 | CURRENT_TIMESTAMP |

## 冥想素材表 (meditation_materials)

用于存储冥想可用的素材。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | uuid | 主键 | 是 | uuid_generate_v4() |
| title | varchar(100) | 素材标题 | 是 | - |
| description | text | 素材描述 | 否 | null |
| type | enum | 素材类型 | 是 | - |
| url | varchar(255) | 素材URL | 否 | null |
| content | text | 文字内容 | 否 | null |
| duration | int | 建议时长（分钟） | 否 | null |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | 是 | CURRENT_TIMESTAMP |

### 素材类型说明
- audio: 音频
- video: 视频
- image: 图片
- text: 文字

### 字段约束
- type 必须是以上四种类型之一
- 当 type 为 audio/video/image 时，url 必填
- 当 type 为 text 时，content 必填

## 冥想记录表 (meditation_records)

用于记录用户的冥想记录。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | uuid | 主键 | 是 | uuid_generate_v4() |
| user_id | varchar(16) | 用户ID（外键） | 是 | - |
| status | enum | 冥想状态 | 是 | 'start' |
| materials | jsonb | 使用的素材ID数组 | 是 | '[]' |
| start_time | timestamp | 开始时间 | 是 | CURRENT_TIMESTAMP |
| end_time | timestamp | 结束时间 | 否 | null |
| duration | int | 冥想时长（分钟） | 否 | null |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | 是 | CURRENT_TIMESTAMP |

### 冥想状态说明
- start: 开始冥想
- finish: 完成冥想
- cancel: 取消冥想

### 外键关系
- meditation_records.user_id -> users.id (CASCADE)

### 字段约束
- materials 必须是有效的 JSON 数组，包含素材ID
- end_time 和 duration 在状态为 finish 或 cancel 时必填

## 上香素材表 (worship_materials)

用于存储上香相关的素材。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | uuid | 主键 | 是 | uuid_generate_v4() |
| title | varchar(100) | 素材标题 | 是 | - |
| description | text | 素材描述 | 否 | null |
| type | enum | 素材类型 | 是 | - |
| sub_type | enum | 素材子类型 | 是 | - |
| url | varchar(255) | 素材URL | 是 | - |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |
| updated_at | timestamp | 更新时间 | 是 | CURRENT_TIMESTAMP |

### 素材类型说明
- audio: 音频（BGM）
- image: 图片（香炉、佛像、香）
- text: 文字（上香后的提示语）

### 素材子类型说明（针对图片类型）
- incense_burner: 香炉
- buddha: 佛像
- incense: 香

### 字段约束
- type 必须是以上三种类型之一
- sub_type 仅在 type 为 image 时必填
- url 对于所有类型都必填，text 类型存储文字内容的 URL

## 上香记录表 (worship_records)

用于记录用户的上香记录。

| 字段名 | 类型 | 说明 | 是否必填 | 默认值 |
|--------|------|------|----------|---------|
| id | uuid | 主键 | 是 | uuid_generate_v4() |
| user_id | varchar(16) | 用户ID（外键） | 是 | - |
| buddha_id | uuid | 佛像ID（外键） | 是 | - |
| materials | jsonb | 使用的素材ID数组 | 是 | '[]' |
| wish | text | 许愿内容 | 否 | null |
| created_at | timestamp | 创建时间 | 是 | CURRENT_TIMESTAMP |

### 外键关系
- worship_records.user_id -> users.id (CASCADE)
- worship_records.buddha_id -> worship_materials.id (RESTRICT)

### 字段约束
- materials 必须是有效的 JSON 数组，包含素材ID
- buddha_id 必须指向 type 为 image 且 sub_type 为 buddha 的素材

