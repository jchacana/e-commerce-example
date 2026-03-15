import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
	@ApiProperty({ description: 'Product name', example: 'Laptop' })
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({ description: 'Product price in USD', example: 999.99 })
	@IsPositive()
	price!: number;
}
