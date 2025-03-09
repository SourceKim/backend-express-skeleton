import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsArray, IsUUID, IsObject } from 'class-validator';
import { PaginationQueryDto, PaginatedResponse, ApiResponse } from '@/dtos/common.dto';
import { MaterialType } from '@/models/material.model';

/**
 * 创建素材DTO
 * 用于上传文件类型素材时的数据验证
 */
export class CreateMaterialDto {
    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;

    @IsString()
    @IsOptional()
    parent_id?: string;
}

/**
 * 创建文本素材DTO
 * 用于创建文本类型素材时的数据验证
 */
export class CreateTextMaterialDto {
    @IsString()
    content!: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;

    @IsString()
    @IsOptional()
    parent_id?: string;
}

/**
 * 更新素材DTO
 * 用于更新素材信息时的数据验证
 */
export class UpdateMaterialDto {
    @IsString()
    @IsOptional()
    filename?: string;

    @IsString()
    @IsOptional()
    originalname?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
}

/**
 * 素材查询DTO
 * 用于查询素材列表时的参数验证
 */
export class GetMaterialsQueryDto extends PaginationQueryDto {
    @IsEnum(['image', 'audio', 'video', 'document', 'text', 'other'], { each: true })
    @IsOptional()
    type?: MaterialType | MaterialType[];

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    keyword?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsString()
    @IsOptional()
    parent_id?: string;

    @IsNumber()
    @IsOptional()
    min_size?: number;

    @IsNumber()
    @IsOptional()
    max_size?: number;
}

/**
 * 素材DTO
 * 用于返回素材信息
 */
export interface MaterialDto {
    id: string;
    filename?: string;
    originalname?: string;
    path?: string;
    mimetype?: string;
    size?: number;
    type: MaterialType;
    category?: string;
    description?: string;
    is_public: boolean;
    upload_dir?: string;
    user?: {
        id: string;
        username: string;
    };
    tags?: string[];
    metadata?: Record<string, any>;
    parent_id?: string;
    url?: string;
    created_at: Date;
    updated_at: Date;
}

/**
 * 分页素材响应
 * 用于返回分页的素材列表
 */
export type PaginatedMaterialsResponse = PaginatedResponse<MaterialDto>;

/**
 * 批量删除素材DTO
 * 用于批量删除素材时的参数验证
 */
export class BatchDeleteMaterialsDto {
    @IsArray()
    @IsUUID(undefined, { each: true })
    ids!: string[];
}

export { ApiResponse }; 