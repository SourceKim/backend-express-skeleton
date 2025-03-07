import { Request, Response } from 'express';
import { ConversationService } from '@/services/conversation.service';
import { ChatService } from '@/services/chat.service';
import { 
    GetHistoryMessagesDto, 
    SortOrder,
    ConversationResponseDto,
    MessageResponseDto,
    CreateChatResponseDto,
    ChatStatusResponseDto,
    ChatContentResponseDto,
    CreateChatDto,
    GetChatDto,
    GetConversationDto
} from '@/dtos/chat.dto';
import { HttpException } from '@/exceptions/http.exception';
import { ApiResponse } from '@/dtos/common.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class ConversationController {
    private conversationService = new ConversationService();
    private chatService = new ChatService();

    // 转换会话数据为 DTO
    private toConversationDto(conversation: any): ConversationResponseDto {
        return {
            id: conversation.id,
            userId: conversation.userId,
            title: conversation.title || '新对话',
            last_message: conversation.last_message || '',
            created_at: conversation.created_at,
            updated_at: conversation.updated_at
        };
    }

    // 转换消息数据为 DTO
    private toMessageDto(message: any): MessageResponseDto {
        return {
            id: message.id,
            conversationId: message.conversationId,
            content: message.content || message.question || message.answer || '',
            role: message.role || (message.isUser ? 'user' : 'assistant'),
            created_at: message.created_at
        };
    }

    // 获取会话列表
    getConversationList = async (
        req: Request, 
        res: Response<ApiResponse<ConversationResponseDto[]>>
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id.toString();
            const conversations = await this.conversationService.getConversationsByUserId(userId);
            res.json({
                code: 0,
                message: 'success',
                data: conversations.map(conv => this.toConversationDto(conv))
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '获取会话列表失败',
                    error
                });
            }
        }
    };

    // 获取会话消息记录
    getMessageList = async (
        req: Request<{ 'conversation-id': string }>, 
        res: Response<ApiResponse<MessageResponseDto[]>>
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id.toString();
            // 验证参数
            const params = plainToInstance(GetConversationDto, req.params);
            const errors = await validate(params);
            if (errors.length > 0) {
                res.status(400).json({
                    code: 400,
                    message: '请求参数错误',
                    error: errors
                });
                return;
            }

            const conversationId = req.params['conversation-id'];

            // 验证会话归属权
            const conversation = await this.conversationService.getConversationById(conversationId);
            if (!conversation) {
                throw new HttpException(404, '会话不存在');
            }
            if (conversation.userId !== userId) {
                throw new HttpException(403, '无权访问该会话');
            }

            const messages = await this.conversationService.getMessagesByConversationId(conversationId);
            res.json({
                code: 0,
                message: 'success',
                data: messages.map(msg => this.toMessageDto(msg))
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '获取消息记录失败',
                    error
                });
            }
        }
    };

    // 创建新对话或发送连续对话消息
    createChat = async (
        req: Request<{}, ApiResponse<CreateChatResponseDto>, { content: string; conversationId?: string }>, 
        res: Response<ApiResponse<CreateChatResponseDto>>
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id.toString();
            // 验证参数
            const chatDto = plainToInstance(CreateChatDto, req.body);
            const errors = await validate(chatDto);
            if (errors.length > 0) {
                res.status(400).json({
                    code: 400,
                    message: '请求参数错误',
                    error: errors
                });
                return;
            }

            const { content, conversationId } = req.body;
            
            const chat = await this.chatService.createChat(userId, content, conversationId);
            res.json({
                code: 0,
                message: 'success',
                data: {
                    chatId: chat.chatId,
                    conversationId: chat.conversationId
                }
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '创建对话失败',
                    error
                });
            }
        }
    };

    // 获取对话状态
    getChatStatus = async (
        req: Request<{ 'conversation-id': string; 'chat-id': string }>, 
        res: Response<ApiResponse<ChatStatusResponseDto>>
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id.toString();
            // 验证参数
            const params = plainToInstance(GetChatDto, req.params);
            const errors = await validate(params);
            if (errors.length > 0) {
                res.status(400).json({
                    code: 400,
                    message: '请求参数错误',
                    error: errors
                });
                return;
            }

            const chatId = req.params['chat-id'];
            const conversationId = req.params['conversation-id'];

            // 验证会话归属权
            const conversation = await this.conversationService.getConversationById(conversationId);
            if (!conversation) {
                throw new HttpException(404, '会话不存在');
            }
            if (conversation.userId !== userId) {
                throw new HttpException(403, '无权访问该会话');
            }

            const chat = await this.chatService.getChatStatus(chatId, conversationId);
            res.json({
                code: 0,
                message: 'success',
                data: { 
                    status: chat.status 
                }
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '获取对话状态失败',
                    error
                });
            }
        }
    };

    // 获取对话内容
    getChatContent = async (
        req: Request<{ 'conversation-id': string; 'chat-id': string }>, 
        res: Response<ApiResponse<ChatContentResponseDto>>
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id.toString();
            // 验证参数
            const params = plainToInstance(GetChatDto, req.params);
            const errors = await validate(params);
            if (errors.length > 0) {
                res.status(400).json({
                    code: 400,
                    message: '请求参数错误',
                    error: errors
                });
                return;
            }

            const chatId = req.params['chat-id'];
            const conversationId = req.params['conversation-id'];

            // 验证会话归属权
            const conversation = await this.conversationService.getConversationById(conversationId);
            if (!conversation) {
                throw new HttpException(404, '会话不存在');
            }
            if (conversation.userId !== userId) {
                throw new HttpException(403, '无权访问该会话');
            }

            const chat = await this.chatService.getChatContent(chatId, conversationId);
            res.json({
                code: 0,
                message: 'success',
                data: {
                    content: chat.answerContent,
                    content_type: chat.answerContentType
                }
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '获取对话内容失败',
                    error
                });
            }
        }
    };

    // 获取历史消息
    getHistoryMessages = async (
        req: Request<{ 'conversation-id': string }>, 
        res: Response<ApiResponse<MessageResponseDto[]>>
    ): Promise<void> => {
        try {
            if (!req.user) {
                throw new HttpException(401, '未授权访问');
            }
            
            const userId = req.user.id.toString();
            // 验证参数
            const params = plainToInstance(GetHistoryMessagesDto, req.params);
            const errors = await validate(params);
            if (errors.length > 0) {
                res.status(400).json({
                    code: 400,
                    message: '请求参数错误',
                    error: errors
                });
                return;
            }

            const conversationId = req.params['conversation-id'];
            const order = (req.query.order as SortOrder) || SortOrder.ASC;

            // 验证排序参数
            if (order && !Object.values(SortOrder).includes(order)) {
                throw new HttpException(400, '无效的排序参数');
            }

            const messages = await this.chatService.getHistoryMessages(
                userId,
                conversationId,
                order
            );

            res.json({
                code: 0,
                message: '获取历史消息成功',
                data: messages.map(msg => this.toMessageDto(msg))
            });
        } catch (error) {
            if (error instanceof HttpException) {
                res.status(error.status).json({
                    code: error.status,
                    message: error.message,
                    error: error.error
                });
            } else {
                res.status(500).json({
                    code: 500,
                    message: '获取历史消息失败',
                    error
                });
            }
        }
    };
} 