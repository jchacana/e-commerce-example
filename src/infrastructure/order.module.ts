import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrderController } from './http/order/order.controller';
import { PlaceOrderUseCase } from '../application/order/place-order.use-case';
import { InMemoryOrderRepository } from './persistence/in-memory/in-memory-order.repository';
import { ORDER_REPOSITORY } from '../domain/order/order.repository';
import { TypeOrmOrderRepository } from './persistence/typeorm/typeorm-order.repository';
import { OrderEntity } from './persistence/typeorm/entities/order.entity';
import { OrderItemEntity } from './persistence/typeorm/entities/order-item.entity';

const useTypeOrm = !!process.env['DATABASE_URL'];

/* istanbul ignore next */
const typeOrmFeatureImports = useTypeOrm ? [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity])] : [];

/* istanbul ignore next */
const repositoryProvider = useTypeOrm
	? {
			provide: ORDER_REPOSITORY,
			useFactory: (dataSource: DataSource) => new TypeOrmOrderRepository(dataSource.getRepository(OrderEntity)),
			inject: [DataSource],
		}
	: {
			provide: ORDER_REPOSITORY,
			useClass: InMemoryOrderRepository,
		};

@Module({
	imports: typeOrmFeatureImports,
	controllers: [OrderController],
	providers: [PlaceOrderUseCase, repositoryProvider],
})
export class OrderModule {}
