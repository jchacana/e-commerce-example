import { Module } from '@nestjs/common';
import { ProductModule } from './infrastructure/product.module';
import { OrderModule } from './infrastructure/order.module';

@Module({
	imports: [ProductModule, OrderModule],
})
export class AppModule {}
