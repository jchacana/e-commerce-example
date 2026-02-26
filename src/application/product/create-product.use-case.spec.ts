import { CreateProductUseCase } from './create-product.use-case';
import { CreateProductCommand } from './create-product.command';
import { IProductRepository } from '../../domain/product/product.repository';
import { Product } from '../../domain/product/product';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateProductUseCase(mockRepository);
  });

  it('creates a product and persists it via the repository', async () => {
    const command = new CreateProductCommand('Widget', 9.99);
    const persistedProduct = Product.create('generated-id', 'Widget', 9.99);
    mockRepository.save.mockResolvedValue(persistedProduct);

    const result = await useCase.execute(command);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    const [savedProduct] = mockRepository.save.mock.calls[0];
    expect(savedProduct.name).toBe('Widget');
    expect(savedProduct.price).toBe(9.99);
    expect(savedProduct.id).toBeDefined();
    expect(result).toBe(persistedProduct);
  });

  it('assigns a unique id to each product', async () => {
    mockRepository.save.mockImplementation((p) => Promise.resolve(p));

    const [first, second] = await Promise.all([
      useCase.execute(new CreateProductCommand('A', 1)),
      useCase.execute(new CreateProductCommand('B', 2)),
    ]);

    expect(first.id).not.toBe(second.id);
  });
});
