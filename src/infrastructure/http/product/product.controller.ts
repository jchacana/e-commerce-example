import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductUseCase } from '../../../application/product/create-product.use-case';
import { GetAllProductsUseCase } from '../../../application/product/get-all-products.use-case';
import { CreateProductCommand } from '../../../application/product/create-product.command';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly getAllProducts: GetAllProductsUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProduct.execute(new CreateProductCommand(dto.name, dto.price));
  }

  @Get()
  findAll() {
    return this.getAllProducts.execute();
  }
}
