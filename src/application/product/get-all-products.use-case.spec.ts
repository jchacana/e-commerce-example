import { GetAllProductsUseCase } from './get-all-products.use-case';
import { IProductRepository } from '../../domain/product/product.repository';
import { InMemoryProductRepository } from '../../infrastructure/persistence/in-memory/in-memory-product.repository';
import { Product } from '../../domain/product/product';

describe('GetAllProductsUseCase', () => {
	let useCase: GetAllProductsUseCase;
	let repository: IProductRepository;

	beforeEach(() => {
		repository = new InMemoryProductRepository();
		useCase = new GetAllProductsUseCase(repository);
	});

	it('returns all products in the repository', async () => {
		await repository.save(Product.create('1', 'Widget', 9.99));

		const result = await useCase.execute();

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Widget');
		expect(result[0].price).toBe(9.99);
	});
});
