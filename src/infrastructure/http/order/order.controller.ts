import { Body, Controller, Post } from '@nestjs/common';
import { PlaceOrderUseCase } from '../../../application/order/place-order.use-case';
import { PlaceOrderCommand } from '../../../application/order/place-order.command';
import { PlaceOrderDto } from './dto/place-order.dto';

@Controller('orders')
export class OrderController {
	constructor(private readonly placeOrder: PlaceOrderUseCase) {}

	@Post()
	place(@Body() dto: PlaceOrderDto) {
		return this.placeOrder.execute(new PlaceOrderCommand(dto.customerId, dto.items));
	}
}
