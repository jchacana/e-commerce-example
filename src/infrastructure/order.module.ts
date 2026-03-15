import { Module } from '@nestjs/common';
import { OrderController } from './http/order/order.controller';
import { PlaceOrderUseCase } from '../application/order/place-order.use-case';
import { InMemoryOrderRepository } from './persistence/in-memory/in-memory-order.repository';
import { ORDER_REPOSITORY } from '../domain/order/order.repository';

@Module({
	controllers: [OrderController],
	providers: [
		PlaceOrderUseCase,
		{
			provide: ORDER_REPOSITORY,
			useClass: InMemoryOrderRepository,
		},
	],
})
export class OrderModule {}
