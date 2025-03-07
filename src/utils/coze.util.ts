import axios from 'axios';
import { COZE_CONFIG, COZE_API_ENDPOINTS, COZE_ERROR_CODES } from '@/config/coze.config';

class CozeApiError extends Error {
    constructor(
        public code: number,
        message: string,
        public response?: any
    ) {
        super(message);
        this.name = 'CozeApiError';
    }
}

export class CozeApi {
    private static instance: CozeApi;
    private constructor() {}

    public static getInstance(): CozeApi {
        if (!CozeApi.instance) {
            CozeApi.instance = new CozeApi();
        }
        return CozeApi.instance;
    }

    private async request(method: string, endpoint: string, data?: any, params?: any) {
        try {

            const response = await axios({
                method,
                url: `${COZE_CONFIG.API_BASE_URL}${endpoint}`,
                headers: COZE_CONFIG.HEADERS,
                data,
                params
            });

            if (response.data.code !== COZE_ERROR_CODES.SUCCESS) {
                throw new CozeApiError(
                    response.data.code,
                    response.data.msg || '请求失败',
                    response.data
                );
            }

            return response.data;
        } catch (error: any) {
            console.error('Coze API Error:', {
                name: error.name,
                message: error.message,
                response: error.response?.data,
                stack: error.stack
            });

            if (error instanceof CozeApiError) {
                throw error;
            }
            
            throw new CozeApiError(
                error.response?.status || COZE_ERROR_CODES.INTERNAL_ERROR,
                error.message || '请求失败',
                error.response?.data
            );
        }
    }

    public async createChat(content: string, conversationId?: string) {
        const data = {
            bot_id: COZE_CONFIG.BOT_ID,
            user_id: COZE_CONFIG.DEFAULT_USER_ID,
            stream: false,
            auto_save_history: true,
            additional_messages: [{
                role: 'user',
                type: 'question',
                content,
                content_type: 'text'
            }]
        };

        const response = await this.request('POST', COZE_API_ENDPOINTS.CHAT, data, 
            conversationId ? { conversation_id: conversationId } : undefined
        );
        return response;
    }

    public async retrieveChat(chatId: string, conversationId: string) {
        return this.request('GET', COZE_API_ENDPOINTS.CHAT_RETRIEVE, undefined, {
            chat_id: chatId,
            conversation_id: conversationId
        });
    }

    public async getChatMessages(chatId: string, conversationId: string) {
        return this.request('GET', COZE_API_ENDPOINTS.CHAT_MESSAGE_LIST, undefined, {
            chat_id: chatId,
            conversation_id: conversationId
        });
    }
}

export const cozeApi = CozeApi.getInstance(); 