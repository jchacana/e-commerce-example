import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './infrastructure/product.module';
import { OrderModule } from './infrastructure/order.module';
import { HealthModule } from './infrastructure/health.module';
import { ProductEntity } from './infrastructure/persistence/typeorm/entities/product.entity';
import { OrderEntity } from './infrastructure/persistence/typeorm/entities/order.entity';
import { OrderItemEntity } from './infrastructure/persistence/typeorm/entities/order-item.entity';

if (process.env['NODE_ENV'] === 'production' && !process.env['DATABASE_URL']) {
	throw new Error(
		'DATABASE_URL must be set in production. In-memory persistence is not available in production environments.',
	);
}

/* istanbul ignore next */
const typeOrmImports = process.env['DATABASE_URL']
	? [
			TypeOrmModule.forRoot({
				type: 'postgres',
				url: process.env['DATABASE_URL'],
				entities: [ProductEntity, OrderEntity, OrderItemEntity],
				migrations: ['src/infrastructure/persistence/typeorm/migrations/*.ts'],
				synchronize: false,
			}),
		]
	: [];

@Module({
	imports: [...typeOrmImports, ProductModule, OrderModule, HealthModule],
})
export class AppModule {}
