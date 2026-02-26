import { Product } from '../../../domain/product/product';
import { IProductRepository } from '../../../domain/product/product.repository';

export class InMemoryProductRepository implements IProductRepository {
  private readonly store = new Map<string, Product>();

  async save(product: Product): Promise<Product> {
    this.store.set(product.id, product);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.store.values());
  }
}
