import { ProductController } from './product.controller';
import { CreateProductUseCase } from '../../../application/product/create-product.use-case';
import { CreateProductCommand } from '../../../application/product/create-product.command';
import { Product } from '../../../domain/product/product';

describe('ProductController', () => {
  let controller: ProductController;
  let mockCreateProduct: { execute: jest.Mock };

  beforeEach(() => {
    mockCreateProduct = { execute: jest.fn() };
    controller = new ProductController(mockCreateProduct as unknown as CreateProductUseCase);
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
});
