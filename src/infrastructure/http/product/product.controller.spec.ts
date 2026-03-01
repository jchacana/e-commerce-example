import { ProductController } from './product.controller';
import { CreateProductUseCase } from '../../../application/product/create-product.use-case';
import { CreateProductCommand } from '../../../application/product/create-product.command';
import { GetAllProductsUseCase } from '../../../application/product/get-all-products.use-case';
import { GetProductUseCase } from '../../../application/product/get-product.use-case';
import { Product } from '../../../domain/product/product';

describe('ProductController', () => {
  let controller: ProductController;
  let mockCreateProduct: { execute: jest.Mock };
  let mockGetAllProducts: { execute: jest.Mock };
  let mockGetProduct: { execute: jest.Mock };

  beforeEach(() => {
    mockCreateProduct = { execute: jest.fn() };
    mockGetAllProducts = { execute: jest.fn() };
    mockGetProduct = { execute: jest.fn() };
    controller = new ProductController(
      mockCreateProduct as unknown as CreateProductUseCase,
      mockGetAllProducts as unknown as GetAllProductsUseCase,
      mockGetProduct as unknown as GetProductUseCase,
    );
  });

  it('delegates to CreateProductUseCase with a command built from the DTO', async () => {
    const product = Product.create('1', 'Widget', 9.99);
    mockCreateProduct.execute.mockResolvedValue(product);

    const result = await controller.create({ name: 'Widget', price: 9.99 });

    expect(mockCreateProduct.execute).toHaveBeenCalledWith(
      new CreateProductCommand('Widget', 9.99),
    );
    expect(result).toBe(product);
  });

  it('returns whatever the use case returns', async () => {
    const product = Product.create('2', 'Gadget', 49.99);
    mockCreateProduct.execute.mockResolvedValue(product);

    const result = await controller.create({ name: 'Gadget', price: 49.99 });

    expect(result).toBe(product);
  });

  it('delegates to GetAllProductsUseCase and returns the result', async () => {
    const products = [Product.create('1', 'Widget', 9.99)];
    mockGetAllProducts.execute.mockResolvedValue(products);

    const result = await controller.findAll();

    expect(mockGetAllProducts.execute).toHaveBeenCalledTimes(1);
    expect(result).toBe(products);
  });

  it('delegates to GetProductUseCase with the id and returns the result', async () => {
    const product = Product.create('1', 'Gadget', 19.99);
    mockGetProduct.execute.mockResolvedValue(product);

    const result = await controller.findOne('1');

    expect(mockGetProduct.execute).toHaveBeenCalledWith('1');
    expect(result).toBe(product);
  });
});
