import { Inject } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/product/product.repository';

export class GetProductUseCase {
	constructor(@Inject(PRODUCT_REPOSITORY) private readonly repository: IProductRepository) {}

	execute(id: string) {
		return this.repository.findById(id);
	}
}
