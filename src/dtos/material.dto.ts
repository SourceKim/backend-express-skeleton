import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsArray, IsUUID, IsObject, MaxLength } from 'class-validator';
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
    materialCategoryId?: string;

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

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    materialTagIds?: string[];

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
    materialCategory?: MaterialCategoryDto;
    description?: string;
    is_public: boolean;
    upload_dir?: string;
    user?: {
        id: string;
        username: string;
    };
    tags?: string[];
    materialTags?: MaterialTagDto[];
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
    @IsString({ each: true })
    ids!: string[];
}

/**
 * 分类管理DTO
 * 用于创建和更新分类
 * @deprecated 使用MaterialCategoryDto替代
 */
export class CategoryDto {
    @IsString()
    @MaxLength(50, { message: '分类名称不能超过50个字符' })
    name!: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(200, { message: '分类描述不能超过200个字符' })
    description?: string;
}

/**
 * 标签管理DTO
 * 用于创建和更新标签
 * @deprecated 使用MaterialTagDto替代
 */
export class TagDto {
    @IsString()
    @MaxLength(50, { message: '标签名称不能超过50个字符' })
    name!: string;
}

/**
 * 素材分类管理DTO
 * 用于创建和更新素材分类
 */
export class MaterialCategoryDto {
    @IsString()
    @MaxLength(50, { message: '分类名称不能超过50个字符' })
    name!: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(200, { message: '分类描述不能超过200个字符' })
    description?: string;

    // 以下字段用于响应
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    // 材料数量，用于统计
    count?: number;
}

/**
 * 素材标签管理DTO
 * 用于创建和更新素材标签
 */
export class MaterialTagDto {
    @IsString()
    @MaxLength(50, { message: '标签名称不能超过50个字符' })
    name!: string;
    
    @IsString()
    @IsOptional()
    @MaxLength(200, { message: '标签描述不能超过200个字符' })
    description?: string;

    // 以下字段用于响应
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    // 材料数量，用于统计
    count?: number;
}

/**
 * 按分类和标签查询素材DTO
 * 用于根据分类和标签查询素材
 */
export class MaterialsByCategoryAndTagsDto extends PaginationQueryDto {
    @IsString()
    @IsOptional()
    category?: string;
    
    @IsString()
    @IsOptional()
    materialCategoryId?: string;
    
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
    
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    materialTagIds?: string[];
    
    @IsBoolean()
    @IsOptional()
    is_public?: boolean;
}

/**
 * 分类列表响应DTO
 * @deprecated 使用MaterialCategoriesResponse替代
 */
export type CategoriesResponse = {
    name: string;
    description?: string;
    count: number;
}[];

/**
 * 标签列表响应DTO
 * @deprecated 使用MaterialTagsResponse替代
 */
export type TagsResponse = {
    name: string;
    count: number;
}[];

/**
 * 素材分类列表响应DTO
 */
export type MaterialCategoriesResponse = MaterialCategoryDto[];

/**
 * 素材标签列表响应DTO
 */
export type MaterialTagsResponse = MaterialTagDto[];

export { ApiResponse }; 