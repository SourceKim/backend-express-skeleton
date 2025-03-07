# 如何测试

测试之前，请确保完成数据库迁移

`npm run migrate:run`

## 单元测试

npm test

## 接口测试

使用 postman 测试，将所有文件拖入 postman 中

### 环境变量 

@postman-tests/AskBudda.postman_environment.json
- 请求相关
    - baseUrl: http://localhost:3000/api/v1
- 用户注册相关
    - testUsername: testuser
    - testPassword: Test@123
    - testEmail: test@example.com
- 登录后获取的登录信息
    - token: "" (密钥类型)
    - userId: ""
- 对话模块相关
    - conversationId: ""
    - chatId: ""
- 佛经模块相关，获取佛经列表的第一个佛经id
    - sutraId: ""
- 上香模块相关，用来上香使用
    - worshipBuddaId: "" // 上香的佛像 id
    - worshipBurnerId: "" // 上香用的香炉 id
    - worshipIncenseId: "" // 上香用的香 id
- 冥想模块相关，用来冥想使用
    - meditationImageId: "" // 冥想用的图片 id
    - meditationAudioId: "" // 冥想用的音频 id
    - meditationDuration: 10 // 冥想时长
    - meditationId: "" // 冥想 id，冥想开始会记录，冥想结束的时候使用
- 权限模块相关，用来测试权限
    - permissionId: "" // 权限 id
    - permissionResource: "user" // 权限资源
    - permissionAction: "create" // 权限动作
    - roleName: "super_admin" // 测试的角色名
    - roleId: "" // 角色 id

### 测试模块

- @auth.postman_collection.json 认证模块
- @meditation.postman_collection.json 冥想模块
- @worship.postman_collection.json 礼拜模块
- @sutra.postman_collection.json 经文模块
- @chat.postman_collection.json 聊天模块

### 测试方案：

#### 认证模块 (@auth)

- 注册
    - 注册成功：
        - 检查 users 表中是否存在该用户
        - 检查返回的用户信息是否完整（id, username, email, nickname, created_at）
    - 注册失败：
        - 用户名已存在
        - 邮箱已存在
        - 密码格式不正确
        - 必填字段缺失
- 登录
    - 登录成功 (将 token & user.id 写入环境变量)
        - 检查 token 是否存在
        - 检查返回的用户信息是否完整
    - 登录失败：
        - 用户名不存在
        - 密码错误
- 获取用户信息
    - 成功获取：
        - 检查用户基本信息是否完整
    - 获取失败：
        - token 无效或过期
        - token 缺失

#### 佛经模块 (@sutra)

测试前运行 `npm run seed:sutras` 将佛经 mock 数据写入到 database

- 获取佛经列表
    - 成功获取：
        - 检查数据获取是否正常，包括 id, title, category, description, content, read_count
        - 将列表的第一个 sutraId 写入环境变量
- 获取佛经详情
    - 成功获取：
        - 检查数据获取是否正常，包括 id, title, category, description, content, read_count
            
#### 上香模块 (@worship)

测试前运行 `npm run seed:worship` 将佛像数据 mock 数据写入到 database

- 获取上香素材
    - 成功获取：
        - 检查数据获取是否正常，包括 id, title, description, type, url,subType
        - 将 subType 为 budda 的第一个素材的 id 写入环境变量 worshipBuddaId
        - 将 subType 为 incense_burner 的第一个素材的 id 写入环境变量 worshipBurnerId
        - 将 subType 为 incense 的第一个素材的 id 写入环境变量 worshipIncenseId
- 上香记录
    - 参数：
        - buddhaId: worshipBuddaId, 
        - materials: [worshipBurnerId, worshipIncenseId]
        - wish: "test wish"
    - 成功上香：
        - 检查返回值
- 获取上香记录
    - 成功获取：
        - 检查数据获取的 data.items.buddha.id 是否等于 worshipBuddaId
- 上香排行榜
    - 成功获取：
        - 检查数据获取的 data.items.buddha.id 是否等于 worshipBuddaId

#### 冥想模块 (@meditation)

测试前运行 `npm run seed:meditation` 将冥想素材 mock 数据写入到 database

- 获取冥想素材
    - 成功获取：
        - 检查数据获取是否正常，包括 id, title, description, type, url
        - 将 type 为 image 的第一个素材的 id 写入环境变量 meditationImageId
        - 将 type 为 audio 的第一个素材的 id 写入环境变量 meditationAudioId
- 开始冥想
    - 参数：
        - materials: [meditationImageId, meditationAudioId]
        - duration: meditationDuration
    - 成功开始：
        - 检查返回值
- 结束冥想
    - 成功结束：
        - 检查返回值
- 获取冥想记录
    - 成功获取：
        - 检查数据获取的 data.items.id 是否等于 meditationId
- 获取进行中的冥想
    - 成功获取：
        - 检查数据获取的 data.id 是否等于 meditationId

#### 聊天模块 (@chat)

- 首次发起会话
    - 参数：
        - content: "我最近很烦恼，请开导我"
    - 成功发起：
        - 记录 conversationId & chatId 到环境变量
- 连续对话
    - 参数：
        - conversationId: 环境变量 conversationId
        - content: "我的上个问题是什么?"
    - 成功发起：
        - 更新 chatId 到环境变量
- 获取会话列表
    - 成功获取：
        - 检查数据获取的 data.items.id 是否等于 conversationId
- 获取对话状态
    - 参数：
        - conversationId: 环境变量 conversationId
        - chatId: 环境变量 chatId
    - 成功获取：
        - 检查数据获取的 data.status 是否等于 "completed"
- 获取历史消息
    - 参数：
        - conversationId: 环境变量 conversationId
        - order: "ASC"

#### 权限模块 (@permission)

- 创建权限
    - 参数：
        - resource: "user"
        - action: "create"
    - 成功创建：
        - 将权限 id 写入环境变量 permissionId

- 获取权限列表

- 获取单个权限
    - 参数：
        - id: 环境变量 permissionId

- 更新权限
    - 参数：
        - id: 环境变量 permissionId
        - name: "test permission"
        - description: "test description"

- 删除权限
    - 参数：
        - id: 环境变量 permissionId

- 创建角色
    - 参数：
        - name: "test role"
        - description: "test description"
    - 成功创建：
        - 将角色 id 写入环境变量 roleId

- 获取角色列表

- 获取单个角色
    - 参数：
        - id: 环境变量 roleId

- 更新角色名
    - 参数：
        - id: 环境变量 roleId
        - name: "test role"

- 删除角色
    - 参数：
        - id: 环境变量 roleId

- 为角色分配权限
    - 参数：
        - roleId: 环境变量 roleId
        - permissions: [环境变量 permissionId]

- 为用户分配角色
    - 参数：
        - userId: 环境变量 userId
        - roles: [环境变量 roleId]

### 通用测试要点：

1. 所有接口的错误码验证
2. 权限验证（token 相关）
3. 参数验证（必填、格式、范围等）
4. 并发请求处理
5. 数据一致性检查
6. 响应时间监控

## 手动测试

