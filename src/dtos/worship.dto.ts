import { IsString, IsArray, IsOptional, IsEnum, IsUUID, IsUrl, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import type { WorshipMaterialType } from '@/models/worship.model';

// 获取上香素材列表的查询参数
export class GetWorshipMaterialsQueryDto {
    @IsString()
    @IsOptional()
    type?: string;
}

// 创建上香素材的请求参数
export class CreateWorshipMaterialDto {
    @IsString()
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(['incense_burner', 'incense', 'buddha', 'wish'])
    type!: WorshipMaterialType;

    @IsUUID()
    @IsOptional()
    assetId?: string;
}

// 更新上香素材的请求参数
export class UpdateWorshipMaterialDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(['incense_burner', 'incense', 'buddha', 'wish'])
    @IsOptional()
    type?: WorshipMaterialType;

    @IsUUID()
    @IsOptional()
    assetId?: string;
}

// 记录上香的请求参数
export class CreateWorshipRecordDto {
    @IsUUID()
    buddhaId!: string;

    @IsArray()
    @IsUUID('4', { each: true })
    materials!: string[];

    @IsString()
    @IsOptional()
    wish?: string;
}

// 更新上香记录的请求参数
export class UpdateWorshipRecordDto {
    @IsUUID()
    @IsOptional()
    buddhaId?: string;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    materials?: string[];

    @IsString()
    @IsOptional()
    wish?: string;
}

// 获取上香记录的查询参数
export class GetWorshipRecordsQueryDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    page?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}

// 获取佛像排行榜的查询参数
export class GetWorshipRankingQueryDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}

// 上香素材的响应 DTO
export class WorshipMaterialResponseDto {
    id!: string;
    title!: string;
    description?: string;
    type!: string;
    assetId?: string;
    asset?: {
        id: string;
        url: string;
    };
    created_at!: Date;
    updated_at!: Date;
}

// 上香记录的响应 DTO
export class WorshipRecordResponseDto {
    id!: string;
    buddhaId!: string;
    buddha!: {
        id: string;
        title: string;
        url: string;
    };
    materials!: {
        id: string;
        title: string;
        type: string;
        url: string;
    }[];
    wish?: string;
    created_at!: Date;
}

// 佛像排行榜的响应 DTO
export class WorshipRankingResponseDto {
    id!: string;
    title!: string;
    description?: string;
    url!: string;
    worshipCount!: number;
} 