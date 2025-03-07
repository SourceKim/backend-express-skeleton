import { AppDataSource } from '@/config/database';
import { Chat, ChatStatus } from '@/models/chat.model';
import { ConversationService } from '@/services/conversation.service';
import { cozeApi } from '@/utils/coze.util';
import { HttpException } from '@/exceptions/http.exception';
import { SortOrder } from '@/dtos/chat.dto';

interface CozeMessage {
    type: string;
    content: string;
    content_type: string;
}

export class ChatService {
    private chatRepository = AppDataSource.getRepository(Chat);
    private conversationService = new ConversationService();

    // 创建新对话
    async createChat(userId: string, content: string, conversationId?: string): Promise<{ chatId: string; conversationId: string }> {
        try {
            // 调用 Coze API 创建对话
            const cozeResponse = await cozeApi.createChat(content, conversationId);

            if (!cozeResponse.data || !cozeResponse.data.id) {
                throw new HttpException(500, 'Coze API 返回数据格式错误', cozeResponse);
            }

            const chatId = cozeResponse.data.id;
            const newConversationId = cozeResponse.data.conversation_id;

            if (!chatId || !newConversationId) {
                throw new HttpException(500, '无法获取对话ID或会话ID', {
                    chatId,
                    conversationId: newConversationId,
                    response: cozeResponse
                });
            }

            // 创建或更新会话
            const conversation = await this.conversationService.createOrUpdateConversation(
                userId,
                chatId,
                newConversationId
            );

            // 创建对话记录
            const chat = new Chat({
                id: chatId,
                conversationId: newConversationId,
                userId,
                questionContent: content,
                questionContentType: 'text',
                status: ChatStatus.IN_PROGRESS
            });

            const savedChat = await this.chatRepository.save(chat);

            return {
                chatId: savedChat.id,
                conversationId: savedChat.conversationId
            };
        } catch (error: any) {
            console.error('创建对话失败:', error);
            throw new HttpException(500, '创建对话失败', error);
        }
    }

    // 获取对话状态
    async getChatStatus(chatId: string, conversationId: string): Promise<Chat> {
        const chat = await this.chatRepository.findOneOrFail({
            where: { id: chatId, conversationId }
        });

        // 如果对话未完成，调用 Coze API 获取状态
        if (chat.status === ChatStatus.IN_PROGRESS) {
            const cozeResponse = await cozeApi.retrieveChat(chatId, conversationId);
            chat.status = cozeResponse.data.status as ChatStatus;
            
            if (chat.status === ChatStatus.COMPLETED) {
                // 如果对话完成，获取回复内容
                const messagesResponse = await cozeApi.getChatMessages(chatId, conversationId);
                const answer = messagesResponse.data.find((msg: CozeMessage) => msg.type === 'answer');
                
                if (answer) {
                    chat.answerContent = answer.content;
                    chat.answerContentType = answer.content_type;
                }
            }

            await this.chatRepository.save(chat);
        }

        return chat;
    }

    // 获取对话内容
    async getChatContent(chatId: string, conversationId: string): Promise<Chat> {
        const chat = await this.chatRepository.findOneOrFail({
            where: { id: chatId, conversationId }
        });

        if (chat.status !== ChatStatus.COMPLETED) {
            throw new Error('对话尚未完成');
        }

        return chat;
    }

    // 获取历史消息
    async getHistoryMessages(userId: string, conversationId: string, order: SortOrder = SortOrder.ASC): Promise<Chat[]> {
        try {
            // 首先验证会话是否属于该用户
            const conversation = await this.conversationService.getConversationById(conversationId);
            if (!conversation) {
                throw new HttpException(404, '会话不存在');
            }
            if (conversation.userId !== userId) {
                throw new HttpException(403, '无权访问该会话');
            }

            // 使用 QueryBuilder 构建查询
            const messages = await this.chatRepository
                .createQueryBuilder('chat')
                .where('chat.conversationId = :conversationId', { conversationId })
                .andWhere('chat.userId = :userId', { userId })
                .orderBy('chat.created_at', order)
                .getMany();
                
            return messages;
        } catch (error: any) {
            console.error('获取历史消息失败:', error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(500, '获取历史消息失败', error);
        }
    }
} 