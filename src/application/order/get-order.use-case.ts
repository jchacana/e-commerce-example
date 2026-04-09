import { Inject } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/order/order.repository';

export class GetOrderUseCase {
	constructor(@Inject(ORDER_REPOSITORY) private readonly repository: IOrderRepository) {}

	execute(id: string) {
		return this.repository.findById(id);
	}
}
