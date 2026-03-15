import { Inject } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/product/product.repository';

export class GetAllProductsUseCase {
	constructor(@Inject(PRODUCT_REPOSITORY) private readonly repository: IProductRepository) {}

	execute() {
		return this.repository.findAll();
	}
}
