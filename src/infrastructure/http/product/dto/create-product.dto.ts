import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsPositive()
	price!: number;
}
