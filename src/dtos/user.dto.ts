import { UserStatus } from '@/models/user.model';
import { IsString, IsEmail, IsOptional, Length, Matches, IsEnum, MinLength, IsArray, IsBoolean } from 'class-validator';

// 创建用户请求 DTO
export class CreateUserDto {
    @Length(3, 100, { message: '用户名长度必须在3-100个字符之间' })
    username!: string;

    @MinLength(6, { message: '密码长度不能少于6个字符' })
    password!: string;

    @IsOptional()
    @IsEmail({}, { message: '邮箱格式不正确' })
    email?: string;

    @IsOptional()
    @Length(2, 100, { message: '昵称长度必须在2-100个字符之间' })
    nickname?: string;

    @IsOptional()
    @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
    phone?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @Length(0, 500, { message: '简介长度不能超过500个字符' })
    bio?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roles?: string[];
}

// 更新用户请求 DTO
export class UpdateUserDto {
    @IsOptional()
    @IsEmail({}, { message: '邮箱格式不正确' })
    email?: string;

    @IsOptional()
    @Length(2, 100, { message: '昵称长度必须在2-100个字符之间' })
    nickname?: string;

    @IsOptional()
    @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
    phone?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @Length(0, 500, { message: '简介长度不能超过500个字符' })
    bio?: string;

    @IsOptional()
    @IsEnum(UserStatus, { message: '用户状态不正确' })
    status?: UserStatus;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    roles?: string[];
}

// 用户响应 DTO
export interface UserResponseDto {
    id: string;
    username: string;
    email?: string;
    nickname?: string;
    phone?: string;
    avatar?: string;
    status: UserStatus;
    bio?: string;
    merit_points: number;
    meditation_minutes: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    roles: Array<{
        id: string;
        name: string;
        description?: string;
    }>;
}

// 用户列表查询参数 DTO
export class UserQueryDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: '邮箱格式不正确' })
    email?: string;

    @IsOptional()
    @IsEnum(UserStatus, { message: '用户状态不正确' })
    status?: UserStatus;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;
}

// 用户列表响应 DTO
export interface UserListResponseDto {
    items: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
} 