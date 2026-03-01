import { Module } from '@nestjs/common';
import { ProductController } from './http/product/product.controller';
import { CreateProductUseCase } from '../application/product/create-product.use-case';
import { GetAllProductsUseCase } from '../application/product/get-all-products.use-case';
import { InMemoryProductRepository } from './persistence/in-memory/in-memory-product.repository';
import { PRODUCT_REPOSITORY } from '../domain/product/product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    GetAllProductsUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: InMemoryProductRepository,
    },
  ],
})
export class ProductModule {}
