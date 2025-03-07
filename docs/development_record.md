# 对话模块

后端作为中转，前端发起对话，后端向 coze 发送对话请求

## 接口设计

- conversation/list 获取会话列表，返回这个用户所有的 conversation_id 
- message/list 根据 conversation_id 获取这个会话的聊天记录
- chat/retrieve 根据 conversation_id & chat_id 获取对话状态，如果为 completed 则代表对话结束，可以调用 chat/list 获取回复的消息
- chat/list 根据 conversation_id & chat_id 获取对话历史，返回这个对话的回复消息
- chat 新建一个对话，返回 chat_id 和 conversation_id，如果是已有会话，则需要带上参数 conversation_id

## 业务流程

1. 用户获取调用 conversation/list 获取会话列表，如果选中了一个会话，调用 message/list 获取会话的消息记录，返回这个会话的回复消息。
2. 用户调用 chat 发起一个对话，如果是在 1 中对话列表的选中过会话，则需要传参 conversation_id，不传则默认会新建一个会话，返回 chat_id 和 conversation_id
3. 用户调用 chat/retrieve 获取对话状态，如果为 completed 则代表对话结束，可以调用 chat/list 获取回复的消息

## 数据库

### 会话表

id, user_id, created_at, updated_at, last_chat_id

### 对话表

id, conversation_id, user_id, question_content, question_content_type, answer_content, answer_content_type, created_at, status

## 具体实现

### 获取会话列表
- 类型：GET
- 路径：/conversation/list
- 参数：
    - user_id: 用户id
- 返回：
    - [conversation_id] 会话列表
- 实现：
    - 从数据库的会话表中获取这个用户的所有会话，返回会话列表

### 获取会话消息记录
- 类型：GET
- 路径：/message/list
- 参数：
    - conversation_id: 会话id
- 返回：
    - [message_id] 消息列表
- 实现：
    - 从数据库的对话表中获取这个会话的消息记录，返回消息列表

### 新建对话
- 类型：POST
- 路径：/chat
- Body：
    - user_id: 用户id
    - conversation_id: 会话id
    - content: 问题内容 (用户输入框的内容)
    - content_type: 问题类型 (text)
- Query:
    - conversation_id: 会话id，可选
- 返回：
    - chat_id: 对话id
    - conversation_id: 会话id
- 实现：
    - 调用 coze 的 api，下文中的 「chat 发起聊天」 接口，参数为这边的 Body（需要组装 additional_messages 参数）以及 Query 的 conversation_id
    - 如果返回结果为成功，则检查数据库的会话表中是否存在这个会话，不存在则新增一个，存在则更新这个会话的 updated_at 字段，以及 last_chat_id 字段
    - 如果返回结果为成功，则在对话表中新增一条记录，记录 chat_id & conversation_id & user_id & created_at & question_content & question_content_type
    - 返回 chat_id 和 conversation_id 给前端

### 获取对话状态
- 类型：GET
- 路径：/chat/retrieve
- 参数：
    - chat_id: 对话id
    - conversation_id: 会话id
- 返回：
    - status: 对话状态
- 实现：
    - 调用 coze 的 「retrieve 获取聊天状态」 接口，参数为这边的 chat_id & conversation_id
    - 将对话状态写入到数据库的对话表的对应的记录中，字段为 status

### 获取对话回复
- 类型：GET
- 路径：/chat/list
- 参数：
    - chat_id: 对话id
    - conversation_id: 会话id
- 返回：
    - content: 回复内容
    - content_type: 回复类型
- 实现：
    - 检查数据库的对话表中是否存在这个对话，不存在则返回错误 CHAT_NOT_FOUND
    - 检查数据库的对话表中是否存在这个对话的 status 是否为 completed，如果不是则返回错误 CHAT_NOT_COMPLETED
    - 调用 coze 的 「message/list 获取聊天内容」 接口，参数为这边的 chat_id & conversation_id
    - 将 response 数组中 data.type 为 answer 的 content 和 content_type 写入到数据库的对话表的对应的记录中，字段分别为 answer_content 和 answer_content_type
    - 将 answer_content 和 answer_content_type 返回给前端

## coze api

扣子请求
Header:所有接口都要在 header 中加入鉴权 & 返回类型
    - Authorization: Bearer pat_CLTDsW1iIcADF6v4SP5OxyXO4IWJAOij1sn7poxhOK1IYpjcdXuoWYmLJlbgVMJf
    - Content-Type: application/json

### chat 发起聊天
    - 接口地址: https://api.coze.cn/v3/chat
    - 请求方式: post
    - Query:
        - conversation_id: 会话id，可选
    - Body:
        - bot_id: 机器人 id (7469036024069799971)
        - user_id: 用户 id (写死 123)
        - stream: 是否流式返回 (false)
        - auto_save_history: 是否自动保存聊天记录 (true)
        - additional_messages: 用户的问题
            - role: 角色 (user)
            - type: 类型 (question)
            - content: 问题内容 (用户输入框的内容)
            - content_type: 问题类型 (text)
    - 返回:
    ```
    {
    "data": {
        "id": "7469094280749924352",
        "conversation_id": "7469094280749907968",
        "bot_id": "7469036024069799971",
        "created_at": 1739034030,
        "last_error": {
            "code": 0,
            "msg": ""
        },
        "status": "in_progress"
    },
    "code": 0,
    "msg": ""
    }
    ```
