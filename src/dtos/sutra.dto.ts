import { PaginationQueryDto, PaginatedResponse, ApiResponse } from '@/dtos/common.dto';

export class CreateSutraDto {
    constructor(
        public title: string,
        public description: string,
        public content: string,
        public category: string
    ) {}
}

export class UpdateSutraDto {
    title?: string;
    description?: string;
    content?: string;
    category?: string;
}

export class GetSutrasQueryDto extends PaginationQueryDto {
    category?: string;
    keyword?: string;
}

export interface SutraDto {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    read_count: number;
    created_at: Date;
    updated_at: Date;
}

export type PaginatedSutrasResponse = PaginatedResponse<SutraDto>;

export { ApiResponse }; 