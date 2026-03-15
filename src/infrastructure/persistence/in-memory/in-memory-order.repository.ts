import { Order } from '../../../domain/order/order';
import { IOrderRepository } from '../../../domain/order/order.repository';

export class InMemoryOrderRepository implements IOrderRepository {
	private readonly store = new Map<string, Order>();

	async save(order: Order): Promise<Order> {
		this.store.set(order.id, order);
		return order;
	}

	async findById(id: string): Promise<Order | null> {
		return this.store.get(id) ?? null;
	}
}
