import { PlaceOrderUseCase } from './place-order.use-case';
import { PlaceOrderCommand } from './place-order.command';
import { InMemoryOrderRepository } from '../../infrastructure/persistence/in-memory/in-memory-order.repository';

describe('PlaceOrderUseCase', () => {
  let useCase: PlaceOrderUseCase;
  let repository: InMemoryOrderRepository;

  beforeEach(() => {
    repository = new InMemoryOrderRepository();
    useCase = new PlaceOrderUseCase(repository);
  });

  it('places an order and returns it with a generated id, customer, and items', async () => {
    const command = new PlaceOrderCommand('customer-1', [{ productId: 'product-1', quantity: 2 }]);

    const result = await useCase.execute(command);

    expect(result.id).toBeDefined();
    expect(result.customerId).toBe('customer-1');
    expect(result.items).toHaveLength(1);
    expect(result.items[0].productId).toBe('product-1');
    expect(result.items[0].quantity).toBe(2);
  });

  it('assigns a unique id to each order', async () => {
    const [first, second] = await Promise.all([
      useCase.execute(new PlaceOrderCommand('c-1', [{ productId: 'p-1', quantity: 1 }])),
      useCase.execute(new PlaceOrderCommand('c-2', [{ productId: 'p-2', quantity: 1 }])),
    ]);

    expect(first.id).not.toBe(second.id);
  });
});
