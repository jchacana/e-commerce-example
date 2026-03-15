import { Repository } from 'typeorm';
import { Product } from '../../../domain/product/product';
import { IProductRepository } from '../../../domain/product/product.repository';
import { ProductEntity } from './entities/product.entity';

export class TypeOrmProductRepository implements IProductRepository {
	constructor(private readonly repo: Repository<ProductEntity>) {}

	async save(product: Product): Promise<Product> {
		const entity = new ProductEntity();
		entity.id = product.id;
		entity.name = product.name;
		entity.price = product.price;
		await this.repo.save(entity);
		return product;
	}

	async findById(id: string): Promise<Product | null> {
		const entity = await this.repo.findOneBy({ id });
		if (!entity) return null;
		return new Product(entity.id, entity.name, Number(entity.price));
	}

	async findAll(): Promise<Product[]> {
		const entities = await this.repo.find();
		return entities.map((e) => new Product(e.id, e.name, Number(e.price)));
	}
}
