import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { PaginationQueryDto, PaginatedResponse, ApiResponse } from '@/dtos/common.dto';
import { AssetType } from '@/models/asset.model';

export class CreateAssetDto {
    @IsString()
    filename!: string;

    @IsString()
    originalname!: string;

    @IsString()
    path!: string;

    @IsString()
    mimetype!: string;

    @IsNumber()
    size!: number;

    @IsEnum(['image', 'audio', 'video', 'document', 'other'])
    type!: AssetType;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsString()
    @IsOptional()
    upload_dir?: string;

    @IsString()
    @IsOptional()
    user_id?: string;
}

export class UpdateAssetDto {
    @IsString()
    @IsOptional()
    filename?: string;

    @IsString()
    @IsOptional()
    originalname?: string;

    @IsString()
    @IsOptional()
    path?: string;

    @IsString()
    @IsOptional()
    mimetype?: string;

    @IsNumber()
    @IsOptional()
    size?: number;

    @IsEnum(['image', 'audio', 'video', 'document', 'other'])
    @IsOptional()
    type?: AssetType;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsString()
    @IsOptional()
    upload_dir?: string;

    @IsString()
    @IsOptional()
    user_id?: string;
}

export class GetAssetsQueryDto extends PaginationQueryDto {
    @IsString()
    @IsOptional()
    type?: AssetType;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    keyword?: string;

    @IsBoolean()
    @IsOptional()
    is_public?: boolean;

    @IsString()
    @IsOptional()
    user_id?: string;
}

export interface AssetDto {
    id: string;
    filename: string;
    originalname: string;
    path: string;
    mimetype: string;
    size: number;
    type: string;
    category?: string;
    description?: string;
    is_public: boolean;
    upload_dir?: string;
    user_id?: string;
    url: string;
    created_at: Date;
    updated_at: Date;
}

export type PaginatedAssetsResponse = PaginatedResponse<AssetDto>;

export { ApiResponse }; 