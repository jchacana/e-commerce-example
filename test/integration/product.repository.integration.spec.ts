import './setup';
import { DataSource } from 'typeorm';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { IProductRepository } from '../../src/domain/product/product.repository';
import { Product } from '../../src/domain/product/product';
import { ProductEntity } from '../../src/infrastructure/persistence/typeorm/entities/product.entity';
import { TypeOrmProductRepository } from '../../src/infrastructure/persistence/typeorm/typeorm-product.repository';

jest.setTimeout(60000);

describe('TypeOrmProductRepository (integration)', () => {
  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;
  let repository: IProductRepository;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:16').start();
    dataSource = new DataSource({
      type: 'postgres',
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      entities: [ProductEntity],
      synchronize: true,
    });
    await dataSource.initialize();
    repository = new TypeOrmProductRepository(dataSource.getRepository(ProductEntity));
  });

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
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
