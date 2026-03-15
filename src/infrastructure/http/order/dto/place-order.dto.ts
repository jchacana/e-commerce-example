import { ArrayMinSize, IsArray, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PlaceOrderItemDto {
	@IsString()
	@IsNotEmpty()
	productId!: string;

	@IsPositive()
	quantity!: number;
}

export class PlaceOrderDto {
	@IsString()
	@IsNotEmpty()
	customerId!: string;

	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => PlaceOrderItemDto)
	items!: PlaceOrderItemDto[];
}
