import { GetProductUseCase } from './get-product.use-case';
import { InMemoryProductRepository } from '../../infrastructure/persistence/in-memory/in-memory-product.repository';
import { Product } from '../../domain/product/product';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let repository: InMemoryProductRepository;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    useCase = new GetProductUseCase(repository);
  });

  it('returns the product with the given id', async () => {
    await repository.save(Product.create('1', 'Gadget', 19.99));

    const result = await useCase.execute('1');

    expect(result?.name).toBe('Gadget');
    expect(result?.price).toBe(19.99);
  });
});
