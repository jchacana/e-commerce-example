export class Product {
	constructor(
		readonly id: string,
		readonly name: string,
		readonly price: number,
	) {}

	static create(id: string, name: string, price: number): Product {
		if (!name || name.trim().length === 0) {
			throw new Error('Product name is required');
		}
		if (price <= 0) {
			throw new Error('Product price must be positive');
		}
		return new Product(id, name, price);
	}
}
