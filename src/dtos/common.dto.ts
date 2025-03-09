import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';

/**
 * 分页查询DTO
 * 用于分页查询的参数验证
 */
export class PaginationQueryDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @IsInt()
    @Min(1)
    @IsOptional()
    limit?: number = 20;

    @IsString()
    @IsOptional()
    sort_by?: string = 'created_at';

    @IsEnum(['ASC', 'DESC'])
    @IsOptional()
    sort_order?: 'ASC' | 'DESC' = 'DESC';

    static fromRequest(query: any): PaginationQueryDto {
        return {
            page: parseInt(query.page as string) || 1,
            limit: parseInt(query.limit as string) || 20,
            sort_by: query.sort_by || 'created_at',
            sort_order: (query.sort_order as 'ASC' | 'DESC') || 'DESC'
        };
    }
}

/**
 * 分页响应接口
 * 用于返回分页数据
 */
export interface PaginatedResponse<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
        sort_by?: string;
        sort_order?: 'ASC' | 'DESC';
    };
}

/**
 * API响应接口
 * 用于统一API响应格式
 */
export interface ApiResponse<T> {
    code: number; // 0: 成功, 其他: 失败
    message?: string;
    data?: T;
    error?: any;
} 