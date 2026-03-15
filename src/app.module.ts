import { Module } from '@nestjs/common';
import { ProductModule } from './infrastructure/product.module';
import { OrderModule } from './infrastructure/order.module';
import { HealthModule } from './infrastructure/health.module';

@Module({
	imports: [ProductModule, OrderModule, HealthModule],
})
export class AppModule {}
