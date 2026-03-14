import { Repository } from 'typeorm';
import { Order, OrderItem } from '../../../domain/order/order';
import { IOrderRepository } from '../../../domain/order/order.repository';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';

export class TypeOrmOrderRepository implements IOrderRepository {
  constructor(private readonly repo: Repository<OrderEntity>) {}

  async save(order: Order): Promise<Order> {
    const entity = new OrderEntity();
    entity.id = order.id;
    entity.customerId = order.customerId;
    entity.items = order.items.map((item) => {
      const itemEntity = new OrderItemEntity();
      itemEntity.productId = item.productId;
      itemEntity.quantity = item.quantity;
      return itemEntity;
    });
    await this.repo.save(entity);
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) return null;
    const items = entity.items.map(
      (i) => new OrderItem(i.productId, i.quantity),
    );
    return new Order(entity.id, entity.customerId, items);
  }
}