### retrieve 获取聊天状态
    - 接口地址: https://api.coze.cn/v3/chat/retrieve
    - 请求方式: get
    - 参数:
        - chat_id: 聊天 id,在 「chat」 接口返回 的 data.id
        - conversation_id: 对话 id,在 「chat」 接口返回 的 data.conversation_id
    - 返回:
    ```
    {
    "code": 0,
    "data": {
        "bot_id": "7469036024069799971",
        "completed_at": 1739034034,
        "conversation_id": "7469094280749907968",
        "created_at": 1739034030,
        "id": "7469094280749924352",
        "status": "completed",
        "usage": {
            "input_count": 212,
            "output_count": 56,
            "token_count": 268
        }
    },
    "msg": ""
    }
    ```
### message/list 获取聊天内容
    - 接口地址: https://api.coze.cn/v3/chat/message/list
    - 请求方式: get
    - 参数:
        - chat_id: 聊天 id,在 「chat」 接口返回 的 data.id
        - conversation_id: 对话 id,在 「chat」 接口返回 的 data.conversation_id
    - 返回:
    ```
    {
    "code": 0,
    "data": [
        {
            "bot_id": "7469036024069799971",
            "chat_id": "7469094280749924352",
            "content": "众生皆苦,烦恼常伴。然烦恼之源,多由心生。若能以平常心待之,不执念于物,不纠结于事,烦恼自会消散。施主不妨尝试放下心中之重负,观照内心,寻得宁静之所在。",
            "content_type": "text",
            "conversation_id": "7469094280749907968",
            "created_at": 1739034030,
            "id": "7469094280750006272",
            "role": "assistant",
            "type": "answer",
            "updated_at": 1739034032
        },
        {
            "bot_id": "7469036024069799971",
            "chat_id": "7469094280749924352",
            "content": "{\"msg_type\":\"generate_answer_finish\",\"data\":\"{\\\"finish_reason\\\":0,\\\"FinData\\\":\\\"\\\"}\",\"from_module\":null,\"from_unit\":null}",
            "content_type": "text",
            "conversation_id": "7469094280749907968",
            "created_at": 1739034034,
            "id": "7469094295233052724",
            "role": "assistant",
            "type": "verbose",
            "updated_at": 1739034034
        },
        {
            "bot_id": "7469036024069799971",
            "chat_id": "7469094280749924352",
            "content": "如何通过运动排解烦恼？",
            "content_type": "text",
            "conversation_id": "7469094280749907968",
            "created_at": 1739034034,
            "id": "7469094295233069108",
            "role": "assistant",
            "type": "follow_up",
            "updated_at": 1739034034
        },
        {
            "bot_id": "7469036024069799971",
            "chat_id": "7469094280749924352",
            "content": "有哪些方法可以帮助我保持平常心？",
            "content_type": "text",
            "conversation_id": "7469094280749907968",
            "created_at": 1739034034,
            "id": "7469094295233085492",
            "role": "assistant",
            "type": "follow_up",
            "updated_at": 1739034034
        },
        {
            "bot_id": "7469036024069799971",
            "chat_id": "7469094280749924352",
            "content": "推荐一些可以缓解压力和焦虑的音乐",
            "content_type": "text",
            "conversation_id": "7469094280749907968",
            "created_at": 1739034034,
            "id": "7469094295233101876",
            "role": "assistant",
            "type": "follow_up",
            "updated_at": 1739034034
        }
    ],
    "msg": ""
    }
    ```

# 冥想模块

## 接口设计

### 获取冥想素材列表
- 用户登录后，调用冥想模块，返回冥想素材列表：
    - 素材类型 (type)：
        - 音频
        - 视频
        - 图片
        - 文字
    - 素材内容 (content)：
        - 音频：音频 url
        - 视频：视频 url
        - 图片：图片 url
        - 文字：文字内容

### 开始 & 结束冥想
- 访问 meditation 接口，代表开始 & 结束冥想
    - status: 状态 (start, finish, cancel )
    - materials: 素材列表,用户开始冥想的时候选中的素材列表
    - duration: 冥想时长

- 服务器将冥想时长、素材列表、冥想状态写入到数据库的 meditation 表中

### 获取冥想记录
- 用户可以查看是否有未完成的冥想，status == start
- 用户可以查看冥想记录，查看冥想时长、素材列表、状态

# 上香模块

## 接口设计

### 获取上香素材列表
- 用户登录后，调用上香模块，返回上香素材列表：
    - 素材类型 (type)：
        - 音频（BGM）
        - 图片（香炉、佛像、香）
        - 文字（上香后的提示语）
    - 子类型 (sub_type)：
        - 图片：香炉、佛像、香
    - 素材内容 (content)：
        - 音频：音频 url
        - 图片：图片 url
        - 文字：文字内容
    - 素材描述 (description)：
        - 描述     

### 上香
- 访问 incense 接口，代表完成一次上香
- 服务端记录：
    - 用户 id
    - 上香时间
    - 上香素材列表，素材 id 数组
    - 上香对于的佛像的 id，sub_type 为佛像

### 获取上香记录
- 用户可以查看上香记录

### 获取上香排行榜
- 根据佛像的 id 对应的上香次数排序返回