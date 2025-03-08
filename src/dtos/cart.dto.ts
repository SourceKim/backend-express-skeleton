import { IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  productId!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;

  constructor(partial: Partial<AddToCartDto> = {}) {
    Object.assign(this, partial);
  }
}

export class UpdateCartDto {
  @IsNumber()
  @Min(1)
  quantity!: number;

  constructor(partial: Partial<UpdateCartDto> = {}) {
    Object.assign(this, partial);
  }
} 