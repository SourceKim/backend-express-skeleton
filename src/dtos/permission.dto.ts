import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

// 创建权限的请求参数
export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    resource!: string;

    @IsString()
    @IsNotEmpty()
    action!: string;

    @IsOptional()
    @IsString()
    description?: string;
}

// 更新权限的请求参数
export class UpdatePermissionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    resource?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    action?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

// 权限响应
export class PermissionResponseDto {
    id!: string;
    name!: string;
    resource!: string;
    action!: string;
    description?: string;
    created_at!: Date;
    updated_at!: Date;
} 