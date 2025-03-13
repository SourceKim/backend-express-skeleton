import { IsInt, IsPositive } from 'class-validator';

/**
 * 添加购物车项 DTO
 */
export class AddCartItemDto {
  @IsInt()
  @IsPositive()
  product_id!: number;

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