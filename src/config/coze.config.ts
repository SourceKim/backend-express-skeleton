import dotenv from 'dotenv';

dotenv.config();

// 使用固定的 token 作为后备
const FALLBACK_API_KEY = 'pat_CLTDsW1iIcADF6v4SP5OxyXO4IWJAOij1sn7poxhOK1IYpjcdXuoWYmLJlbgVMJf';

export const COZE_CONFIG = {
    API_BASE_URL: process.env.COZE_API_BASE_URL || 'https://api.coze.cn/v3',
    BOT_ID: process.env.COZE_BOT_ID || '7469036024069799971',
    API_KEY: process.env.COZE_API_KEY || FALLBACK_API_KEY,
    DEFAULT_USER_ID: process.env.COZE_DEFAULT_USER_ID || '123',
    HEADERS: {
        'Authorization': `Bearer ${process.env.COZE_API_KEY || FALLBACK_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
};

// Coze API 接口路径
export const COZE_API_ENDPOINTS = {
    CHAT: '/chat',
    CHAT_RETRIEVE: '/chat/retrieve',
    CHAT_MESSAGE_LIST: '/chat/message/list'
};

// Coze API 响应状态
export const COZE_CHAT_STATUS = {
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed'
} as const;

// Coze API 错误码
export const COZE_ERROR_CODES = {
    SUCCESS: 0,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
} as const; 