export class OrderItem {
	constructor(
		readonly productId: string,
		readonly quantity: number,
	) {
		if (quantity <= 0) {
			throw new Error('Order item quantity must be positive');
		}
	}
}

export class Order {
	constructor(
		readonly id: string,
		readonly customerId: string,
		readonly items: readonly OrderItem[],
	) {}

	static place(id: string, customerId: string, items: OrderItem[]): Order {
		if (!customerId || customerId.trim().length === 0) {
			throw new Error('Order must have a customer');
		}
		if (items.length === 0) {
			throw new Error('Order must have at least one item');
		}
		return new Order(id, customerId, items);
	}
}
