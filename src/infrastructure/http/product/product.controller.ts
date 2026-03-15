import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateProductUseCase } from '../../../application/product/create-product.use-case';
import { GetAllProductsUseCase } from '../../../application/product/get-all-products.use-case';
import { GetProductUseCase } from '../../../application/product/get-product.use-case';
import { CreateProductCommand } from '../../../application/product/create-product.command';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
	constructor(
		private readonly createProduct: CreateProductUseCase,
		private readonly getAllProducts: GetAllProductsUseCase,
		private readonly getProduct: GetProductUseCase,
	) {}

	@Post()
	create(@Body() dto: CreateProductDto) {
		return this.createProduct.execute(new CreateProductCommand(dto.name, dto.price));
	}

	@Get()
	findAll() {
		return this.getAllProducts.execute();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const product = await this.getProduct.execute(id);
		if (!product) throw new NotFoundException();
		return product;
	}
}
