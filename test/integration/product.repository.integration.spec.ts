import { IProductRepository } from '../../src/domain/product/product.repository';
import { Product } from '../../src/domain/product/product';

describe('ProductRepository (integration)', () => {
  let repository: IProductRepository;

  beforeAll(async () => {
    // TODO: wire up real TypeORM repository with Testcontainers
    // Stub — validates suite isolation only
  });

  it('saves a product and retrieves it by id', async () => {
    expect(true).toBe(true); // stub
  });

  it('returns null when no product with that id exists', async () => {
    expect(true).toBe(true); // stub
  });

  it('returns all saved products', async () => {
    expect(true).toBe(true); // stub
  });
});
