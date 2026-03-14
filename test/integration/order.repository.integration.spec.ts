import { IOrderRepository } from '../../src/domain/order/order.repository';

describe('OrderRepository (integration)', () => {
  let repository: IOrderRepository;

  beforeAll(async () => {
    // TODO: wire up real TypeORM repository with Testcontainers
    // Stub — validates suite isolation only
  });

  it('saves an order and retrieves it by id', async () => {
    expect(true).toBe(true); // stub
  });

  it('returns null when no order with that id exists', async () => {
    expect(true).toBe(true); // stub
  });
});
