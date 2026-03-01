import { GetAllProductsUseCase } from './get-all-products.use-case';
import { IProductRepository } from '../../domain/product/product.repository';
import { Product } from '../../domain/product/product';

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new GetAllProductsUseCase(mockRepository);
  });

  it('returns all products from the repository', async () => {
    const products = [Product.create('1', 'Widget', 9.99)];
    mockRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBe(products);
  });
});
