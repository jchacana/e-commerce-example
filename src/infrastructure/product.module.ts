import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductController } from './http/product/product.controller';
import { CreateProductUseCase } from '../application/product/create-product.use-case';
import { GetAllProductsUseCase } from '../application/product/get-all-products.use-case';
import { GetProductUseCase } from '../application/product/get-product.use-case';
import { InMemoryProductRepository } from './persistence/in-memory/in-memory-product.repository';
import { PRODUCT_REPOSITORY } from '../domain/product/product.repository';
import { TypeOrmProductRepository } from './persistence/typeorm/typeorm-product.repository';
import { ProductEntity } from './persistence/typeorm/entities/product.entity';

const useTypeOrm = !!process.env['DATABASE_URL'];

/* istanbul ignore next */
const typeOrmFeatureImports = useTypeOrm ? [TypeOrmModule.forFeature([ProductEntity])] : [];

/* istanbul ignore next */
const repositoryProvider = useTypeOrm
	? {
			provide: PRODUCT_REPOSITORY,
			useFactory: (dataSource: DataSource) => new TypeOrmProductRepository(dataSource.getRepository(ProductEntity)),
			inject: [DataSource],
		}
	: {
			provide: PRODUCT_REPOSITORY,
			useClass: InMemoryProductRepository,
		};

@Module({
	imports: typeOrmFeatureImports,
	controllers: [ProductController],
	providers: [CreateProductUseCase, GetAllProductsUseCase, GetProductUseCase, repositoryProvider],
})
export class ProductModule {}
