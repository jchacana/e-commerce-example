import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OrderItemEntity } from './order-item.entity';

@Entity('orders')
export class OrderEntity {
	@PrimaryColumn({ type: 'varchar' })
	id: string;

	@Column({ type: 'varchar', name: 'customer_id' })
	customerId: string;

	@OneToMany(() => OrderItemEntity, (item) => item.order, {
		eager: true,
		cascade: true,
	})
	items: OrderItemEntity[];
}
