import { OrderController } from './order.controller';
import { PlaceOrderUseCase } from '../../../application/order/place-order.use-case';
import { PlaceOrderCommand } from '../../../application/order/place-order.command';
import { Order, OrderItem } from '../../../domain/order/order';

describe('OrderController', () => {
  let controller: OrderController;
  let mockPlaceOrder: { execute: jest.Mock };

  beforeEach(() => {
    mockPlaceOrder = { execute: jest.fn() };
    controller = new OrderController(mockPlaceOrder as unknown as PlaceOrderUseCase);
  });

  it('delegates to PlaceOrderUseCase with a command built from the DTO', async () => {
    const order = new Order('order-1', 'customer-1', [new OrderItem('product-1', 2)]);
    mockPlaceOrder.execute.mockResolvedValue(order);

    const result = await controller.place({
      customerId: 'customer-1',
      items: [{ productId: 'product-1', quantity: 2 }],
    });

    expect(mockPlaceOrder.execute).toHaveBeenCalledWith(
      new PlaceOrderCommand('customer-1', [{ productId: 'product-1', quantity: 2 }]),
    );
    expect(result).toBe(order);
  });

  it('returns whatever the use case returns', async () => {
    const order = new Order('order-2', 'customer-2', [new OrderItem('product-2', 1)]);
    mockPlaceOrder.execute.mockResolvedValue(order);

    const result = await controller.place({
      customerId: 'customer-2',
      items: [{ productId: 'product-2', quantity: 1 }],
    });

    expect(result).toBe(order);
  });
});
