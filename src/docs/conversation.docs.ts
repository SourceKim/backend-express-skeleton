/**
 * @swagger
 * components:
 *   schemas:
 *     ConversationDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 会话ID
 *         user_id:
 *           type: string
 *           description: 用户ID
 *         title:
 *           type: string
 *           description: 会话标题
 *         last_message:
 *           type: string
 *           description: 最后一条消息内容
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *     
 *     MessageDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 消息ID
 *         conversation_id:
 *           type: string
 *           description: 会话ID
 *         content:
 *           type: string
 *           description: 消息内容
 *         role:
 *           type: string
 *           description: 消息角色
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *     
 *     ChatStatusDto:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: 对话状态
 *           enum: ['pending', 'processing', 'completed', 'failed']
 *     
 *     ChatContentDto:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: 对话内容
 *         content_type:
 *           type: string
 *           description: 内容类型
 *           enum: ['text', 'markdown']
 *     
 *     CreateChatRequestDto:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: 对话内容
 *         conversation_id:
 *           type: string
 *           description: 会话ID（如果是继续对话则需要提供）
 *     
 *     CreateChatResponseDto:
 *       type: object
 *       properties:
 *         chat_id:
 *           type: string
 *           description: 对话ID
 *         conversation_id:
 *           type: string
 *           description: 会话ID
 *
 * /conversations:
 *   get:
 *     tags:
 *       - 对话
 *     summary: 获取会话列表
 *     description: 获取用户的所有会话列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 成功获取会话列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 总记录数
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ConversationDto'
 *                     page:
 *                       type: integer
 *                       description: 当前页码
 *                     limit:
 *                       type: integer
 *                       description: 每页数量
 *                     total_pages:
 *                       type: integer
 *                       description: 总页数
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 1002
 *                 message:
 *                   type: string
 *                   example: 未授权
 *                 data:
 *                   type: null
 *
 * /conversations/chats:
 *   post:
 *     tags:
 *       - 对话
 *     summary: 创建新对话或发送连续对话消息
 *     description: 创建新的对话或在现有会话中发送新消息
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChatRequestDto'
 *     responses:
 *       200:
 *         description: 对话创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/CreateChatResponseDto'
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 1001
 *                 message:
 *                   type: string
 *                   example: 参数错误：content不能为空
 *                 data:
 *                   type: null
 *       401:
 *         description: 未授权
 *       403:
 *         description: 超出对话频率限制
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 3002
 *                 message:
 *                   type: string
 *                   example: 超出对话频率限制
 *                 data:
 *                   type: null
 *
 * /conversations/{conversation-id}/messages:
 *   get:
 *     tags:
 *       - 对话
 *     summary: 获取会话消息记录
 *     description: 获取指定会话的消息记录列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 成功获取消息记录
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 总记录数
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MessageDto'
 *                     page:
 *                       type: integer
 *                       description: 当前页码
 *                     limit:
 *                       type: integer
 *                       description: 每页数量
 *                     total_pages:
 *                       type: integer
 *                       description: 总页数
 *       401:
 *         description: 未授权
 *       404:
 *         description: 会话不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 3004
 *                 message:
 *                   type: string
 *                   example: 会话不存在
 *                 data:
 *                   type: null
 *
 * /conversations/{conversation-id}/chats/{chat-id}/status:
 *   get:
 *     tags:
 *       - 对话
 *     summary: 获取对话状态
 *     description: 获取特定对话的处理状态
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *       - in: path
 *         name: chat-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 对话ID
 *     responses:
 *       200:
 *         description: 成功获取对话状态
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ChatStatusDto'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 对话不存在
 *
 * /conversations/{conversation-id}/chats/{chat-id}:
 *   get:
 *     tags:
 *       - 对话
 *     summary: 获取对话内容
 *     description: 获取特定对话的完整内容
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *       - in: path
 *         name: chat-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 对话ID
 *     responses:
 *       200:
 *         description: 成功获取对话内容
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/ChatContentDto'
 *       401:
 *         description: 未授权
 *       404:
 *         description: 对话不存在
 *
 * /conversations/{conversation-id}/history:
 *   get:
 *     tags:
 *       - 对话
 *     summary: 获取历史消息
 *     description: 获取特定会话的历史消息列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: 排序方式
 *     responses:
 *       200:
 *         description: 成功获取历史消息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MessageDto'
 *       401:
 *         description: 未授权
 *       404:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 3004
 *                 message:
 *                   type: string
 *                   example: 会话不存在
 *                 data:
 *                   type: null
 */ 