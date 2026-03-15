import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderItem } from '../../domain/order/order';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/order/order.repository';
import { PlaceOrderCommand } from './place-order.command';

@Injectable()
export class PlaceOrderUseCase {
	constructor(
		@Inject(ORDER_REPOSITORY)
		private readonly repository: IOrderRepository,
	) {}

	async execute(command: PlaceOrderCommand): Promise<Order> {
		const items = command.items.map((i) => new OrderItem(i.productId, i.quantity));
		const order = Order.place(uuidv4(), command.customerId, items);
		return this.repository.save(order);
	}
}
