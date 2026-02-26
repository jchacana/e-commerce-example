import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../domain/product/product';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/product/product.repository';
import { CreateProductCommand } from './create-product.command';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: IProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<Product> {
    const product = Product.create(uuidv4(), command.name, command.price);
    return this.repository.save(product);
  }
}
