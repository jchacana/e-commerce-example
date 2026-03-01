---
name: test-patterns
description: Test code templates for this project — load when writing acceptance tests, controller unit tests, or use case unit tests
---

## Acceptance test (Supertest)

```typescript
it('creates a product and returns 201', async () => {
  await request(app.getHttpServer())
    .post('/products')
    .send({ name: 'Widget', price: 9.99 })
    .expect(201)
    .expect(({ body }) => {
      expect(body.id).toBeDefined();
      expect(body.name).toBe('Widget');
    });
});
```

## Acceptance test — fresh app for state isolation

When a scenario requires a clean repository (e.g. "returns empty list"), spin up a
dedicated app instance rather than relying on shared state:

```typescript
async function buildApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.init();
  return app;
}

it('returns 200 with an empty array when no products exist', async () => {
  const freshApp = await buildApp();

  await request(freshApp.getHttpServer())
    .get('/products')
    .expect(200)
    .expect(({ body }) => { expect(body).toEqual([]); });

  await freshApp.close();
});
```

## Use case stub (to unblock controller test before use case is implemented)

When the controller test needs to import a use case that doesn't exist yet, create a
throwing stub first. This lets the controller test go RED on behaviour, not on missing
types. Then write the use case spec (RED), implement it (GREEN), replace the stub.

```typescript
// get-product.use-case.ts — stub
export class GetProductUseCase {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly repository: IProductRepository) {}

  execute(_id: string): Promise<never> {
    throw new Error('Not implemented');
  }
}
```

## Unit test — controller (London school)

```typescript
it('delegates to CreateProductUseCase with a command', async () => {
  const product = Product.create('1', 'Widget', 9.99);
  mockCreateProduct.execute.mockResolvedValue(product);

  const result = await controller.create({ name: 'Widget', price: 9.99 });

  expect(mockCreateProduct.execute).toHaveBeenCalledWith(
    new CreateProductCommand('Widget', 9.99),
  );
  expect(result).toBe(product);
});
```

## Unit test — use case (London school)

```typescript
it('saves a new product via the repository', async () => {
  mockRepository.save.mockResolvedValue(savedProduct);

  const result = await useCase.execute(new CreateProductCommand('Widget', 9.99));

  expect(mockRepository.save).toHaveBeenCalledTimes(1);
  const [saved] = mockRepository.save.mock.calls[0];
  expect(saved.name).toBe('Widget');
  expect(saved.price).toBe(9.99);
  expect(result).toBe(savedProduct);
});
```
