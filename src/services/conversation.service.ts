import { AppDataSource } from '@/config/database';
import { Conversation } from '@/models/conversation.model';
import { Chat } from '@/models/chat.model';
import { HttpException } from '@/exceptions/http.exception';

export class ConversationService {
    private conversationRepository = AppDataSource.getRepository(Conversation);
    private chatRepository = AppDataSource.getRepository(Chat);

    // 获取用户的所有会话
    async getConversationsByUserId(userId: string): Promise<Conversation[]> {
        return this.conversationRepository.find({
            where: { userId },
            order: { updated_at: 'DESC' }
        });
    }

    // 获取单个会话
    async getConversationById(conversationId: string): Promise<Conversation | null> {
        return this.conversationRepository.findOne({
            where: { id: conversationId }
        });
    }

    // 获取会话的所有消息
    async getMessagesByConversationId(conversationId: string): Promise<Chat[]> {
        return this.chatRepository.find({
            where: { conversationId },
            order: { created_at: 'ASC' }
        });
    }

    // 创建或更新会话
    async createOrUpdateConversation(userId: string, chatId: string, conversationId: string): Promise<Conversation> {
        // 验证必需参数
        if (!userId || !chatId || !conversationId) {
            throw new HttpException(400, '缺少必需参数');
        }

        // 查找现有对话
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId }
        });

        if (!conversation) {
            // 如果找不到对话，创建新对话
            const newConversation = new Conversation({
                id: conversationId,
                userId,
                last_chat_id: chatId
            });
            return this.conversationRepository.save(newConversation);
        }

        // 如果找到对话，更新最后一条消息ID
        conversation.last_chat_id = chatId;
        conversation.updated_at = new Date();
        return this.conversationRepository.save(conversation);
    }
} 