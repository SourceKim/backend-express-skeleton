import { IsString, IsArray, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

// 创建角色的请求参数
export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    @IsString()
    description?: string;
}

// 更新角色的请求参数
export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;
}

// 为角色分配权限的请求参数
export class AssignPermissionsDto {
    @IsArray()
    @IsUUID('4', { each: true })
    permissions!: string[];
}

// 为用户分配角色的请求参数
export class AssignRolesDto {
    @IsArray()
    @IsUUID('4', { each: true })
    roles!: string[];
}

// 角色响应
export class RoleResponseDto {
    id!: string;
    name!: string;
    description?: string;
    permissions!: {
        id: string;
        name: string;
        resource: string;
        action: string;
    }[];
    created_at!: Date;
    updated_at!: Date;
}

// 用户角色响应
export class UserRolesResponseDto {
    id!: string;
    username!: string;
    roles!: {
        id: string;
        name: string;
        permissions: {
            id: string;
            name: string;
            resource: string;
            action: string;
        }[];
    }[];
    updated_at!: Date;
} 