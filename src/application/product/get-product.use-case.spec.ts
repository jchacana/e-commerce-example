import { GetProductUseCase } from './get-product.use-case';
import { IProductRepository } from '../../domain/product/product.repository';
import { Product } from '../../domain/product/product';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new GetProductUseCase(mockRepository);
  });

  it('returns the product from the repository by id', async () => {
    const product = Product.create('1', 'Gadget', 19.99);
    mockRepository.findById.mockResolvedValue(product);

    const result = await useCase.execute('1');

    expect(mockRepository.findById).toHaveBeenCalledWith('1');
    expect(result).toBe(product);
  });
});
