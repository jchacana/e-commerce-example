import { ArrayMinSize, IsArray, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceOrderItemDto {
	@ApiProperty({ description: 'Product ID', example: 'prod-123' })
	@IsString()
	@IsNotEmpty()
	productId!: string;

	@ApiProperty({ description: 'Quantity to order', example: 2 })
	@IsPositive()
	quantity!: number;
}

export class PlaceOrderDto {
	@ApiProperty({ description: 'Customer ID', example: 'cust-456' })
	@IsString()
	@IsNotEmpty()
	customerId!: string;

	@ApiProperty({ description: 'Order items', type: [PlaceOrderItemDto] })
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => PlaceOrderItemDto)
	items!: PlaceOrderItemDto[];
}
