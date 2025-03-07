import { IsArray, IsInt, IsOptional, IsUUID, Min, IsEnum, IsString, ValidateIf } from 'class-validator';
import type { MeditationMaterialType, MeditationStatus } from '@/models/meditation.model';
import { PaginationQueryDto } from '@/dtos/common.dto';

// 获取冥想素材列表的查询参数
export class GetMaterialsQueryDto extends PaginationQueryDto {
    type?: MeditationMaterialType;
    keyword?: string;
}

// 创建冥想素材的请求参数
export class CreateMaterialDto {
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(['audio', 'image', 'text', 'video'], { message: '素材类型必须是 audio, image, text, video 中的一个' })
    type!: MeditationMaterialType;

    @IsOptional()
    @IsUUID()
    @ValidateIf(o => o.type !== 'text')
    assetId?: string;

    @IsOptional()
    @IsString()
    @ValidateIf(o => o.type === 'text')
    content?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    duration?: number;
}

// 更新冥想素材的请求参数
export class UpdateMaterialDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(['audio', 'image', 'text', 'video'], { message: '素材类型必须是 audio, image, text, video 中的一个' })
    type?: MeditationMaterialType;

    @IsOptional()
    @IsUUID()
    assetId?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    duration?: number;
}

// 开始冥想的请求参数
export class StartMeditationDto {
    constructor(
        public materialId: string,
        public duration: number
    ) {}
}

// 结束冥想的请求参数
export class EndMeditationDto {
    constructor(
        public meditationId: string,
        public actualDuration: number,
        public notes?: string
    ) {}
}

// 获取冥想记录的查询参数
export class GetRecordsQueryDto extends PaginationQueryDto {
    startDate?: string;
    endDate?: string;
    status?: MeditationStatus;
}

// 冥想素材响应
export interface MeditationMaterialDto {
    id: string;
    title: string;
    description: string | null;
    type: MeditationMaterialType;
    assetId: string | null;
    asset?: {
        id: string;
        path: string;
        mimetype: string;
    } | null;
    content: string | null;
    duration: number | null;
    created_at: Date;
    updated_at: Date;
}

// 冥想记录响应
export interface MeditationRecordDto {
    id: string;
    userId: string;
    status: MeditationStatus;
    startTime: Date;
    endTime: Date | null;
    duration: number | null;
    materials: {
        id: string;
        title: string;
        type: MeditationMaterialType;
        assetId: string | null;
        asset?: {
            id: string;
            path: string;
            mimetype: string;
        } | null;
        content: string | null;
    }[];
    created_at: Date;
    updated_at: Date;
}

export type PaginatedMaterialsResponse = {
    items: MeditationMaterialDto[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export type PaginatedRecordsResponse = {
    items: MeditationRecordDto[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
} 