import { PlaceOrderUseCase } from './place-order.use-case';
import { PlaceOrderCommand } from './place-order.command';
import { IOrderRepository } from '../../domain/order/order.repository';
import { Order, OrderItem } from '../../domain/order/order';

describe('PlaceOrderUseCase', () => {
  let useCase: PlaceOrderUseCase;
  let mockRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    useCase = new PlaceOrderUseCase(mockRepository);
  });

  it('builds an order from the command and persists it via the repository', async () => {
    const command = new PlaceOrderCommand('customer-1', [{ productId: 'product-1', quantity: 2 }]);
    const persistedOrder = new Order('saved-id', 'customer-1', [new OrderItem('product-1', 2)]);
    mockRepository.save.mockResolvedValue(persistedOrder);

    const result = await useCase.execute(command);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    const [savedOrder] = mockRepository.save.mock.calls[0];
    expect(savedOrder.customerId).toBe('customer-1');
    expect(savedOrder.items).toHaveLength(1);
    expect(savedOrder.items[0].productId).toBe('product-1');
    expect(savedOrder.items[0].quantity).toBe(2);
    expect(savedOrder.id).toBeDefined();
    expect(result).toBe(persistedOrder);
  });

  it('assigns a unique id to each order', async () => {
    mockRepository.save.mockImplementation((o) => Promise.resolve(o));

    const [first, second] = await Promise.all([
      useCase.execute(new PlaceOrderCommand('c-1', [{ productId: 'p-1', quantity: 1 }])),
      useCase.execute(new PlaceOrderCommand('c-2', [{ productId: 'p-2', quantity: 1 }])),
    ]);

    expect(first.id).not.toBe(second.id);
  });
});
