import { UserStatus } from '@/models/user.model';

// 注册请求 DTO
export interface RegisterDto {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    bio?: string;
}

// 登录请求 DTO
export interface LoginDto {
    username: string;
    password: string;
}

// 注册响应 DTO
export interface RegisterResponseDto {
    id: string;
    username: string;
    email?: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    bio?: string;
    status: UserStatus;
    created_at: Date;
    updated_at: Date;
    roles: Array<{
        id: string;
        name: string;
        description?: string;
    }>;
}

// 登录响应 DTO
export interface LoginResponseDto {
    access_token: string;
    user: {
        id: string;
        username: string;
        email?: string;
        phone?: string;
        nickname?: string;
        avatar?: string;
        bio?: string;
        status: UserStatus;
        roles: Array<{
            id: string;
            name: string;
            description?: string;
        }>;
    };
}

// 用户资料响应 DTO
export interface ProfileResponseDto {
    id: string;
    username: string;
    email?: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    bio?: string;
    status: UserStatus;
    created_at: Date;
    updated_at: Date;
    roles: Array<{
        id: string;
        name: string;
        description?: string;
    }>;
}

// 更新用户资料请求 DTO
export interface UpdateProfileDto {
    email?: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    bio?: string;
} 