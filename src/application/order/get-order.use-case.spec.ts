import { GetOrderUseCase } from './get-order.use-case';
import { IOrderRepository } from '../../domain/order/order.repository';
import { InMemoryOrderRepository } from '../../infrastructure/persistence/in-memory/in-memory-order.repository';
import { Order, OrderItem } from '../../domain/order/order';

describe('GetOrderUseCase', () => {
	let useCase: GetOrderUseCase;
	let repository: IOrderRepository;

	beforeEach(() => {
		repository = new InMemoryOrderRepository();
		useCase = new GetOrderUseCase(repository);
	});

	it('returns the order with the given id', async () => {
		await repository.save(new Order('order-1', 'customer-1', [new OrderItem('product-1', 2)]));

		const result = await useCase.execute('order-1');

		expect(result?.customerId).toBe('customer-1');
		expect(result?.items).toHaveLength(1);
	});
});
