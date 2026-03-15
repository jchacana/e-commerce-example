import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductUseCase } from '../../../application/product/create-product.use-case';
import { GetAllProductsUseCase } from '../../../application/product/get-all-products.use-case';
import { GetProductUseCase } from '../../../application/product/get-product.use-case';
import { CreateProductCommand } from '../../../application/product/create-product.command';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
	constructor(
		private readonly createProduct: CreateProductUseCase,
		private readonly getAllProducts: GetAllProductsUseCase,
		private readonly getProduct: GetProductUseCase,
	) {}

	@ApiOperation({ summary: 'Create a new product' })
	@ApiResponse({ status: 201, description: 'Product created successfully' })
	@ApiResponse({ status: 400, description: 'Invalid input' })
	@Post()
	create(@Body() dto: CreateProductDto) {
		return this.createProduct.execute(new CreateProductCommand(dto.name, dto.price));
	}

	@ApiOperation({ summary: 'Get all products' })
	@ApiResponse({ status: 200, description: 'List of all products' })
	@Get()
	findAll() {
		return this.getAllProducts.execute();
	}

	@ApiOperation({ summary: 'Get a product by ID' })
	@ApiResponse({ status: 200, description: 'Product found' })
	@ApiResponse({ status: 404, description: 'Product not found' })
	@Get(':id')
	async findOne(@Param('id') id: string) {
		const product = await this.getProduct.execute(id);
		if (!product) throw new NotFoundException();
		return product;
	}
}
