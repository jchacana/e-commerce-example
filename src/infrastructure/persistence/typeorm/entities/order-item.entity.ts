import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'product_id' })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  order: OrderEntity;
}
