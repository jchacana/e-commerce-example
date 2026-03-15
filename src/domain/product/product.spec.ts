import { Product } from './product';

describe('Product', () => {
	it('creates a product with valid attributes', () => {
		const product = Product.create('1', 'Widget', 9.99);

		expect(product.id).toBe('1');
		expect(product.name).toBe('Widget');
		expect(product.price).toBe(9.99);
	});

	it('rejects a blank name', () => {
		expect(() => Product.create('1', '', 9.99)).toThrow('Product name is required');
	});

	it('rejects a whitespace-only name', () => {
		expect(() => Product.create('1', '   ', 9.99)).toThrow('Product name is required');
	});

	it('rejects a zero price', () => {
		expect(() => Product.create('1', 'Widget', 0)).toThrow('Product price must be positive');
	});

	it('rejects a negative price', () => {
		expect(() => Product.create('1', 'Widget', -5)).toThrow('Product price must be positive');
	});
});
