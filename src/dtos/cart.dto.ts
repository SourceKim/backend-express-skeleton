import { IsInt, IsPositive, IsString } from 'class-validator';

/**
 * 添加购物车项 DTO
 */
export class AddCartItemDto {
  @IsString()
  product_id!: string;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

/**
 * 更新购物车项数量 DTO
 */
export class UpdateCartItemDto {
  @IsInt()
  @IsPositive()
  quantity!: number;
}

/**
 * 购物车项DTO
 */
export interface CartItemDto {
  id: string;
  product_id: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 购物车DTO
 */
export interface CartDto {
  id: string;
  user_id: string;
  user?: {
    id: string;
    username: string;
  };
  items: CartItemDto[];
  total_price: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * 分页购物车响应DTO
 */
export interface PaginatedCartsResponse {
  items: CartDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    sort_by: string;
    sort_order: 'ASC' | 'DESC';
  };
} 