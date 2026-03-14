import { CreateProductUseCase } from './create-product.use-case';
import { CreateProductCommand } from './create-product.command';
import { IProductRepository } from '../../domain/product/product.repository';
import { InMemoryProductRepository } from '../../infrastructure/persistence/in-memory/in-memory-product.repository';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let repository: IProductRepository;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    useCase = new CreateProductUseCase(repository);
  });

  it('creates a product and returns it with a generated id, name, and price', async () => {
    const result = await useCase.execute(new CreateProductCommand('Widget', 9.99));

    expect(result.id).toBeDefined();
    expect(result.name).toBe('Widget');
    expect(result.price).toBe(9.99);
  });

  it('assigns a unique id to each product', async () => {
    const [first, second] = await Promise.all([
      useCase.execute(new CreateProductCommand('A', 1)),
      useCase.execute(new CreateProductCommand('B', 2)),
    ]);

    expect(first.id).not.toBe(second.id);
  });
});
