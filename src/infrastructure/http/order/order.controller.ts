import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlaceOrderUseCase } from '../../../application/order/place-order.use-case';
import { PlaceOrderCommand } from '../../../application/order/place-order.command';
import { PlaceOrderDto } from './dto/place-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
	constructor(private readonly placeOrder: PlaceOrderUseCase) {}

	@ApiOperation({ summary: 'Place a new order' })
	@ApiResponse({ status: 201, description: 'Order placed successfully' })
	@ApiResponse({ status: 400, description: 'Invalid input' })
	@Post()
	place(@Body() dto: PlaceOrderDto) {
		return this.placeOrder.execute(new PlaceOrderCommand(dto.customerId, dto.items));
	}
}
