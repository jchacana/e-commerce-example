import { DataSource } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';

export const AppDataSource = new DataSource({
	type: 'postgres',
	url: process.env['DATABASE_URL'],
	entities: [ProductEntity, OrderEntity, OrderItemEntity],
	migrations: ['src/infrastructure/persistence/typeorm/migrations/*.ts'],
	synchronize: false,
});
