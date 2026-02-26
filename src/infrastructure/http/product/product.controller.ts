import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductUseCase } from '../../../application/product/create-product.use-case';
import { CreateProductCommand } from '../../../application/product/create-product.command';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly createProduct: CreateProductUseCase) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.createProduct.execute(new CreateProductCommand(dto.name, dto.price));
  }
}
