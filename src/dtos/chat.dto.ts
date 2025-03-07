import { IsString, IsOptional, Length, IsEnum } from 'class-validator';

export class CreateChatDto {
    @IsString()
    content!: string;

    @IsString()
    @IsOptional()
    @Length(1, 50)
    conversationId?: string;

    constructor(partial: Partial<CreateChatDto> = {}) {
        Object.assign(this, partial);
    }
}

export class GetConversationDto {
    @IsString()
    @Length(1, 50)
    conversationId!: string;

    constructor(partial: Partial<GetConversationDto> = {}) {
        Object.assign(this, partial);
    }
}

export class GetChatDto {
    @IsString()
    @Length(1, 50)
    chatId!: string;

    @IsString()
    @Length(1, 50)
    conversationId!: string;

    constructor(partial: Partial<GetChatDto> = {}) {
        Object.assign(this, partial);
    }
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC'
}

export class GetHistoryMessagesDto {
    @IsString()
    @Length(1, 50)
    conversationId!: string;

    @IsEnum(SortOrder)
    @IsOptional()
    order?: SortOrder = SortOrder.ASC;

    constructor(partial: Partial<GetHistoryMessagesDto> = {}) {
        Object.assign(this, partial);
    }
}

// 会话列表响应 DTO
export interface ConversationResponseDto {
    id: string;
    userId: string;
    title: string;
    last_message: string;
    created_at: Date;
    updated_at: Date;
}

// 消息响应 DTO
export interface MessageResponseDto {
    id: string;
    conversationId: string;
    content: string;
    role: string;
    created_at: Date;
}

// 创建聊天响应 DTO
export interface CreateChatResponseDto {
    chatId: string;
    conversationId: string;
}

// 聊天状态响应 DTO
export interface ChatStatusResponseDto {
    status: string;
}

// 聊天内容响应 DTO
export interface ChatContentResponseDto {
    content: string;
    content_type: string;
} 