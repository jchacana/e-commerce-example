import { Module } from '@nestjs/common';
import { ProductModule } from './infrastructure/product.module';

@Module({
  imports: [ProductModule],
})
export class AppModule {}
