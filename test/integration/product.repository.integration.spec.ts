import { DataSource } from 'typeorm';
import { IProductRepository } from '../../src/domain/product/product.repository';
import { Product } from '../../src/domain/product/product';
import { ProductEntity } from '../../src/infrastructure/persistence/typeorm/entities/product.entity';
import { TypeOrmProductRepository } from '../../src/infrastructure/persistence/typeorm/typeorm-product.repository';

describe('TypeOrmProductRepository (integration)', () => {
  let dataSource: DataSource;
  let repository: IProductRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'postgres',
      url: process.env['INTEGRATION_DB_URL'],
      entities: [ProductEntity],
      synchronize: true,
    });
    await dataSource.initialize();
    repository = new TypeOrmProductRepository(dataSource.getRepository(ProductEntity));
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(ProductEntity).clear();
  });

  it('saves a product and retrieves it by id', async () => {
    const product = Product.create('p-1', 'Widget', 9.99);
    await repository.save(product);

    const found = await repository.findById('p-1');
    expect(found).not.toBeNull();
    expect(found!.id).toBe('p-1');
    expect(found!.name).toBe('Widget');
    expect(found!.price).toBe(9.99);
  });

  it('returns null when no product with that id exists', async () => {
    const result = await repository.findById('does-not-exist');
    expect(result).toBeNull();
  });

  it('returns all saved products', async () => {
    await repository.save(Product.create('p-1', 'Widget', 9.99));
    await repository.save(Product.create('p-2', 'Gadget', 19.99));

    const all = await repository.findAll();
    expect(all).toHaveLength(2);
    expect(all.map((p) => p.id)).toEqual(expect.arrayContaining(['p-1', 'p-2']));
  });

  it('returns an empty array when no products exist', async () => {
    const all = await repository.findAll();
    expect(all).toEqual([]);
  });
});
