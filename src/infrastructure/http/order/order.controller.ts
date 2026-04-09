import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlaceOrderUseCase } from '../../../application/order/place-order.use-case';
import { GetOrderUseCase } from '../../../application/order/get-order.use-case';
import { PlaceOrderCommand } from '../../../application/order/place-order.command';
import { PlaceOrderDto } from './dto/place-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
	constructor(
		private readonly placeOrder: PlaceOrderUseCase,
		private readonly getOrder: GetOrderUseCase,
	) {}

	@ApiOperation({ summary: 'Place a new order' })
	@ApiResponse({ status: 201, description: 'Order placed successfully' })
	@ApiResponse({ status: 400, description: 'Invalid input' })
	@Post()
	place(@Body() dto: PlaceOrderDto) {
		return this.placeOrder.execute(new PlaceOrderCommand(dto.customerId, dto.items));
	}

	@ApiOperation({ summary: 'Get an order by ID' })
	@ApiResponse({ status: 200, description: 'Order found' })
	@ApiResponse({ status: 404, description: 'Order not found' })
	@Get(':id')
	async findOne(@Param('id') id: string) {
		const order = await this.getOrder.execute(id);
		if (!order) throw new NotFoundException();
		return order;
	}
}
