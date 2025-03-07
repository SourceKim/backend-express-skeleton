import { Router } from 'express';
import { ConversationController } from '@/controllers/conversation.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();
const controller = new ConversationController();

// 获取会话列表
router.get('/', authMiddleware, controller.getConversationList);

// 获取会话消息记录
router.get('/:conversation-id/messages',
    authMiddleware,
    controller.getMessageList
);

// 创建新对话或发送连续对话消息
router.post('/chats',
    authMiddleware,
    controller.createChat
);

// 获取对话状态
router.get('/:conversation-id/chats/:chat-id/status',
    authMiddleware,
    controller.getChatStatus
);

// 获取对话内容
router.get('/:conversation-id/chats/:chat-id',
    authMiddleware,
    controller.getChatContent
);

// 获取历史消息
router.get('/:conversation-id/history',
    authMiddleware,
    controller.getHistoryMessages
);

export default router; 