export class PaginationQueryDto {
    constructor(
        public page: number = 1,
        public limit: number = 20
    ) {}

    static fromRequest(query: any): PaginationQueryDto {
        return new PaginationQueryDto(
            parseInt(query.page as string) || 1,
            parseInt(query.limit as string) || 20
        );
    }
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data?: T;
    error?: any;
} 