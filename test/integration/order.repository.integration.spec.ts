import './setup';
import { DataSource } from 'typeorm';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { IOrderRepository } from '../../src/domain/order/order.repository';
import { Order, OrderItem } from '../../src/domain/order/order';
import { OrderEntity } from '../../src/infrastructure/persistence/typeorm/entities/order.entity';
import { OrderItemEntity } from '../../src/infrastructure/persistence/typeorm/entities/order-item.entity';
import { TypeOrmOrderRepository } from '../../src/infrastructure/persistence/typeorm/typeorm-order.repository';

jest.setTimeout(60000);

describe('TypeOrmOrderRepository (integration)', () => {
  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let repository: IOrderRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16').start();
    dataSource = new DataSource({
      type: 'postgres',
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      entities: [OrderEntity, OrderItemEntity],
      synchronize: true,
    });
    await dataSource.initialize();
    repository = new TypeOrmOrderRepository(dataSource.getRepository(OrderEntity));
  });

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE order_items, orders RESTART IDENTITY CASCADE');
  });

  it('saves an order and retrieves it by id', async () => {
    const order = Order.place('o-1', 'customer-1', [
      new OrderItem('p-1', 2),
      new OrderItem('p-2', 1),
    ]);
    await repository.save(order);

    const found = await repository.findById('o-1');
    expect(found).not.toBeNull();
    expect(found!.id).toBe('o-1');
    expect(found!.customerId).toBe('customer-1');
    expect(found!.items).toHaveLength(2);
    expect(found!.items[0].productId).toBe('p-1');
    expect(found!.items[0].quantity).toBe(2);
  });

  it('returns null when no order with that id exists', async () => {
    const result = await repository.findById('does-not-exist');
    expect(result).toBeNull();
  });
});
