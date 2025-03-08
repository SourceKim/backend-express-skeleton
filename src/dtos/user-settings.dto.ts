import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';

// 创建用户设置的请求参数
export class CreateUserSettingsDto {
    @IsString()
    @IsNotEmpty()
    theme!: string;

    @IsString()
    @IsNotEmpty()
    language!: string;

    @IsBoolean()
    notifications_enabled!: boolean;
}

// 更新用户设置的请求参数
export class UpdateUserSettingsDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    theme?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    language?: string;

    @IsOptional()
    @IsBoolean()
    notifications_enabled?: boolean;
}

// 用户设置响应
export class UserSettingsResponseDto {
    id!: string;
    theme!: string;
    language!: string;
    notifications_enabled!: boolean;
    created_at!: Date;
    updated_at!: Date;
} 