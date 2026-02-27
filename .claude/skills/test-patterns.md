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
